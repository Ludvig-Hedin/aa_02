import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

/**
 * API route for initiating Google OAuth flow
 * 
 * This route will redirect the user to Google's OAuth consent screen
 * After authorization, Google will redirect back to our callback route
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
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
  
  try {
    // Define the scopes we want to request
    // https://developers.google.com/identity/protocols/oauth2/scopes
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
    
    // Build the OAuth URL
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI
    
    if (!googleClientId || !redirectUri) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Google OAuth credentials not configured',
      })
    }
    
    // Create state parameter with user ID for security and identification
    // This will be verified in the callback route
    const state = Buffer.from(JSON.stringify({
      userId: session.user.id,
      timestamp: Date.now(),
    })).toString('base64')
    
    // Create the authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.append('client_id', googleClientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', scopes.join(' '))
    authUrl.searchParams.append('access_type', 'offline')
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('prompt', 'consent')
    
    // Store the state in the user's session (via Supabase)
    await supabase
      .from('oauth_states')
      .upsert({
        user_id: session.user.id,
        state,
        provider: 'google',
        created_at: new Date().toISOString(),
      })
    
    // Redirect the user to Google's OAuth consent screen
    res.redirect(authUrl.toString())
  } catch (error) {
    console.error('Error initiating Google OAuth flow:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to initiate Google OAuth flow',
    })
  }
} 