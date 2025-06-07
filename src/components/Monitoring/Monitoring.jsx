import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Компоненты
import buttonIcon from '../../images/icons/monitoring-button.svg';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import MonitoringModal from '../MonitoringModal/MonitoringModal';

// Стили
import './Monitoring.css';

export default function Monitoring() {
  const navigate = useNavigate();
  const [countFilters, setCountFilters] = useState(5);
  const [countVacancies, setCountVacancies] = useState(12);
  const [countCandidats, setCountCadidats] = useState(8);
  const [openMonitoringModal, setOpenMonitoringModal] = useState(false);

  const [forms, setForms] = useState([]);

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);
  }, []);

  const openModal = () => {
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);
    setOpenMonitoringModal(true);
  };

  const modalForms = forms.map(form => ({
    id: form.id,
    position: form.position,
    options: [
      { id: 'active', label: 'Активна', checked: true },
    ],
  }));

  return (
    <div className='monitoring'>
      <SectionHeader title="Аналитика" />

      <div className='monitoring__controls'>
        <button
          className='monitoring__toggle-button'
          onClick={openModal}
          aria-label='Перейти к отчётам и фильтрам'
        >
          <img
            className='monitoring__toggle-icon'
            src={buttonIcon}
            alt='Переключить'
          />
        </button>

        <div className='monitoring__info-group'>
          <span className='monitoring__info-item'>Фильтры: {countFilters}</span>
          <span className='monitoring__info-item'>Вакансии: {countVacancies}</span>
          <span className='monitoring__info-item'>Кандидаты: {countCandidats}</span>
        </div>
      </div>

      <div className='monitoring__content'>
        {/* ... */}
      </div>

      {openMonitoringModal && (
        <MonitoringModal
          forms={modalForms}
          onClose={() => setOpenMonitoringModal(false)}
        />
      )}
    </div>
  );
}
