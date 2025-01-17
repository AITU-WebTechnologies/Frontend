import React from "react";
import withNavigation from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class AddOrganisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      email: "",
      role: "Organisation",
      password: "",
      confirmPassword: "",
      error: "",
    };
  }

  validateFields = () => {
    const { title, email, password, confirmPassword } = this.state;

    if (!title || !email || !password || !confirmPassword) {
      this.setState({ error: "Все поля должны быть заполнены." });
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      this.setState({
        error:
          "Пароль должен содержать минимум 8 символов, одну цифру и одну заглавную букву.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      this.setState({ error: "Пароли не совпадают. Попробуйте снова." });
      return false;
    }

    this.setState({ error: "" });
    return true;
  };

  handleSubmit = () => {
    if (!this.validateFields()) {
      return;
    }

    const { title, email, role, password } = this.state;

    axiosInstance
      .post("/organisation/create-org", { title, email, role, password })
      .then((response) => {
        console.log("Организация создана:", response.data);

        localStorage.setItem("email", email);
        localStorage.setItem("token", response.data.token);

        this.props.navigate("/verify-organisation");
      })
      .catch((error) => {
        console.error("Ошибка при создании организации:", error);
        this.setState({
          error: "Ошибка при создании организации. Попробуйте снова.",
        });
      });
  };

  render() {
    const { error } = this.state;

    return (
      <div className="organisation-container">
        <h1>Добро Пожаловать!</h1>
        <h3>Заполните данные для регистрации</h3>
        {error && <p className="error-message">{error}</p>}
        <form>
          <label htmlFor="organisation">Введите название вашей организации</label>
          <input
            id="organisation"
            onChange={(e) => this.setState({ title: e.target.value })}
            placeholder="Организация"
          />

          <label htmlFor="email">Введите вашу почту</label>
          <input
            id="email"
            onChange={(e) => this.setState({ email: e.target.value })}
            placeholder="Почта"
          />

          <label htmlFor="password">Введите пароль</label>
          <input
            id="password"
            type="password"
            onChange={(e) => this.setState({ password: e.target.value })}
            placeholder="Пароль"
          />

          <label htmlFor="confirmPassword">Повторите пароль</label>
          <input
            id="confirmPassword"
            type="password"
            onChange={(e) => this.setState({ confirmPassword: e.target.value })}
            placeholder="Повторный пароль"
          />

          <button type="button" onClick={this.handleSubmit}>
            Создать
          </button>
        </form>
      </div>
    );
  }
}

export default withNavigation(AddOrganisation);
