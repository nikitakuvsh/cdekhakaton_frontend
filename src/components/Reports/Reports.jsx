import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectionHeader from '../SectionHeader/SectionHeader';
import InformationModal from '../InformationModal/InformationModal';
import './Reports.css';

export default function Reports() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const [territory, setTerritory] = useState('');
    const [skills, setSkills] = useState('');
    const [age, setAge] = useState('');
    const [experience, setExperience] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // const [storedForms, setStoredForms] = useState([]);

    useEffect(() => {
        const savedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
        // setStoredForms(savedForms);

        if (id) {
            const formToEdit = savedForms.find(f => f.id === id);
            if (formToEdit) {
                setPosition(formToEdit.position || '');
                setDescription(formToEdit.description || '');
                setTerritory(formToEdit.territory || '');
                setSkills(formToEdit.skills || '');
                setAge(formToEdit.age || '');
                setExperience(formToEdit.experience || []);
            } else {
                navigate('/reports');
            }
        }
    }, [id, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!position) {
            setModalMessage('Название должности обязательно');
            setShowModal(true);
            return;
        }

        const newForm = {
            id: id || Date.now().toString(),
            position,
            description,
            territory,
            skills,
            age,
            experience,
        };

        const savedForms = JSON.parse(localStorage.getItem('monitoringForms') || '[]');
        const isFirstEntry = savedForms.length === 0;

        let updatedForms;
        if (id) {
            updatedForms = savedForms.map(f => f.id === id ? newForm : f);
        } else {
            updatedForms = [...savedForms, newForm];
        }

        localStorage.setItem('monitoringForms', JSON.stringify(updatedForms));
        // setStoredForms(updatedForms);

        setModalMessage(id ? 'Форма успешно отредактирована!' : 'Форма успешно добавлена!');
        setShowModal(true);

        if (!id && isFirstEntry) {
            setModalMessage('Успех! Страница сейчас перезагрузится :)');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else if (id) {
            setTimeout(() => {
                setShowModal(false);
                navigate('/monitoring');
            }, 1500);
        } else {
            setPosition('');
            setDescription('');
            setTerritory('');
            setSkills('');
            setAge('');
            setExperience([]);
        }
    };


    return (
        <div className="reports">
            <SectionHeader title={id ? "Редактировать форму мониторинга" : "Форма мониторинга"} />

            <form className="reports__form" onSubmit={handleSubmit}>
                <div className="reports__row reports__row--inline">
                    <button type="button" className="reports__button reports__button--upload">Загрузить отчет</button>

                    <div className="reports__field">
                        <input
                            type="text"
                            id="position"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                        />
                        <label htmlFor="position" className="reports__label">Название должности</label>
                    </div>
                </div>

                <div className="reports__field">
                    <textarea
                        id="description"
                        className="reports__textarea"
                        placeholder=" "
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="description" className="reports__label">Описание</label>
                </div>

                <div className="reports__row reports__row--grid">
                    <div className="reports__field">
                        <input
                            id="territory"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                            value={territory}
                            onChange={(e) => setTerritory(e.target.value)}
                        />
                        <label htmlFor="territory" className="reports__label">Территория</label>
                    </div>

                    <div className="reports__field">
                        <input
                            id="skills"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                        <label htmlFor="skills" className="reports__label">Ключевые навыки</label>
                    </div>

                    <div className="reports__field">
                        <input
                            id="age"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <label htmlFor="age" className="reports__label">Возраст</label>
                    </div>

                    <div className="reports__field reports__checkbox-group">
                        {["Нет опыта", "От 1 года до 3", "От 3 до 6 лет", "Более 6 лет"].map(option => (
                            <label key={option} className="reports__checkbox">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={experience.includes(option)}
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        setExperience(prev =>
                                            checked ? [...prev, value] : prev.filter(item => item !== value)
                                        );
                                    }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="reports__button reports__button--submit">
                    {id ? "Сохранить изменения" : "Загрузить"}
                </button>
            </form>

            {showModal && (
                <InformationModal
                    message={modalMessage}
                    isError={false}
                    onClose={() => setShowModal(false)}
                    messageError=""
                />
            )}
        </div>
    );
}
