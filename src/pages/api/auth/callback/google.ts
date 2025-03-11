import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

/**
 * API route for handling Google OAuth callback
 * 
 * This route is called by Google after the user authorizes our application
 * It exchanges the authorization code for access and refresh tokens
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
    return res.redirect('/auth?error=Unauthorized')
  }
  
  try {
    // Extract the code and state from the query parameters
    const { code, state } = req.query
    
    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      return res.redirect('/settings?error=Invalid OAuth response')
    }
    
    // Verify the state parameter to prevent CSRF attacks
    const { data: stateData } = await supabase
      .from('oauth_states')
      .select('*')
      .eq('state', state)
      .eq('user_id', session.user.id)
      .eq('provider', 'google')
      .single()
    
    if (!stateData) {
      return res.redirect('/settings?error=Invalid state parameter')
    }
    
    // Delete the used state to prevent replay attacks
    await supabase
      .from('oauth_states')
      .delete()
      .eq('state', state)
    
    // Exchange the authorization code for tokens
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI
    
    if (!googleClientId || !googleClientSecret || !redirectUri) {
      return res.redirect('/settings?error=Missing Google OAuth configuration')
    }
    
    // Make a request to Google's token endpoint
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Google token exchange error:', errorData)
      return res.redirect('/settings?error=Failed to exchange authorization code')
    }
    
    const tokens = await tokenResponse.json()
    
    // Store the tokens securely in the database
    await supabase
      .from('user_tokens')
      .upsert({
        user_id: session.user.id,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        token_type: tokens.token_type,
        scopes: tokens.scope.split(' '),
      })
    
    // Get user info to determine which services were connected
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    
    if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json()
      
      // Update user settings to reflect connected services
      const { data: settings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', session.user.id)
        .single()
      
      const updatedSettings = {
        ...(settings?.settings || {}),
        googleCalendar: true,
        googleMail: true,
        googleUserInfo: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      }
      
      await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
    }
    
    // Redirect back to the settings page with success message
    res.redirect('/settings?success=Google services connected successfully')
  } catch (error) {
    console.error('Error handling Google OAuth callback:', error)
    res.redirect('/settings?error=Failed to connect Google services')
  }
} 