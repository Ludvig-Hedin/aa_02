import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { createGmailService } from '@/services/google/GmailService'

/**
 * API route for accessing Gmail messages
 * 
 * This route allows fetching recent emails and searching for emails
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create Supabase server client
  const supabase = createPagesServerClient({ req, res })
  
  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be signed in to access this endpoint',
    })
  }
  
  // Check if the user has connected Google services
  const { data: settings } = await supabase
    .from('user_settings')
    .select('settings')
    .eq('user_id', session.user.id)
    .single()
  
  if (!settings?.settings?.googleMail) {
    return res.status(400).json({
      error: 'Gmail not connected',
      message: 'You need to connect Gmail in settings first',
    })
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    // Create the Gmail service
    const gmailService = createGmailService(supabase, session.user.id)
    
    // Check if this is a search query
    const query = req.query.q
    const maxResults = req.query.maxResults ? parseInt(req.query.maxResults as string) : 10
    
    if (query && typeof query === 'string') {
      // Search for emails
      const emails = await gmailService.searchEmails(query, maxResults)
      return res.status(200).json(emails)
    } else {
      // Get recent emails
      const emails = await gmailService.getRecentEmails(maxResults)
      return res.status(200).json(emails)
    }
  } catch (error) {
    console.error('Error accessing Gmail:', error)
    return res.status(500).json({
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Failed to access Gmail',
    })
  }
} 