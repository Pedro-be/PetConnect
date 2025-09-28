

const apiFetch = async (url, options = {}) => {
    // Obtenemos el token de localStorage
    const token = localStorage.getItem('token');

    // Creamos las cabeceras por defecto
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Si tenemos un token, lo añadimos a la cabecera de Autorización
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Unimos las cabeceras por defecto con las que puedan venir en las opciones
    const finalOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    // Hacemos la llamada fetch a nuestra API
    const response = await fetch(`http://localhost:5000${url}`, finalOptions);

    if (!response.ok) {
        // Si la respuesta no es exitosa, intentamos leer el error del backend
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición a la API');
    }

    // Si la respuesta es exitosa, devolvemos los datos en formato JSON
    return response.json();
};

export default apiFetch;