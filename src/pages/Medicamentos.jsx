import React, { useState, useEffect } from 'react';
import apiFetch from '../api';
import Sidebar from './Sidebar';
import { FaPlus, FaPills } from 'react-icons/fa';
import { toast } from 'react-toastify';
import MedicamentoModal from './componentes/MedicamentoModal';
import './Medicamentos.css';

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMed, setSelectedMed] = useState(null);

    const fetchData = async () => {
        try {
            const [medData, petData] = await Promise.all([
                apiFetch('/api/medicamentos'),
                apiFetch('/api/mascotas')
            ]);
            setMedicamentos(medData);
            setMascotas(petData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            toast.error("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowModal = (medicamento = null) => {
        setSelectedMed(medicamento);
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    const handleSave = async (formData) => {
        try {
            if (formData.id) {
                await apiFetch(`/api/medicamentos/${formData.id}`, { method: 'PUT', body: JSON.stringify(formData) });
                toast.success('Medicamento actualizado.');
            } else {
                await apiFetch('/api/medicamentos', { method: 'POST', body: JSON.stringify(formData) });
                toast.success('Medicamento añadido.');
            }
            fetchData();
            handleHideModal();
        } catch (error) {
            toast.error('No se pudo guardar el medicamento.');
        }
    };

    const handleDelete = async (medId) => {
        try {
            await apiFetch(`/api/medicamentos/${medId}`, { method: 'DELETE' });
            toast.success('Medicamento eliminado.');
            fetchData();
            handleHideModal();
        } catch (error) {
            toast.error('No se pudo eliminar el medicamento.');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="medicamentos-page">
            <Sidebar />
            <main className="content-area">
                <header className="page-header">
                    <div>
                        <h2 className="page-title">Botiquín de Medicamentos</h2>
                        <p className="page-subtitle">Gestiona los tratamientos de tus mascotas.</p>
                    </div>
                    <button className="btn btn-with-icon" onClick={() => handleShowModal()} style={{ backgroundColor: '#F97316', color: 'white' }}>
                        <FaPlus className="me-2" />
                        Añadir Medicamento
                    </button>
                </header>

                <div className="mascota-summary-grid">
                    {mascotas.map((mascota) => {
                        const medsParaMascota = medicamentos.filter((m) => m.mascota_id === mascota.id);
                        return (
                            <div key={mascota.id} className="mascota-summary-card">
                                <img src={`${import.meta.env.VITE_API_URL}${mascota.imagen}`} alt={mascota.nombre} />
                                <h5>{mascota.nombre}</h5>
                                <p>{medsParaMascota.length} medicamentos activos</p>
                            </div>
                        );
                    })}
                </div>

                <div className="medicamentos-list">
                    <h4 className="list-title">Todos los Medicamentos</h4>
                    {medicamentos.length > 0 ? (
                        medicamentos.map((med) => (
                            <div key={med.id} className="medicamento-item">
                                <div className="med-icon"><FaPills /></div>
                                <div className="med-info">
                                    <strong>{med.nombre_medicamento}</strong>
                                    <span>Para: {med.mascota_nombre}</span>
                                </div>
                                <div className="med-details">
                                    <span>Dosis: {med.dosis}</span>
                                    <span>Frecuencia: {med.frecuencia}</span>
                                </div>
                                <div className="med-dates">
                                    <span>Inicio: {new Date(med.fecha_inicio).toLocaleDateString()}</span>
                                    <span>Fin: {med.fecha_fin ? new Date(med.fecha_fin).toLocaleDateString() : "Indefinido"}</span>
                                </div>
                                <button className="btn btn-light btn-sm" onClick={() => handleShowModal(med)}>
                                    Editar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay medicamentos registrados.</p>
                    )}
                </div>
            </main>
            <MedicamentoModal
                show={showModal}
                onHide={handleHideModal}
                onSave={handleSave}
                onDelete={handleDelete}
                mascotas={mascotas}
                medicamento={selectedMed}
            />
        </div>
    );
};

export default Medicamentos;