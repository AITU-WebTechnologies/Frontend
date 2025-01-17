import React from "react";
import withNavigation from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class ForgetPassword extends React.Component {
  state = {
    email: "",
    error: "",
  };

  handleInputChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handleResetPassword = () => {
    const { email } = this.state;

    if (!email) {
        this.setState({ error: "Пожалуйста, введите почту!" });
        return;
    }

    axiosInstance
        .post("/auth/forgot-password", { email })
        .then(() => {
            localStorage.setItem("email", email); 
            this.props.navigate("/verify-code"); 
        })
        .catch((error) => {
            this.setState({
                error: "Не удалось отправить код. Проверьте почту."
            });
        });
  };

  render() {
    const { email, message, error } = this.state;

    return (
      <div className="forgot-password-page">
        <h1>Забыли пароль?</h1>
        <h3>Что бы восстановить пароль <br></br> введите вашу почту </h3>
        {error && <p className="error-message">{error}</p>}
        <h2>Почта</h2>
        <input
          type="email"
          placeholder="Введите вашу почту"
          value={email}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleResetPassword}>Отправить</button>
      </div>
    );
  }
}

export default withNavigation(ForgetPassword);
