import SectionHeader from '../SectionHeader/SectionHeader';
import './Reports.css';

export default function Reports() {
    return (
        <div className="reports">
            <SectionHeader title="Создание отчёта и фильтра" />

            <form className="reports__form">
                <div className="reports__row reports__row--inline">
                    <button type="button" className="reports__button reports__button--upload">Загрузить отчет</button>

                    <div className="reports__field">
                        <input
                            type="text"
                            id="position"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
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
                        />
                        <label htmlFor="territory" className="reports__label">Территория</label>
                    </div>

                    <div className="reports__field">
                        <input
                            id="skills"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label htmlFor="skills" className="reports__label">Ключевые навыки</label>
                    </div>

                    <div className="reports__field">
                        <input
                            id="age"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label htmlFor="age" className="reports__label">Возраст</label>
                    </div>

                    <div className="reports__field">
                        <input
                            id="experience"
                            className="reports__input"
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label htmlFor="experience" className="reports__label">Опыт работы</label>
                    </div>
                </div>

                <button type="submit" className="reports__button reports__button--submit">Загрузить</button>
            </form>
        </div>
    );
}
