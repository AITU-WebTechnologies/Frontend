import React from 'react';
import axiosInstance from "../configurations/instance";

class AuthUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleLogin = () => {
    const { email, password } = this.state;
    axiosInstance.post('/auth/check-user', {
      email,
      password
    })
    .then(response => {
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className="auth-container">
        <h2>Логин</h2>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="text"
            onChange={(e) => this.setState({ email: e.target.value })} 
            placeholder="Введите почту"
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input 
            type="password" 
            onChange={(e) => this.setState({ password: e.target.value })} 
            placeholder="Введите пароль"
          />
        </div>
        <button onClick={this.handleLogin}>Войти</button>
        <div className="links">
          <a href="/forgot-password">Забыли пароль?</a>
          <span> | </span>
          <a href="#" onClick={this.props.onRegister}>Регистрация</a> 
        </div>
      </div>
    );
  }
}

export default AuthUser;
