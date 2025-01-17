import React from "react";
import withNavigation from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class CreateNewPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      error: "",
    };
  }

  validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleSubmit = () => {
    const { password, confirmPassword } = this.state;
    const email = localStorage.getItem("email");

    if (!email) {
      this.setState({ error: "Email не найден. Попробуйте снова." });
      return;
    }

    if (!password || !confirmPassword) {
      this.setState({ error: "Все поля должны быть заполнены." });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: "Пароли не совпадают." });
      return;
    }

    if (!this.validatePassword(password)) {
      this.setState({
        error:
          "Пароль должен содержать минимум 8 символов, одну заглавную букву и одну цифру.",
      });
      return;
    }

    axiosInstance
      .post("/auth/reset-password", { email, password })
      .then((response) => {
        console.log("Response from server:", response.data);

        const { role, token } = response.data;
        if (!role || !token) {
          throw new Error("Не удалось получить данные с сервера.");
        }

        localStorage.setItem("token", token);

        if (role === "Checker") {
          this.props.navigate("/profile-checker");
        } else if (role === "Organisation") {
          this.props.navigate("/profile-org");
        }
      })
      .catch((error) => {
        console.error("Ошибка при обновлении пароля:", error);
        this.setState({
          error: "Не удалось обновить пароль. Попробуйте снова.",
        });
      });
  };

  render() {
    const { password, confirmPassword, error } = this.state;

    return (
      <div className="reset-password-container">
        <h1>Создайте новый пароль</h1>
        <h3>Введите ваш новый пароль</h3>
        {error && <p className="error-message">{error}</p>}
        <form>
          <label htmlFor="password">Новый пароль</label>
          <input
            id="password"
            type="password"
            placeholder="Введите новый пароль"
            value={password}
            onChange={(e) => this.handleChange("password", e.target.value)}
          />
          <label htmlFor="confirmPassword">Повторите новый пароль</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Подтвердите новый пароль"
            value={confirmPassword}
            onChange={(e) => this.handleChange("confirmPassword", e.target.value)}
          />
        </form>
        <button onClick={this.handleSubmit}>Сохранить</button>
      </div>
    );
  }
}

export default withNavigation(CreateNewPassword);
