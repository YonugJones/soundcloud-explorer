import express from 'express'
import session from 'express-session'
import axios from 'axios'
import qs from 'qs'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5555
const CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID!
const CLIENT_SECRET = process.env.SOUNDCLOUD_CLIENT_SECRET!
const REDIRECT_URI = process.env.REDIRECT_URI!

app.use(
  cors({
    origin: 'http://localhost:5173', // frontend port
    credentials: true,
  })
)
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
)

// ✅ Route 1 — direct user to SoundCloud’s OAuth page
app.get('/auth/soundcloud', (req, res) => {
  const authUrl =
    `https://soundcloud.com/connect?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code&scope=non-expiring`
  res.redirect(authUrl)
})

// ✅ Route 2 — handle SoundCloud callback, exchange code for token
app.get('/auth/soundcloud/callback', async (req, res) => {
  const code = req.query.code as string
  if (!code) return res.status(400).send('Missing code parameter')

  try {
    const tokenResponse = await axios.post(
      'https://api.soundcloud.com/oauth2/token',
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const { access_token } = tokenResponse.data
    req.session.access_token = access_token // store in session

    // Redirect to frontend with success message or token
    res.redirect(`http://localhost:5173?connected=true`)
  } catch (err: any) {
    console.error('Token exchange failed:', err.response?.data || err.message)
    res.status(500).send('Error exchanging authorization code')
  }
})

// ✅ Route 3 — get user info
app.get('/api/me', async (req, res) => {
  const token = req.session.access_token
  if (!token) {
    console.log('❌ No access token found in session')
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    console.log('✅ Using token:', token.slice(0, 10) + '...')
    const response = await axios.get('https://api.soundcloud.com/me', {
      headers: { Authorization: `OAuth ${token}` },
    })

    res.json(response.data)
  } catch (err: any) {
    console.error(
      '❌ Error fetching user info:',
      err.response?.data || err.message
    )
    res
      .status(err.response?.status || 500)
      .json({ error: 'Failed to fetch user info' })
  }
})

// ✅ Route 4 — get user tracks
app.get('/api/me/tracks', async (req, res) => {
  const token = req.session.access_token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const response = await axios.get('https://api.soundcloud.com/me/tracks', {
      headers: { Authorization: `OAuth ${token}` },
    })
    res.json(response.data)
  } catch (err: any) {
    console.error(
      '❌ Error fetching tracks:',
      err.response?.data || err.message
    )
    res.status(500).json({ error: 'Failed to fetch tracks' })
  }
})

// ✅ Route 5 — get user playlists
app.get('/api/me/playlists', async (req, res) => {
  const token = req.session.access_token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const response = await axios.get(
      'https://api.soundcloud.com/me/playlists',
      {
        headers: { Authorization: `OAuth ${token}` },
      }
    )
    res.json(response.data)
  } catch (err: any) {
    console.error(
      '❌ Error fetching playlists:',
      err.response?.data || err.message
    )
    res.status(500).json({ error: 'Failed to fetch playlists' })
  }
})

// ✅ Route 6 — get user likes
app.get('/api/me/likes', async (req, res) => {
  const token = req.session.access_token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const response = await axios.get('https://api.soundcloud.com/me/likes', {
      headers: { Authorization: `OAuth ${token}` },
    })
    res.json(response.data)
  } catch (err: any) {
    console.error('❌ Error fetching likes:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to fetch likes' })
  }
})

// ✅ Test route
app.get('/', (req, res) => res.send('Backend is running 🚀'))

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
