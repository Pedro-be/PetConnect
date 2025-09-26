import { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        className="d-md-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          backgroundColor: '#F97316',
          border: 'none',
          borderRadius: '5px',
          padding: '8px',
          color: 'white',
        }}
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'show' : ''}`} style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: '#ffffff',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        '@media (min-width: 768px)': {
          transform: 'translateX(0)',
        }
      }}>
        {/* Logo y título */}
        <div className="text-center mb-4">
          <img src="/petconnect.webp" alt="Logo" style={{ width: '64px', height: '64px' }} />
          <h2 className="mt-2" style={{ color: '#F97316' }}>PetConnect</h2>
        </div>

        {/* Menú de opciones */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <MenuItem icon="👤" text="Mi Perfil" to="/PerfilUsuario" onClick={() => setIsOpen(false)} />
            <MenuItem icon="🐾" text="Mis Mascotas" to="/mascotas" onClick={() => setIsOpen(false)} />
            <MenuItem icon="📅" text="Citas" to="/citas" onClick={() => setIsOpen(false)} />
            <MenuItem icon="💊" text="Medicamentos" to="/medicamentos" onClick={() => setIsOpen(false)} />
            <MenuItem icon="📝" text="Historial" to="/historial" onClick={() => setIsOpen(false)} />
            <MenuItem icon="⚙️" text="Configuración" to="/configuracion" onClick={() => setIsOpen(false)} />
          </ul>
        </nav>

        {/* Botón de cerrar sesión */}
        <div style={{ position: 'absolute', bottom: '20px', width: '210px' }}>
          <button 
            className="btn w-100"
            style={{ 
              backgroundColor: '#F97316',
              color: 'white'
            }}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Overlay para cerrar el menú en móviles */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}
    </>
  );
}

// Componente MenuItem
function MenuItem({ icon, text, to, onClick }) {
  return (
    <li className="mb-3">
      <Link 
        to={to}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          textDecoration: 'none',
          color: '#4B5563',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        }}
        className="menu-item"
        onClick={onClick}
      >
        <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>
        {text}
      </Link>
    </li>
  );
}

export default Sidebar;