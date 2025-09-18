import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormSelect from "react-bootstrap/esm/FormSelect";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

function ModalMascostas() {
  // ✅ Declarar los estados
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

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("raza", raza);
    formData.append("edad", edad);
    formData.append("peso", peso);
    formData.append("tipo", tipo);
    if (imagen) formData.append("imagen", imagen);

    try {
      const res = await fetch("http://localhost:5000/registrar-mascota", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 2000 });
        handleClose();
        // Limpiar campos
        setNombre("");
        setRaza("");
        setEdad("");
        setPeso("");
        setTipo("");
        setImagen(null);
      } else {
        toast.error(result.message || "Error al registrar");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <>
      <button
        className="btn"
        onClick={handleShow}
        style={{
          backgroundColor: "#F97316",
          color: "white",
          padding: "8px 20px",
        }}
      >
        Agregar Mascota
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar una nueva Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formFile">
              <FormLabel>Foto de la Mascota</FormLabel>
              <Form.Control
                type="file"
                onChange={(e) => setImagen(e.target.files[0])} // 📌 capturar archivo
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <FormLabel>Nombre de la Mascota</FormLabel>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa el nombre de tu mascota"
              />

              <FormLabel className="mt-2">Raza de la Mascota</FormLabel>
              <Form.Control
                type="text"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                placeholder="Ingrese la raza de su mascota"
              />

              <FormLabel className="mt-2">Edad de la Mascota</FormLabel>
              <Form.Control
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Ingrese la edad de su mascota"
              />

              <FormLabel className="mt-2">Peso de la Mascota</FormLabel>
              <Form.Control
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ingrese el peso de su mascota"
              />

              <FormLabel className="mt-2">Tipo de Mascota</FormLabel>
              <Form.Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Seleccione el tipo de mascota</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </Form.Select>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#F97316",
                  color: "white",
                }}
              >
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