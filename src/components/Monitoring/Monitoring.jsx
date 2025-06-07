import './Monitoring.css';
import buttonIcon from '../../images/icons/monitoring-button.svg';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import { useNavigate } from 'react-router-dom';

export default function Monitoring() {

    const navigate = useNavigate();

    return (
        <div className='monitoring'>
            <SectionHeader title="Мониторинг" />

            <div className='monitoring__controls'>
                <button className='monitoring__toggle-button' onClick={() => navigate('/reports')} aria-label='Перейти к отчётам и фильтрам'>
                    <img className='monitoring__toggle-icon' src={buttonIcon} alt='Переключить' />
                </button>

                <div className='monitoring__info-group'>
                    <span className='monitoring__info-item'>Фильтры: 5</span>
                    <span className='monitoring__info-item'>Вакансии: 12</span>
                    <span className='monitoring__info-item'>Кандидаты: 8</span>
                </div>
            </div>

            <div className='monitoring__content'>
                
            </div>
        </div>
    );
}
