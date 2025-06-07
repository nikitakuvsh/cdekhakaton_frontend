import './Header.css';
import logoTeam from '../../images/pictures/logo-team.svg';
import logoCompany from '../../images/pictures/logo-company.svg';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hasMonitoringForms, setHasMonitoringForms] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        // Пробуем прочитать формы из localStorage
        try {
            const storedForms = localStorage.getItem('monitoringForms');
            if (storedForms) {
                const forms = JSON.parse(storedForms);
                setHasMonitoringForms(forms.length > 0);
            } else {
                setHasMonitoringForms(false);
            }
        } catch {
            setHasMonitoringForms(false);
        }
    }, []);

    return (
        <header className='header'>
            <div className='header__content'>
                <div className='header__logo'>
                    <img className='header__logo-picture logo--team' src={logoTeam} alt='Логотип команды' title='Лидеры' />
                    <img className='header__logo-picture logo--company' src={logoCompany} alt='Логотип компании' title='СДЕК' />
                </div>

                <button className={`burger ${menuOpen ? 'burger--open' : ''}`} onClick={toggleMenu} aria-label="Меню">
                    <span />
                    <span />
                    <span />
                </button>

                <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
                    <ul className='header__nav-list' onClick={closeMenu}>
                        <li>
                            <NavLink
                                to="/reports"
                                className={({ isActive }) =>
                                    isActive ? 'header__nav-link header__nav-link--active' : 'header__nav-link'
                                }
                            >
                                Форма мониторинга
                            </NavLink>
                        </li>

                        {hasMonitoringForms && (
                            <li>
                                <NavLink
                                    to="/monitoring"
                                    className={({ isActive }) =>
                                        isActive ? 'header__nav-link header__nav-link--active' : 'header__nav-link'
                                    }
                                >
                                    Аналитика
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
