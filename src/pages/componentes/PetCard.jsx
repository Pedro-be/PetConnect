import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './PetCardEditable.css'; // Crearemos este archivo de estilos

const PetCard = ({ pet, onPetUpdate }) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({ ...pet });
  const [newImage, setNewImage] = useState(null); // Para el archivo de la nueva imagen
  const [imagePreview, setImagePreview] = useState(null); // Para la previsualización

  // Actualiza el estado si la prop `pet` cambia
  useEffect(() => {
    setFormData({ ...pet });
    // Resetea la previsualización cuando cambia la mascota
    setImagePreview(null);
  }, [pet]);

  // Manejador para los cambios en los inputs de texto y select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador para el cambio de imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      // Creamos una URL local para la previsualización de la imagen
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Manejador para guardar los cambios
  const handleSave = async (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    // Agregamos todos los campos del formulario
    dataToSend.append('nombre', formData.nombre);
    dataToSend.append('raza', formData.raza);
    dataToSend.append('edad', formData.edad);
    dataToSend.append('peso', formData.peso);
    dataToSend.append('tipo', formData.tipo);
    // Si hay una nueva imagen, la agregamos
    if (newImage) {
      dataToSend.append('imagen', newImage);
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la mascota');
      }

      const result = await response.json();
      toast.success(result.message);
      // Llama a la función del padre para actualizar la lista de mascotas en la UI
      onPetUpdate(result.mascota);

    } catch (error) {
      toast.error(error.message || 'Error al conectar con el servidor.');
    }
  };

  // Determina qué imagen mostrar: la previsualización, la actual, o la de por defecto
  const displayImage = imagePreview || (formData.imagen ? `${import.meta.env.VITE_API_URL}${formData.imagen}` : '/petconnect.webp');

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4 ">
      <Form onSubmit={handleSave} className="card h-100 shadow-sm border-0 editable-pet-card">
        <div className="card-body shadow bg-body rounded">
          <div className="pet-header">
            {/* Contenedor de la imagen y botón de cambio */}
            <div className="image-container">
              <img src={displayImage} alt={formData.nombre} className="pet-image-editable" />
              <label htmlFor={`image-upload-${pet.id}`} className="image-upload-label">
                <FaImage />
              </label>
              <input 
                id={`image-upload-${pet.id}`}
                type="file" 
                onChange={handleImageChange} 
                style={{ display: 'none' }}
                accept="image/*"
              />
            </div>
            {/* Nombre y Raza */}
            <div className="name-container">
              <Form.Control 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange}
                className="pet-name-input"
                required
              />
              <Form.Control 
                type="text" 
                name="raza" 
                value={formData.raza} 
                onChange={handleChange}
                className="pet-breed-input"
                required
              />
            </div>
          </div>

          <hr className="my-3" />

          {/* Fila de detalles: Edad y Peso */}
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Edad</Form.Label>
                <Form.Control 
                  type="number" 
                  name="edad" 
                  value={formData.edad} 
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="peso" 
                  step="0.1"
                  value={formData.peso} 
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Fila de detalles: Sexo y (opcional) Color */}
          <Row className="mt-2">
            <Col>
              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Button type="submit" className="btn-save-pet w-100 mt-4">
            <FaSave /> Guardar Cambios
          </Button>

        </div>
      </Form>
    </div>
  );
};

export default PetCard;