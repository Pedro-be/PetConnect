import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/registro";
import Header from "./pages/Header";
import PerfilUsuario from "./pages/PerfilUsuario";
import MisPublicaciones from './pages/MisPublicaciones';
import Citas from "./pages/Citas";
import SearchResults from './pages/SearchResults';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/PerfilUsuario" element={<PerfilUsuario />} />
        <Route path="/MisPublicaciones" element={<MisPublicaciones />} />
        <Route path="/Citas" element={<Citas />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      <ToastContainer
                position="top-right" // Posición en la pantalla
                autoClose={4000}       // Se cierra automáticamente después de 4 segundos
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
    </BrowserRouter>
  );
}

export default App;
