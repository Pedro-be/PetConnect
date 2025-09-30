import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';


const formatLocalDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    // Verificamos si la fecha es válida para evitar errores
    if (isNaN(d.getTime())) {
        console.error("Fecha inválida recibida:", date);
        return '';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const CitaModal = ({ show, onHide, onSave, onDelete, cita, mascotas }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (show) { // Solo actualiza cuando el modal se muestra
            if (cita) {
                setFormData({
                    ...cita.resource,
                    // Usamos nuestra nueva función para mostrar la hora local correcta
                    fecha_hora: formatLocalDateTime(cita.start)
                });
            } else {
                setFormData({ 
                    mascota_id: '', 
                    titulo: '', 
                    tipo_cita: 'Veterinario', 
                    fecha_hora: '', 
                    ubicacion: '', 
                    notas: '' 
                });
            }
        }
    }, [cita, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.mascota_id || !formData.titulo || !formData.fecha_hora) {
            toast.error('Por favor, completa el título, la mascota y la fecha.');
            return;
        }
        onSave(formData);
    };


    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="cita-modal">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    {cita ? "Detalles de la Cita" : "Agendar Nueva Cita"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-4">
                        <Form.Label>Título de la Cita</Form.Label>
                        <Form.Control type="text" name="titulo" value={formData.titulo || ""} onChange={handleChange} placeholder="Ej: Chequeo anual" />
                    </Form.Group>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label><FaPaw className="me-2" />Mascota</Form.Label>
                                <Form.Select name="mascota_id" value={formData.mascota_id || ""} onChange={handleChange}>
                                    <option value="" disabled>Seleccionar...</option>
                                    {mascotas && mascotas.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label>Tipo de Cita</Form.Label>
                                <Form.Select name="tipo_cita" value={formData.tipo_cita || "Veterinario"} onChange={handleChange}>
                                    <option>Veterinario</option>
                                    <option>Peluquería</option>
                                    <option>Vacunación</option>
                                    <option>Paseo</option>
                                    <option>Otro</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label><FaCalendarAlt className="me-2" />Fecha y Hora</Form.Label>
                        <Form.Control type="datetime-local" name="fecha_hora" value={formData.fecha_hora || ""} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label><FaMapMarkerAlt className="me-2" />Ubicación (Opcional)</Form.Label>
                        <Form.Control type="text" name="ubicacion" value={formData.ubicacion || ""} onChange={handleChange} placeholder="Ej: Clínica Vet Central" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label><FaNotesMedical className="me-2" />Notas (Opcional)</Form.Label>
                        <Form.Control as="textarea" rows={3} name="notas" value={formData.notas || ""} onChange={handleChange} placeholder="Ej: Recordar preguntar sobre la alimentación..." />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="cita-modal-footer">
                {cita && (
                    <Button variant="outline-danger" className="me-auto" onClick={() => onDelete(cita.id)}>
                        Eliminar
                    </Button>
                )}
                <Button variant="light" onClick={onHide}>Cancelar</Button>
                <Button 
                    onClick={handleSave} 
                    style={{ backgroundColor: "#F97316", border: 'none' }}
                >
                    {cita ? "Guardar Cambios" : "Agendar Cita"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CitaModal;