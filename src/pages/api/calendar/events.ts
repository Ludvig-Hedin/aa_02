import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { createGoogleCalendarService } from '@/services/google/CalendarService'

/**
 * API route for accessing Google Calendar events
 * 
 * This route allows fetching upcoming events and creating new events
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
  
  if (!settings?.settings?.googleCalendar) {
    return res.status(400).json({
      error: 'Google Calendar not connected',
      message: 'You need to connect Google Calendar in settings first',
    })
  }
  
  try {
    // Create the Google Calendar service
    const calendarService = createGoogleCalendarService(supabase, session.user.id)
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get upcoming events
        const maxResults = req.query.maxResults ? parseInt(req.query.maxResults as string) : 10
        const events = await calendarService.getUpcomingEvents(maxResults)
        return res.status(200).json(events)
        
      case 'POST':
        // Create a new event
        const {
          summary,
          description,
          location,
          startDateTime,
          endDateTime,
          timeZone,
          attendees,
        } = req.body
        
        if (!summary || !startDateTime || !endDateTime) {
          return res.status(400).json({
            error: 'Missing required fields',
            message: 'Summary, start date/time, and end date/time are required',
          })
        }
        
        const newEvent = await calendarService.createEvent({
          summary,
          description,
          location,
          startDateTime,
          endDateTime,
          timeZone,
          attendees,
        })
        
        return res.status(201).json(newEvent)
        
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error accessing Google Calendar:', error)
    return res.status(500).json({
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Failed to access Google Calendar',
    })
  }
} 