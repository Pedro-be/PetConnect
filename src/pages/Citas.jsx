import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

import apiFetch from '../api';
import Sidebar from './Sidebar';
import CitaModal from './componentes/CitaModal';
import './componentes/Citas.css';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Componente personalizado para estilizar cada evento en el calendario
const EventoPersonalizado = ({ event }) => (
    <div className={`cita-evento tipo-${event.resource.tipo_cita.toLowerCase()}`}>
        <strong>{event.title}</strong>
    </div>
);

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    const fetchData = async () => {
        try {
            const [citasData, mascotasData] = await Promise.all([
                apiFetch('/api/citas'),
                apiFetch('/api/mascotas')
            ]);
            
            const eventos = citasData.map(cita => ({
                id: cita.id,
                title: `${cita.titulo} (${cita.mascota_nombre || 'Mascota'})`,
                start: new Date(cita.fecha_hora),
                end: new Date(new Date(cita.fecha_hora).getTime() + 60 * 60 * 1000),
                resource: cita,
            }));
            setCitas(eventos);
            setMascotas(mascotasData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            toast.error('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleShowNewModal = () => {
        setSelectedCita(null);
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedCita(event);
        setShowModal(true);
    };

    const handleHideModal = () => setShowModal(false);

    const handleSave = async (formData) => {
        try {
            if (formData.id) {
                await apiFetch(`/api/citas/${formData.id}`, { method: 'PUT', body: JSON.stringify(formData) });
                toast.success('Cita actualizada exitosamente.');
            } else {
                await apiFetch('/api/citas', { method: 'POST', body: JSON.stringify(formData) });
                toast.success('Cita agendada exitosamente.');
            }
            fetchData();
            handleHideModal();
        } catch (error) {
            // ✅ CORREGIDO: Usar toast.error para los mensajes de error
            toast.error('No se pudo guardar la cita.');
        }
    };

    const handleDelete = async (citaId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
            try {
                await apiFetch(`/api/citas/${citaId}`, { method: 'DELETE' });
                toast.success('Cita eliminada correctamente.');
                fetchData();
                handleHideModal();
            } catch (error) {
                
                toast.error('No se pudo eliminar la cita.');
            }
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
      <div className="citas-page">
        <Sidebar />
        <main className="content-area">
          <header className="page-header">
            <div>
              <h2 className="page-title">Agenda de Citas</h2>
              <p className="page-subtitle">
                Organiza las citas de tus mascotas.
              </p>
            </div>

            <button
              className="btn btn-with-icon"
              onClick={handleShowNewModal}
              style={{ color: "white" }}
            >
              <FaPlus className="me-2" />
              Agendar Cita
            </button>
          </header>

          <div className="calendar-container shadow-sm">
            <Calendar
              localizer={localizer}
              events={citas}
              onSelectEvent={handleSelectEvent}
              style={{ height: "75vh" }}
              culture="es"
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Cita",
                noEventsInRange: "No hay citas en este rango.",
                showMore: (total) => `+ Ver más (${total})`,
              }}
              components={{
                event: EventoPersonalizado, //
              }}
            />
          </div>
        </main>

        <CitaModal
          show={showModal}
          onHide={handleHideModal}
          onSave={handleSave}
          onDelete={handleDelete}
          cita={selectedCita}
          mascotas={mascotas}
        />
      </div>
    );
};

export default Citas;