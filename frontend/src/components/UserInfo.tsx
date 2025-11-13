import { useEffect, useState } from 'react'

interface UserProfile {
  username: string
  avatar_url: string
  permalink_url: string
  full_name?: string
  city?: string
  followers_count: number
  followings_count: number
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
    <div className='flex items-center max-w-6xl mx-auto my-10 px-4 text-white'>
      <img
        className='rounded-full'
        src={user.avatar_url}
        alt={user.username}
        width={50}
        height={50}
      />
      <div className='flex flex-col ml-3'>
        <a
          className='text-3xl'
          href={user.permalink_url}
          target='blank'
          rel='noreferrer'
        >
          {user.username}
        </a>
        <a
          className='text-md mb-5'
          href={user.permalink_url}
          target='blank'
          rel='noreferrer'
        >
          {user.full_name}
        </a>
        <a
          className='text-xs'
          href={user.permalink_url}
          target='blank'
          rel='noreferrer'
        >
          {user.city}
        </a>
      </div>
    </div>
  )
}

export default UserInfo
