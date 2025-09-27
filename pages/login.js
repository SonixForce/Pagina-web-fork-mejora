import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    setError('')
    
    try {
      e.preventDefault()
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        router.push('/dashboard')
      } else {
        alert(data.message || 'Error')
      }
    }
    catch{
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input required value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Entrar</button>
      </form>
    </div>
  )
}
