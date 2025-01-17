import React from "react";
import withNavigation  from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class VerificationPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      error: "",
    };
  }

  handleSubmit = () => {
    const { code } = this.state;
    const email = localStorage.getItem("email");
    axiosInstance.post("/auth/verify-code", { email, code })
        .then(() => {
            this.props.navigate("/create-new-password");
        })
        .catch((error) => {
            this.setState({ error: "Неверный код. Попробуйте снова." });
        });
};

  handleChange = (e) => {
    this.setState({ code: e.target.value });
  };

  render() {
    const { code, error } = this.state;

    return (
      <div className="verification-container">
        <h1>Введите 6-значный код</h1>
        <p>На вашу почту был отправлен код</p>
        <div className="form-group">
        <h3 htmlFor="verificationCode">Код</h3>
        <input
          type="text"
          maxLength="6"
          value={code}
          onChange={this.handleChange}
          placeholder="Введите код"
        />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={this.handleSubmit}>Подтвердить</button>
      </div>
    );
  }
}

export default withNavigation(VerificationPassword);
