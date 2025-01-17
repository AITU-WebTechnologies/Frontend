import React from "react";
import withNavigation from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class AuthUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
    };
  }

  handleLogin = () => {
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Пожалуйста, заполните все поля." });
      return;
    }

    axiosInstance
      .post("/auth/check-user", { email, password })
      .then((response) => {
        console.log("Авторизация успешна:", response.data);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", email);

        const role = response.data.role;
        if (role === "Organisation") {
          this.props.navigate("/profile-org");
        } else if (role === "Checker") {
          this.props.navigate("/profile-checker");
        } else {
          console.error("Неизвестная роль:", role);
        }
      })
      .catch((error) => {
        console.error("Ошибка авторизации:", error);
        this.setState({ error: "Неверный логин или пароль." });
      });
  };

  handleRegisterClick = () => {
    this.props.navigate("/role-selection");
  };

  handlePasswordClick = () => {
    this.props.navigate("/forget-password");
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <div className="auth-container">
        <h2>Авторизация</h2>
        <br></br>
        <h3>Введите ваши логин и пароль</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => this.setState({ email: e.target.value, error: "" })}
            placeholder="Введите почту"
          />
        </div>
        <div className="form-group1">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => this.setState({ password: e.target.value, error: "" })}
            placeholder="Введите пароль"
          />
        </div>
        <button className="reg-button" onClick={this.handleLogin}>
          Войти
        </button>
        <div className="links">
          <a href="#" onClick={this.handlePasswordClick}>
            Забыли пароль?
          </a>
          <span> | </span>
          <a href="#" onClick={this.handleRegisterClick}>
            Регистрация
          </a>
        </div>
      </div>
    );
  }
}

export default withNavigation(AuthUser);
