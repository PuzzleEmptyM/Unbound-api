export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace', color: '#ccc' }}>
      <h1 style={{ color: '#fff' }}>Unbound API</h1>
      <p>Cloud sync backend for the Unbound controller customizer.</p>
      <ul style={{ marginTop: '1rem', lineHeight: 2 }}>
        <li>GET  /api/auth/me</li>
        <li>POST /api/auth/logout</li>
        <li>GET  /api/layers</li>
        <li>POST /api/layers</li>
        <li>DEL  /api/layers?layer_id=</li>
        <li>GET  /api/configs</li>
        <li>POST /api/configs</li>
        <li>DEL  /api/configs?name=</li>
        <li>GET  /api/sync</li>
      </ul>
    </main>
  )
}
