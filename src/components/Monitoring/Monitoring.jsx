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
  const [chartSrc, setChartSrc] = useState(null); // base64 картинки графика

  // Для анимации текста загрузки
  const loadingTexts = [
    "Хантим :)",
    "Скоро всё будет готово",
    "Ищем подходящие вакансии...",
    "Загружаем данные...",
    "Это займёт несколько секунд"
  ];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [fade, setFade] = useState(true);

  function joinUrl(base, path) {
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  // При смене выбранной позиции загружаем график
  useEffect(() => {
    if (!selectedPosition) return;

    setChartSrc(null);  // сбросить картинку, чтобы показать загрузку

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

  // Загрузка форм из localStorage при монтировании
  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);

    if (storedForms.length > 0) {
      setSelectedPosition(storedForms[0].position);
    }
  }, []);

  // Анимация смены текста загрузки
  useEffect(() => {
    if (chartSrc) return; // остановить анимацию, когда график загружен

    const interval = setInterval(() => {
      setFade(false); // начинаем исчезать текст
      setTimeout(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
        setFade(true);  // показываем следующий текст
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [chartSrc, loadingTexts.length]);

  const openModal = () => {
    const storedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
    setForms(storedForms);
    setOpenMonitoringModal(true);
  };

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
          <div className='loading__container'>
            <div className="monitoring__spinner" aria-label="Загрузка графика"></div>
            <span className={`loading-text ${fade ? 'fade-in' : 'fade-out'}`}>
              {loadingTexts[loadingTextIndex]}
            </span>
          </div>
        )}
      </div>

      {openMonitoringModal && (
        <MonitoringModal
          forms={modalForms}
          onClose={() => setOpenMonitoringModal(false)}
          onSelectPosition={(position) => setSelectedPosition(position)}
        />
      )}
    </div>
  );
}
