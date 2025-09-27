import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getBooks() {
            try {
                const response = await fetch('/api/books');

                if (!response.ok) {
                    throw new Error('No se pudieron cargar los libros.');
                }

                const data = await response.json();
                setBooks(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getBooks();
    }, []);

    if (loading) return <div className="container"><p>Cargando libros...</p></div>;

    if (error) return <div className="container"><p className="text-red-500">Error: {error}</p></div>;

    return (
        <div className="container">
            <header className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-semibold">Mini Biblioteca</h1>
                <nav className="space-x-4">
                    <Link href="/login">Iniciar Sesion</Link>
                    <Link href="/register">Registro</Link>
                </nav>
            </header>

            <section>
                <h2 className="text-2xl font-medium mb-4">Libros disponibles</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {books.map(book => (
                        <li key={book._id} className="p-4 border rounded bg-white">
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm">Autor: {book.author}</p>
                            <p className="text-sm">Año: {book.year}</p>
                            <p className="mt-2 text-sm">{book.description}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}