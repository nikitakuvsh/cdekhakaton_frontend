import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './MonitoringModal.css';

export default function MonitoringModal({ onClose }) {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(savedForms);
    if (savedForms.length > 0) {
      setSelectedFormId(savedForms[0].id);
    }
  }, []);

  const handleSelectForm = (id) => {
    setSelectedFormId(id);
  };

  const handleEdit = (id) => {
    onClose();
    navigate(`/reports/${id}`);
  };

  if (forms.length === 0) {
    return (
      <div className="monitoring-modal">
        <div className="monitoring-modal__overlay" onClick={onClose}></div>
        <div className="monitoring-modal__content" onClick={e => e.stopPropagation()}>
          <header className="monitoring-modal__header">
            <h2 className="monitoring-modal__title">Нет сохранённых форм</h2>
            <button
              className="monitoring-modal__close-btn"
              onClick={onClose}
              aria-label="Закрыть модальное окно"
            >
              ×
            </button>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-modal">
      <div className="monitoring-modal__overlay" onClick={onClose}></div>

      <div
        className="monitoring-modal__content"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <header className="monitoring-modal__header">
          <h2 className="monitoring-modal__title">Сохранённые формы мониторинга</h2>
          <button
            className="monitoring-modal__close-btn"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
        </header>

        <div className="monitoring-modal__form-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {forms.map(form => {
            const isActive = String(form.id) === String(selectedFormId);

            return (
              <div
                key={form.id}
                className={`monitoring-modal__form-block${isActive ? ' monitoring-modal__form-block--active' : ''}`}
                onClick={() => handleSelectForm(form.id)}
                style={{
                  cursor: 'pointer',
                  border: isActive ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  padding: '10px 15px',
                  backgroundColor: isActive ? '#e9f5ff' : '#fff',
                  userSelect: 'none',
                  position: 'relative',
                }}
              >
                <div className="monitoring-modal__select-button">
                  {form.position}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleEdit(form.id); }}
                    style={{
                      marginLeft: '15px',
                      fontSize: '0.85rem',
                      padding: '2px 8px',
                      cursor: 'pointer',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                    aria-label={`Редактировать форму ${form.position}`}
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="monitoring-modal__form-details" style={{ marginTop: '20px' }}>
          {selectedFormId && (() => {
            const form = forms.find(f => f.id === selectedFormId);
            if (!form) return null;

            return (
              <div>
                <p><strong>Название должности:</strong> {form.position}</p>
                <p><strong>Описание:</strong> {form.description || '-'}</p>
                <p><strong>Территория:</strong> {form.territory || '-'}</p>
                <p><strong>Ключевые навыки:</strong> {form.skills || '-'}</p>
                <p><strong>Возраст:</strong> {form.age || '-'}</p>
                <p><strong>Опыт:</strong> {form.experience?.length ? form.experience.join(', ') : '-'}</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
