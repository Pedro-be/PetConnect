import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPills, FaPaw, FaSyringe, FaCalendarAlt, FaClock, FaStickyNote } from 'react-icons/fa';
import './MedicamentoModal.css';

const MedicamentoModal = ({ show, onHide, onSave, onDelete, medicamento, mascotas }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (medicamento) {
            setFormData({
                ...medicamento,
                fecha_inicio: medicamento.fecha_inicio ? new Date(medicamento.fecha_inicio).toISOString().slice(0, 10) : '',
                fecha_fin: medicamento.fecha_fin ? new Date(medicamento.fecha_fin).toISOString().slice(0, 10) : ''
            });
        } else {
            setFormData({ mascota_id: '', nombre_medicamento: '', dosis: '', frecuencia: '', fecha_inicio: '', fecha_fin: '', notas: '' });
        }
    }, [medicamento, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.mascota_id || !formData.nombre_medicamento || !formData.fecha_inicio) {
            toast.error('Por favor, completa el nombre, la mascota y la fecha de inicio.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="medicamento-modal">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold d-flex align-items-center">
                    <FaPills className="me-2" style={{ color: '#F97316' }} />
                    {medicamento ? 'Editar Medicamento' : 'Añadir Nuevo Medicamento'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={7}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre del Medicamento</Form.Label>
                                <Form.Control type="text" name="nombre_medicamento" value={formData.nombre_medicamento || ''} onChange={handleChange} placeholder="Ej: Amoxicilina"/>
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3">
                                <Form.Label>Para la mascota</Form.Label>
                                <Form.Select name="mascota_id" value={formData.mascota_id || ''} onChange={handleChange}>
                                    <option value="" disabled>Seleccionar...</option>
                                    {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Dosis</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><FaSyringe /></InputGroup.Text>
                                    <Form.Control type="text" name="dosis" value={formData.dosis || ''} onChange={handleChange} placeholder="Ej: 1 pastilla, 5ml" />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                             <Form.Group className="mb-3">
                                <Form.Label>Frecuencia</Form.Label>
                                 <InputGroup>
                                    <InputGroup.Text><FaClock /></InputGroup.Text>
                                    <Form.Control type="text" name="frecuencia" value={formData.frecuencia || ''} onChange={handleChange} placeholder="Ej: Cada 8 horas" />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                   
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Inicio</Form.Label>
                                <Form.Control type="date" name="fecha_inicio" value={formData.fecha_inicio || ''} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Fin (Opcional)</Form.Label>
                                <Form.Control type="date" name="fecha_fin" value={formData.fecha_fin || ''} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group>
                        <Form.Label><FaStickyNote className="me-2"/>Notas (Opcional)</Form.Label>
                        <Form.Control as="textarea" rows={3} name="notas" value={formData.notas || ''} onChange={handleChange} placeholder="Ej: Administrar con comida..." />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="medicamento-modal-footer">
                {medicamento && <Button variant="outline-danger" className="me-auto" onClick={() => onDelete(medicamento.id)}>Eliminar</Button>}
                <Button variant="light" onClick={onHide}>Cancelar</Button>
                <Button style={{ backgroundColor: "#F97316", border: 'none' }} onClick={handleSave}>
                    {medicamento ? 'Guardar Cambios' : 'Añadir Medicamento'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MedicamentoModal;