import React from 'react';
import LeftSlidebarChecker from './leftSlidebarChecker';
import axiosInstance from "../configurations/instance";
import withNavigation from "../utils/withNavigation";

class CheckerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      userName: "",
      firstName: "",
      lastName: "",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({ isLoggedIn: false });
      return;
    }

    axiosInstance.get('/checker/profile')
    .then((response) => {
      const { firstName, lastName } = response.data;
      this.setState({ userName: `${firstName} ${lastName}`, firstName, lastName });
    })
    .catch((error) => {
      console.error('Ошибка при загрузке профиля пользователя:', error.response?.data?.message || error.message);
    });
  }

  render() {
    if (!this.state.isLoggedIn) {
      this.props.navigate("/");
    }

    return (
      <div className="creating-page">
        <header className="main-header"></header>
        <div className="profile-page">
          <LeftSlidebarChecker />
          <div className="content">
            <h1>Профиль-страница</h1>
            <div className="profile-content">
              <div className="profile-fields">
                <div className="field">
                  <label>Имя:</label>
                  <span>{this.state.firstName || "Не указано"}</span>
                </div>
                <div className="field">
                  <label>Фамилия:</label>
                  <span>{this.state.lastName || "Не указано"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigation(CheckerProfile);
