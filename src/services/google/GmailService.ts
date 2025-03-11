import { SupabaseClient } from '@supabase/supabase-js'

interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload?: {
    headers: Array<{
      name: string
      value: string
    }>
    parts?: Array<{
      mimeType: string
      body: {
        data?: string
        size: number
      }
    }>
    body?: {
      data?: string
      size: number
    }
  }
  labelIds: string[]
  internalDate: string
}

interface EmailSummary {
  id: string
  threadId: string
  snippet: string
  subject: string
  from: string
  to: string
  date: string
}

/**
 * Gmail service
 * 
 * Provides methods to interact with Gmail API
 */
export class GmailService {
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
   * Get the user's recent emails
   */
  async getRecentEmails(maxResults = 10): Promise<EmailSummary[]> {
    const accessToken = await this.getAccessToken()
    
    // Get the list of message IDs
    const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages')
    url.searchParams.append('maxResults', maxResults.toString())
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch email list')
    }
    
    const data = await response.json()
    const messageIds = data.messages.map((message: { id: string }) => message.id)
    
    // Fetch the details for each message
    const emails: EmailSummary[] = []
    
    for (const messageId of messageIds) {
      const messageDetails = await this.getEmailDetails(messageId)
      emails.push(messageDetails)
    }
    
    return emails
  }
  
  /**
   * Get the details of a specific email
   */
  async getEmailDetails(messageId: string): Promise<EmailSummary> {
    const accessToken = await this.getAccessToken()
    
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch email details for message ID: ${messageId}`)
    }
    
    const message: GmailMessage = await response.json()
    
    // Extract headers
    const headers = message.payload?.headers || []
    const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || 'No Subject'
    const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown'
    const to = headers.find(h => h.name.toLowerCase() === 'to')?.value || 'Unknown'
    const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || 'Unknown'
    
    return {
      id: message.id,
      threadId: message.threadId,
      snippet: message.snippet,
      subject,
      from,
      to,
      date,
    }
  }
  
  /**
   * Search for emails based on a query
   */
  async searchEmails(query: string, maxResults = 10): Promise<EmailSummary[]> {
    const accessToken = await this.getAccessToken()
    
    // Search for messages matching the query
    const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages')
    url.searchParams.append('q', query)
    url.searchParams.append('maxResults', maxResults.toString())
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to search emails')
    }
    
    const data = await response.json()
    
    if (!data.messages || data.messages.length === 0) {
      return []
    }
    
    const messageIds = data.messages.map((message: { id: string }) => message.id)
    
    // Fetch the details for each message
    const emails: EmailSummary[] = []
    
    for (const messageId of messageIds) {
      const messageDetails = await this.getEmailDetails(messageId)
      emails.push(messageDetails)
    }
    
    return emails
  }
}

/**
 * Create a Gmail service instance
 */
export const createGmailService = (
  supabase: SupabaseClient,
  userId: string
): GmailService => {
  return new GmailService(supabase, userId)
} 