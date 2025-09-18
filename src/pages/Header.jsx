import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container";
import Notificaciones from "./notificaciones.jsx";
import Mensajes from "./mensajes.jsx";
import Usuario from "./Usuario.jsx";

function Cabecera() {
  return (
    <>
      <nav className="navbar bg-body-tertiary fixed-top" id="navbar">
        <Container className="d-flex align-items-center justify-content-between">
          <a className="navbar-brand" href="#">
            <img src="/petconnect.webp" alt="PetConnect" width="33" height="32" />
          </a>
          <h1 className="navbar-brand mb-0">PetConnect</h1>
          <form className="d-flex rounded-pill mx-auto" role="search" style={{ flex: 1, maxWidth: "500px" }}>
              <input
                className="form-control rounded-pill"
                type="search"
                placeholder="Buscar mascotas, dueños..."
                aria-label="Buscar mascotas, dueños.."
              />
          </form>
          <Notificaciones />
          <Mensajes />
          <Usuario />
        </Container>
      </nav>
      <Perfil />
    </>
  );
}

function Perfil() {
  return (
    <>
      <div style={{ marginTop: "100px", marginLeft: "160px", width: "262px", height: "244px", backgroundColor: "#d51a1aff"}}>
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ padding: "20px" }}>
          <img className="rounded-5" src="/petconnect.webp" alt="PetConnect" width="80" height="80" />
          <h5 className="mt-2">Pedro Ramirez</h5>
          <p>Amante de los gatos</p>
        </div> 
      </div>
    </>
  );
}



export default Cabecera;
