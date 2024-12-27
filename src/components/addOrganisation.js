import React from "react";
import axiosInstance from "../configurations/instance";

class AddOrganisation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            email: "",
            role: "Organisation",
            password: ""
        };
    }
 
    handleSubmit = () => {
        const { title, email, role, password } = this.state;
        axiosInstance.post('/organisation/create-org', {
            title,
            email,
            role,
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
            <div className="organisation-container">
                <h1>Добро Пожаловать!</h1>
                <h3>Чтобы начать регистрацию выберите вашу роль</h3>
                <form>
                    <label htmlFor="organisation">Введите название вашей организации</label>
                    <input id="organisation" onChange={(e) => this.setState({ title: e.target.value })} placeholder="Организация" />

                    <label htmlFor="email">Введите вашу почту</label>
                    <input id="email" onChange={(e) => this.setState({ email: e.target.value })} placeholder="Почта" />

                    <label htmlFor="password">Введите пароль</label>
                    <input id="password" type="password" placeholder="Пароль" />

                    <label htmlFor="confirmPassword">Повторите пароль</label>
                    <input id="confirmPassword" onChange={(e) => this.setState({ password: e.target.value })} type="password" placeholder="Повторный пароль" />

                    <button type="button" onClick={this.handleSubmit}>Создать</button>
                </form>
            </div>
        );
    }
}

export default AddOrganisation;
