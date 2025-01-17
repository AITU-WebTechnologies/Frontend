import React from 'react';
import LeftSlidebarChecker from './leftSlidebarChecker';
import axiosInstance from "../configurations/instance";
import withNavigation from "../utils/withNavigation";

class OrganisationProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      title: "",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({ isLoggedIn: false });
      return;
    }

    axiosInstance.get('/organisation/profile')
      .then((response) => {
        const { title } = response.data;
        this.setState({ title });
      })
      .catch((error) => {
        console.error('Ошибка при загрузке профиля организации:', error.response?.data?.message || error.message);
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
            <h1>Профиль компании</h1>
            <div className="profile-content">
              <div className="profile-fields">
                <div className="field">
                  <label>Название компании:</label>
                  <span>{this.state.title || "Не указано"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigation(OrganisationProfile);
