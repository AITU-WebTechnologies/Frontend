import React from "react";
import withNavigation from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class AddChecker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      email: "",
      role: "Checker",
      password: "",
      confirmPassword: "",
      error: "",
    };
  }

  validateFields = () => {
    const { name, surname, email, password, confirmPassword } = this.state;

    if (!name || !surname || !email || !password || !confirmPassword) {
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

    const { name, surname, email, role, password } = this.state;

    axiosInstance
      .post("/checker/create-checker", { name, surname, email, role, password })
      .then((response) => {
        console.log("Проверяющий создан:", response.data);

        localStorage.setItem("email", email);
        localStorage.setItem("token", response.data.token);

        this.props.navigate("/verify-checker");
      })
      .catch((error) => {
        console.error("Ошибка при создании проверяющего:", error);
        this.setState({ error: "Ошибка при создании проверяющего. Попробуйте снова." });
      });
  };

  render() {
    const { error } = this.state;

    return (
      <div>
        <h1>Добро Пожаловать!</h1>
        <h3>Заполните данные для регистрации</h3>
        {error && <p className="error-message">{error}</p>}
        <form>
          <div className="name-surname">
            <div>
              <label htmlFor="name">Введите ваше имя</label>
              <input
                id="name"
                onChange={(e) => this.setState({ name: e.target.value })}
                placeholder="Имя"
              />
            </div>
            <div>
              <label htmlFor="surname">Введите вашу фамилию</label>
              <input
                id="surname"
                onChange={(e) => this.setState({ surname: e.target.value })}
                placeholder="Фамилия"
              />
            </div>
          </div>

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

export default withNavigation(AddChecker);
