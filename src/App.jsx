import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/registro";
import Header from "./pages/Header";
import PerfilUsuario from "./pages/PerfilUsuario";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
