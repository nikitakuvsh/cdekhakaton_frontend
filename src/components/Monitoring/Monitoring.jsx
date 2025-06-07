import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Компоненты
import buttonIcon from '../../images/icons/monitoring-button.svg';
import SectionHeader from '../../components/SectionHeader/SectionHeader';

// Стили
import './Monitoring.css';

export default function Monitoring() {

    const navigate = useNavigate();
    const [countFilters, setCountFilters] = useState(5);
    const [countVacancies, setCountVacancies] = useState(12);
    const [countCandidats, setCountCadidats] = useState(8);

    return (
        <div className='monitoring'>
            <SectionHeader title="Аналитика" />

            <div className='monitoring__controls'>
                <button className='monitoring__toggle-button' onClick={() => navigate('/reports')} aria-label='Перейти к отчётам и фильтрам'>
                    <img className='monitoring__toggle-icon' src={buttonIcon} alt='Переключить' />
                </button>

                <div className='monitoring__info-group'>
                    <span className='monitoring__info-item'>Фильтры: {countFilters}</span>
                    <span className='monitoring__info-item'>Вакансии: {countVacancies}</span>
                    <span className='monitoring__info-item'>Кандидаты: {countCandidats}</span>
                </div>
            </div>

            <div className='monitoring__content'>
                
            </div>
        </div>
    );
}
