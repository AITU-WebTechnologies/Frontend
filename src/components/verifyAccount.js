import React from 'react';
import withNavigation from '../utils/withNavigation';
import axiosInstance from '../configurations/instance';

class Verification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ''
        };
    }

    handleSubmit = () => {
        const { code } = this.state;
        const email = localStorage.getItem('email');
    
        axiosInstance.post('/checker/confirm-checker', { email, code })
            .then(response => {

                const token = response.data.accessToken; 
            if (token) {
                localStorage.setItem('token', token);

            
                this.props.navigate('/checker-events'); 
            } else {
                console.error('accessToken отсутствует в ответе сервера.');
                this.setState({ error: 'Ошибка получения токена. Попробуйте снова.' });
            }
                
            })
            .catch(error => {
                console.error('Verification failed', error);
            });
    };

    render() {
        return (
            <div className="verification-container">
                <h1>Введите 6-значный код</h1>
                <p>На вашу почту был отправлен код</p>
                <div className="form-group">
                    <h3 htmlFor="verificationCode">Код</h3>
                    <input
                        id="verificationCode"
                        type="text"
                        minLength="6"
                        maxLength="6"
                        onChange={(e) => this.setState({ code: e.target.value })}
                        placeholder="Введите код"
                    />
                </div>
                    
                <button type="button" onClick={this.handleSubmit}>Подтвердить</button>
            </div>
        );
    }
}

export default withNavigation(Verification);
