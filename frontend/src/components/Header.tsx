export default function Header() {
  const onLogin = () => {
    // Correct backend route to start OAuth
    window.location.href = 'http://localhost:5555/auth/soundcloud'
  }

  return (
    <header className='flex items-center justify-between p-4'>
      <h1 className='text-2xl font-semibold text-orange-500'>
        SoundCloud Explorer
      </h1>
      <div>
        <button
          className='cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200'
          onClick={onLogin}
        >
          Login
        </button>
      </div>
    </header>
  )
}
