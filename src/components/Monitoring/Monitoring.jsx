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
  const [countCandidats, setCountCadidats] = useState(8);
  const [openMonitoringModal, setOpenMonitoringModal] = useState(false);
  const [forms, setForms] = useState([]);
  const [chartSrc, setChartSrc] = useState(null); // сюда вставим base64 картинку

  function joinUrl(base, path) {
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);
  }, []);

  useEffect(() => {
    if (forms.length > 0) {
      const position = forms[0].position || 'Веб-разработчик';

      fetch(
        `${joinUrl(BACKEND_URL, 'get_statistics')}?text=${encodeURIComponent(position)}&area=1&per_page=50&refresh=false&include_plots=true`,
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
    }
  }, [forms]);

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
        />
      )}
    </div>
  );
}
