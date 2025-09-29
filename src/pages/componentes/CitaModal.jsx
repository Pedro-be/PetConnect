import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPaw, FaCalendarAlt, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';

const CitaModal = ({ show, onHide, onSave, onDelete, cita, mascotas }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (cita) {
            setFormData({
                ...cita.resource,
                fecha_hora: new Date(cita.start).toISOString().slice(0, 16)
            });
        } else {
            setFormData({ mascota_id: '', titulo: '', tipo_cita: 'Veterinario', fecha_hora: '', ubicacion: '', notas: '' });
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
                    
                    {/*Estructura en dos columnas para Mascota y Tipo */}
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