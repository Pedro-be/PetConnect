

// src/api.js

const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // ✅ Solo añade la cabecera si el token es una cadena de texto válida
    if (token && token !== 'null' && token !== 'undefined') {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const finalOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    // Asume que la URL base de la API está en una variable de entorno
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}${url}`, finalOptions);

    if (!response.ok) {
        const errorData = await response.json();
        // Usa 'message' que es lo que hemos estado usando en el backend
        throw new Error(errorData.message || 'Error en la petición a la API');
    }

    // ✅ Maneja respuestas que no son JSON (como en un DELETE exitoso)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    
    return; // No retorna nada si no hay contenido JSON
};

export default apiFetch;