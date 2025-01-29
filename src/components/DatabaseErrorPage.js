import React from 'react';

class DatabaseErrorPage extends React.Component {
    render() {
        return (
            <div className="error-page">
                <h1>Ошибка подключения к базе данных</h1>
                <p>Сервер недоступен. Попробуйте обновить страницу позже.</p>
            </div>
        );
    }
}

export default DatabaseErrorPage;
