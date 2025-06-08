import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import buttonIcon from '../../images/icons/monitoring-button.svg';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import MonitoringModal from '../MonitoringModal/MonitoringModal';

import './Monitoring.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API || 'http://127.0.0.1:8000';

export default function Monitoring() {
  const navigate = useNavigate();
  const [countFilters, setCountFilters] = useState(5);
  const [countVacancies, setCountVacancies] = useState(12);
  const [countCandidats, setCountCandidats] = useState(8);
  const [openMonitoringModal, setOpenMonitoringModal] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [chartSrc, setChartSrc] = useState(null); // сюда вставим base64 картинку

  function joinUrl(base, path) {
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  useEffect(() => {
    // Загружаем формы из localStorage при монтировании
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);

    if (storedForms.length > 0) {
      // Устанавливаем позицию из первой формы при загрузке
      setSelectedPosition(storedForms[0].position);
    }
  }, []);

  useEffect(() => {
    if (!selectedPosition) return;

    fetch(
      `${joinUrl(BACKEND_URL, 'get_statistics')}?text=${encodeURIComponent(selectedPosition)}&area=1&per_page=50&refresh=false&include_plots=true`,
      { headers: { accept: 'application/json' } }
    )
      .then(res => res.json())
      .then(data => {
        if (data?.plot_images?.salary_distribution) {
          setChartSrc(`data:image/png;base64,${data.plot_images.salary_distribution}`);
          setCountVacancies(data.vacancy_count || 0);
        }
      })
      .catch(err => {
        console.error('Ошибка при получении статистики:', err);
      });
  }, [selectedPosition]);

  const openModal = () => {
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);
    setOpenMonitoringModal(true);
  };

  // Преобразуем формы для передачи в модалку, если нужно
  const modalForms = forms.map(form => ({
    ...form,
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
        {chartSrc ? (
          <img
            src={chartSrc}
            alt="График распределения зарплат"
            className="monitoring__chart"
          />
        ) : (
          <p>Загрузка графика...</p>
        )}
      </div>

      {openMonitoringModal && (
        <MonitoringModal
          forms={modalForms}
          onClose={() => setOpenMonitoringModal(false)}
          onSelectPosition={(position) => setSelectedPosition(position)} // передаем колбэк для обновления позиции
        />
      )}
    </div>
  );
}
