import React from 'react';
import LeftSlidebar from "./leftSlidebar";
import axiosInstance from "../configurations/instance";
import withNavigation from "../utils/withNavigation";

class OrganisationProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      isEditing: false,
    };
  }

  componentDidMount() {

    this.fetchProfile();
  }

  fetchProfile = () => {
    axiosInstance.get('/organisation/profile')
      .then((response) => {
        const { title } = response.data;
        this.setState({ title });
      })
      .catch((error) => {
        console.error('Ошибка при загрузке профиля компании:', error.response?.data?.message || error.message);
      });
  };

  handleEditToggle = () => {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  };

  handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleSave = () => {
    const { title } = this.state;

    axiosInstance.put('/organisation/update-profile', { title })
      .then(() => {
        this.setState({ isEditing: false });
        this.fetchProfile();
      })
      .catch((error) => {
        console.error("Ошибка при сохранении изменений:", error);
      });
  };

  handleDelete = () => {
    axiosInstance.delete('/organisation/delete-account')
      .then(() => {
        localStorage.clear();
        this.props.navigate("/");
      })
      .catch((error) => {
        console.error("Ошибка при удалении аккаунта:", error);
      });
  };

  render() {
    const { title, isEditing } = this.state;
    return (
      <div className="creating-page">
        <header className="main-header"></header>
        <div className="profile-page">
          <LeftSlidebar />
          <div className="content">
            <h1>Профиль компании</h1>
            <div className="profile-content">
              <div className="profile-fields">
                <div className="field">
                  <label>Название компании:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => this.handleInputChange("title", e.target.value)}
                    />
                  ) : (
                    <span>{title || "Не указано"}</span>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="edit-actions">
                  <button className="save-button" onClick={this.handleSave}>Сохранить</button>
                  <button className="delete-button" onClick={this.handleDelete}>Удалить аккаунт</button>
                </div>
              )}
              <button className="edit-button" onClick={this.handleEditToggle}>
                {isEditing ? "Отменить" : "Редактировать"}
              </button>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigation(OrganisationProfile);
