import { useEffect, useState } from 'react'

interface UserProfile {
  username: string
  avatar_url: string
  permalink_url: string
}

function UserInfo() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    // only run if user just logged in
    if (window.location.search.includes('connected=true')) {
      fetch('http://localhost:5555/api/me', { credentials: 'include' })
        .then((res) => res.json())
        .then(setUser)
        .catch(console.error)
    }
  }, [])

  if (!user) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img
        src={user.avatar_url}
        alt={user.username}
        width={50}
        height={50}
        style={{ borderRadius: '50%' }}
      />
      <a href={user.permalink_url} target='blank' rel='noreferrer'>
        {user.username}
      </a>
    </div>
  )
}

export default UserInfo
