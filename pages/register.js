import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') 
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, introduce un email válido.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password })
      })

      if (res.ok) {
        router.push('/login')
      } else {
        const errorData = await res.json()
        setError(errorData.message || 'Error al registrar. Inténtalo de nuevo.')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.')
    }
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="w-full p-2 border rounded" />
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" type="password" className="w-full p-2 border rounded" />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="px-4 py-2 bg-blue-600 text-white rounded">Crear cuenta</button>
      </form>
    </div>
  )
}