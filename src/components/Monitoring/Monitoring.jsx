import { useState, useEffect } from 'react';

import buttonIcon from '../../images/icons/monitoring-button.svg';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import MonitoringModal from '../MonitoringModal/MonitoringModal';

import './Monitoring.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export default function Monitoring() {
  // const [countFilters, setCountFilters] = useState(5);
  const [countVacancies, setCountVacancies] = useState(12);
  // const [countCandidats, setCountCandidats] = useState(8);
  const [openMonitoringModal, setOpenMonitoringModal] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [chartImages, setChartImages] = useState([]);
  const [salaryStats, setSalaryStats] = useState(null);
  const [topKeywords, setTopKeywords] = useState(null);
  const [topDescriptionWords, setTopDescriptionWords] = useState(null);

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

    setChartImages([]);

    fetch(
      `${joinUrl(BACKEND_URL, 'get_statistics')}?text=${encodeURIComponent(selectedPosition)}&area=1&per_page=50&refresh=false&include_plots=true`,
      { headers: { accept: 'application/json' } }
    )
      .then(res => res.json())
      .then(data => {
        if (data?.plot_images) {
          const images = Object.entries(data.plot_images).map(([name, base64]) => ({
            name,
            src: `data:image/png;base64,${base64}`
          }));
          setChartImages(images);
        }

        setCountVacancies(data.vacancy_count || 0);
        setSalaryStats(data.salary_stats || null);
        setTopKeywords(data.top_keywords || null);
        setTopDescriptionWords(data.top_description_words || null);
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
    if (chartImages.length > 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [chartImages.length, loadingTexts.length]);

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
          <span className='monitoring__info-item'>Фильтры: 8</span>
          <span className='monitoring__info-item'>Вакансии: {countVacancies}</span>
          <span className='monitoring__info-item'>Кандидаты: 5</span>
        </div>
      </div>

      <div className='monitoring__content'>
        {chartImages.length > 0 ? (
          chartImages.map((img, idx) => (
            <img
              key={img.name || idx}
              src={img.src}
              alt={`График: ${img.name}`}
              className='monitoring__chart'
            />
          ))
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

      {salaryStats && chartImages.length > 0 ? (
        <div className='monitoring__section'>
          <h3 className='monitoring__subtitle'>Статистика зарплат</h3>
          <div className='monitoring__cards'>
            <div className='monitoring__card'>
              <span className='monitoring__card-label'>Минимум</span>
              <span className='monitoring__card-value'>{salaryStats.min} ₽</span>
            </div>
            <div className='monitoring__card'>
              <span className='monitoring__card-label'>Максимум</span>
              <span className='monitoring__card-value'>{salaryStats.max} ₽</span>
            </div>
            <div className='monitoring__card'>
              <span className='monitoring__card-label'>Средняя</span>
              <span className='monitoring__card-value'>{salaryStats.mean} ₽</span>
            </div>
            <div className='monitoring__card'>
              <span className='monitoring__card-label'>Медианная</span>
              <span className='monitoring__card-value'>{salaryStats.median} ₽</span>
            </div>
          </div>
        </div>
      ) : (
        <div className='monitoring__section skeleton-section'>
          <h3 className='monitoring__subtitle'>Статистика зарплат</h3>
          <div className='skeleton-cards'>
            {[...Array(4)].map((_, i) => (
              <div className='skeleton-card' key={i}>
                <div className='skeleton-block' style={{ width: '80px' }}></div>
                <div className='skeleton-block' style={{ width: '60px' }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topKeywords && chartImages.length > 0 ? (
        <div className='monitoring__section'>
          <h3 className='monitoring__subtitle'>Топ ключевые слова</h3>
          <div className='monitoring__tags'>
            {Object.entries(topKeywords).map(([word, count]) => (
              <div className='monitoring__tag' key={word}>
                {word} <span className='monitoring__tag-count'>×{count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='monitoring__section skeleton-section'>
          <h3 className='monitoring__subtitle'>Топ ключевые слова</h3>
          <div className='monitoring__tags'>
            {[...Array(8)].map((_, i) => (
              <div className='skeleton-block skeleton-tag' key={i}></div>
            ))}
          </div>
        </div>
      )}

      {topDescriptionWords && chartImages.length > 0 ? (
        <div className='monitoring__section'>
          <h3 className='monitoring__subtitle'>Частые слова в описаниях</h3>
          <div className='monitoring__tags'>
            {Object.entries(topDescriptionWords).map(([word, count]) => (
              <div className='monitoring__tag' key={word}>
                {word} <span className='monitoring__tag-count'>×{count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='monitoring__section skeleton-section'>
          <h3 className='monitoring__subtitle'>Частые слова в описаниях</h3>
          <div className='monitoring__tags'>
            {[...Array(8)].map((_, i) => (
              <div className='skeleton-block skeleton-tag' key={i}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
