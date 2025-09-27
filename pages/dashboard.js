import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState('');
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token }})
      .then(r => r.json())
      .then(d => setUser(d.user || null))
    fetch('/api/books').then(r=>r.json()).then(d=>setBooks(d || []))
  }, [])

  async function addBook(e) {
    e.preventDefault()
    setError('')

    try{
    const token = localStorage.getItem('token')
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {'Content-Type':'application/json', Authorization: 'Bearer ' + token},
      body: JSON.stringify({ title, author })
    })
    if (res.ok) {
      const b = await res.json()
      setBooks(prev=>[b, ...prev])
      setTitle(''); setAuthor('')
    } else {
      alert('No autorizado o error')
    }
  }
  catch{
    setError("Fallo al registrar libro")
  }
  }

  async function delBook(id) {
    setError('')

    try{
    const token = localStorage.getItem('token')
    if (!confirm('Eliminar libro?')) return
    const res = await fetch('/api/books/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
    if (res.ok) setBooks(prev=>prev.filter(b=>b._id !== id))
    }
    catch{
      setError("Fallo al eliminar libro")
    }
  }

  return (
    <div className="container">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div>
          {user ? <span className="mr-4">Hola, {user.name} ({user.role})</span> : 'Cargando...'}
          <button className="px-2 py-1 border rounded" onClick={()=>{ localStorage.removeItem('token'); router.push('/') }}>Salir</button>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-medium">Añadir libro (solo admin)</h2>
        <form onSubmit={addBook} className="flex gap-2 mt-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="p-2 border rounded" />
          <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Autor" className="p-2 border rounded" />
          <button className="px-3 py-2 bg-blue-600 text-white rounded">Agregar</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-medium">Libros</h2>
        <ul className="space-y-3 mt-3">
          {books.map(b=>(
            <li key={b._id} className="p-3 border rounded bg-white flex justify-between">
              <div>
                <strong>{b.title}</strong>
                <div className="text-sm">Autor: {b.author}</div>
              </div>
              {user && user.role === 'admin' && (
                <button className="px-2 py-1 border rounded" onClick={()=>delBook(b._id)}>Eliminar</button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
