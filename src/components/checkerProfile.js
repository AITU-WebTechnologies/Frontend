import React from 'react';
import LeftSlidebarChecker from './leftSlidebarChecker';
import axiosInstance from "../configurations/instance";
import withNavigation from "../utils/withNavigation";

class CheckerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      firstName: "",
      lastName: "",
      isEditing: false,
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
        this.setState({ firstName, lastName });
      })
      .catch((error) => {
        console.error('Ошибка при загрузке профиля пользователя:', error.response?.data?.message || error.message);
      });
  }

  handleEditToggle = () => {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  };

  handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleSave = () => {
    const { firstName, lastName } = this.state;

    axiosInstance.put('/checker/update-profile', { firstName, lastName })
      .then(() => {
        this.setState({ isEditing: false });
      })
      .catch((error) => {
        console.error("Ошибка при сохранении изменений:", error);
      });
  };

  handleDelete = () => {
    axiosInstance.delete('/checker/delete-account')
      .then(() => {
        localStorage.clear();
        this.props.navigate("/");
      })
      .catch((error) => {
        console.error("Ошибка при удалении аккаунта:", error);
      });
  };

  render() {
    const { isLoggedIn, firstName, lastName, isEditing } = this.state;

    if (!isLoggedIn) {
      this.props.navigate("/");
      return null;
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => this.handleInputChange("firstName", e.target.value)}
                    />
                  ) : (
                    <span>{firstName || "Не указано"}</span>
                  )}
                </div>
                <div className="field">
                  <label>Фамилия:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => this.handleInputChange("lastName", e.target.value)}
                    />
                  ) : (
                    <span>{lastName || "Не указано"}</span>
                  )}
                </div>
              </div>
              <button className="edit-button" onClick={this.handleEditToggle}>
                {isEditing ? "Отменить" : "Редактировать"}
              </button>
              {isEditing && (
                <div className="edit-actions">
                  <button className="save-button" onClick={this.handleSave}>Сохранить</button>
                  <button className="delete-button" onClick={this.handleDelete}>Удалить аккаунт</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigation(CheckerProfile);
