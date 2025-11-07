export default function Header() {
  const onLogin = () => {
    // Correct backend route to start OAuth
    window.location.href = 'http://localhost:5555/auth/soundcloud'
  }

  return (
    <header
      style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12 }}
    >
      <h1>SoundCloud Explorer</h1>
      <div style={{ marginLeft: 'auto' }}>
        <button onClick={onLogin}>Login with SoundCloud</button>
      </div>
    </header>
  )
}
