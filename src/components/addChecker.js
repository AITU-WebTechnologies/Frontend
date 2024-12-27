import React from "react";
import axiosInstance from "../configurations/instance";

class AddChecker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            surname: "",
            email: "",
            role: "Checker",
            password: ""
        }
    }
    handleSubmit = () => { 
      const { name, surname, email, role, password } = this.state; 
      axiosInstance.post('/checker/create-checker', 
        { name, surname, email, role, password }) 
        .then(response => { 
          console.log(response.data); 

          localStorage.setItem('token', response.data.token);

        }) 
        .catch(error => { console.error(error); 

        }); 
      }

  render() {
    return (
      <div>
        <h1 >Добро Пожаловать!</h1>
        <h3 >Чтобы начать регистрацию выберите вашу роль</h3>
        <form>
         <div className="name-surname">
          <div>
           <label htmlFor="name">Введите ваше имя</label>
           <input id="name" onChange={(e) => this.setState({ name: e.target.value })} placeholder="Имя" />
          </div>
          <div>
           <label htmlFor="surname">Введите вашу фамилию</label>
           <input id="surname" onChange={(e) => this.setState({ surname: e.target.value })} placeholder="Фамилия" />
          </div>
        </div>

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

export default AddChecker;