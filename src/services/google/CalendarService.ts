import { SupabaseClient } from '@supabase/supabase-js'

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted'
  }>
}

interface CreateCalendarEventParams {
  summary: string
  description?: string
  location?: string
  startDateTime: string
  endDateTime: string
  timeZone?: string
  attendees?: string[]
}

/**
 * Google Calendar service
 * 
 * Provides methods to interact with Google Calendar API
 */
export class GoogleCalendarService {
  private supabase: SupabaseClient
  private userId: string
  
  constructor(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase
    this.userId = userId
  }
  
  /**
   * Get the user's access token
   * If the token is expired, it will be refreshed
   */
  private async getAccessToken(): Promise<string> {
    // Get the current token from the database
    const { data: tokenData, error } = await this.supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', this.userId)
      .eq('provider', 'google')
      .single()
    
    if (error || !tokenData) {
      throw new Error('Google access token not found')
    }
    
    // Check if the token is expired
    if (new Date(tokenData.expires_at) <= new Date()) {
      // Token is expired, refresh it
      const googleClientId = process.env.GOOGLE_CLIENT_ID
      const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
      
      if (!googleClientId || !googleClientSecret) {
        throw new Error('Google OAuth credentials not configured')
      }
      
      if (!tokenData.refresh_token) {
        throw new Error('Google refresh token not found')
      }
      
      // Request a new access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: googleClientId,
          client_secret: googleClientSecret,
          refresh_token: tokenData.refresh_token,
          grant_type: 'refresh_token',
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh Google access token')
      }
      
      const newTokens = await response.json()
      
      // Update the token in the database
      await this.supabase
        .from('user_tokens')
        .update({
          access_token: newTokens.access_token,
          expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', tokenData.id)
      
      return newTokens.access_token
    }
    
    return tokenData.access_token
  }
  
  /**
   * Get the user's upcoming calendar events
   */
  async getUpcomingEvents(maxResults = 10): Promise<CalendarEvent[]> {
    const accessToken = await this.getAccessToken()
    
    const now = new Date().toISOString()
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
    url.searchParams.append('timeMin', now)
    url.searchParams.append('maxResults', maxResults.toString())
    url.searchParams.append('singleEvents', 'true')
    url.searchParams.append('orderBy', 'startTime')
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events')
    }
    
    const data = await response.json()
    return data.items as CalendarEvent[]
  }
  
  /**
   * Create a new calendar event
   */
  async createEvent(params: CreateCalendarEventParams): Promise<CalendarEvent> {
    const accessToken = await this.getAccessToken()
    
    const event = {
      summary: params.summary,
      description: params.description,
      location: params.location,
      start: {
        dateTime: params.startDateTime,
        timeZone: params.timeZone || 'UTC',
      },
      end: {
        dateTime: params.endDateTime,
        timeZone: params.timeZone || 'UTC',
      },
      attendees: params.attendees?.map(email => ({ email })),
    }
    
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create calendar event')
    }
    
    return await response.json()
  }
}

/**
 * Create a Google Calendar service instance
 */
export const createGoogleCalendarService = (
  supabase: SupabaseClient,
  userId: string
): GoogleCalendarService => {
  return new GoogleCalendarService(supabase, userId)
} 