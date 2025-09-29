
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import apiFetch from '../api';
import Sidebar from './Sidebar';
import PostCard from './componentes/PostCard';
import UserSearchResultCard from './componentes/UserSearchResultCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ usuarios: [], publicaciones: [] });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null); // Necesario para PostCard

    useEffect(() => {
        if (query) {
            setLoading(true);
            Promise.all([
                apiFetch(`/api/search?q=${query}`),
                apiFetch('/api/usuario/perfil') // Obtenemos el usuario actual
            ])
            .then(([searchResults, userData]) => {
                setResults(searchResults);
                setCurrentUser(userData);
            })
            .catch(error => console.error("Error en la búsqueda:", error))
            .finally(() => setLoading(false));
        }
    }, [query]);

    if (loading) return <div>Buscando...</div>;

    const { usuarios, publicaciones } = results;

    return (
        <div className="d-flex">
            <Sidebar />
            <main className="content-area">
                <header className="page-header">
                    <div>
                        <h2 className="page-title">Resultados para: "{query}"</h2>
                        <p className="page-subtitle mt-2">
                            {usuarios.length} usuarios y {publicaciones.length} publicaciones encontradas.
                        </p>
                    </div>
                </header>

                <Tabs defaultActiveKey="publicaciones" id="search-results-tabs" className="mb-3">
                    <Tab eventKey="publicaciones" title={`Publicaciones (${publicaciones.length})`}>
                        {publicaciones.length > 0 ? (
                            publicaciones.map(post => (
                                <PostCard key={post.id} postData={post} currentUser={currentUser} />
                            ))
                        ) : (
                            <p>No se encontraron publicaciones.</p>
                        )}
                    </Tab>
                    <Tab eventKey="usuarios" title={`Usuarios (${usuarios.length})`}>
                        {usuarios.length > 0 ? (
                            usuarios.map(user => (
                                <UserSearchResultCard key={user.id} user={user} />
                            ))
                        ) : (
                            <p>No se encontraron usuarios.</p>
                        )}
                    </Tab>
                </Tabs>
            </main>
        </div>
    );
};

export default SearchResults;