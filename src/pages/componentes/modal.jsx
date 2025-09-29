import { useState } from "react";
import { Modal, Button, Form, Row, Col, FormLabel } from 'react-bootstrap';
import { toast } from "react-toastify";
import { FaPaw } from 'react-icons/fa';

function ModalMascostas({ actualizarMascotas }) {
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [tipo, setTipo] = useState("");
  const [imagen, setImagen] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("No hay sesión activa");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("tipo", tipo);
        formData.append("raza", raza);
        formData.append("edad", edad);
        formData.append("peso", peso);
        if (imagen) {
            formData.append("imagen", imagen);
        }

        const res = await fetch("http://localhost:5000/api/mascotas", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error al agregar mascota');
        }

        const data = await res.json();
        toast.success('Mascota agregada exitosamente');
        handleClose();
        actualizarMascotas();

    } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al conectar con el servidor");
    }
  };

  return (
    <>
      <Button onClick={handleShow} className="btn-agregar-mascota" style={{ backgroundColor: "#F97316", borderColor: "#F97316" }}> 
        Agregar Mascota
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPaw style={{ marginRight: '10px' }} />
            Agregar una Nueva Mascota
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formGridNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Rocky"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="formGridRaza">
                <Form.Label>Raza</Form.Label>
                <Form.Control
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej: Golden Retriever"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} xs="6" md="4" controlId="formGridEdad">
                <Form.Label>Edad (años)</Form.Label>
                <Form.Control
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  placeholder="Ej: 2"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} xs="6" md="4" controlId="formGridPeso">
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ej: 15.5"
                  required
                />
              </Form.Group>
              
              <Form.Group as={Col} md="4" controlId="formGridSexo">
                <Form.Label>Sexo</Form.Label>
                <Form.Select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="" disabled>Seleccione...</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Foto de la Mascota</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </Form.Group>

            <Modal.Footer className="mt-4">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-guardar-cambios" style={{ backgroundColor: "#F97316", borderColor: "#F97316" }}>
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalMascostas;