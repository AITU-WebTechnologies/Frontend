import React from 'react';
import withNavigation from '../utils/withNavigation';
import axiosInstance from '../configurations/instance';

class VerificationOrg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }

  handleSubmit = () => {
    const { code } = this.state;
    const email = localStorage.getItem('email');

    axiosInstance
      .post('/organisation/confirm-org', { email, code })
      .then(response => {

        localStorage.setItem('token', response.data.accessToken);

        this.props.navigate('/profile-org');
      })
      .catch(error => {
        console.error('Verification failed:', error);
      });
  };

  render() {
    return (
      <div className="verification-container">
        <h1>Введите 6-значный код</h1>
        <p>На вашу почту был отправлен код</p>
        <div className="form-group">
          <h3 htmlFor="verificationCode">Код</h3>
          <input
            id="verificationCode"
            type="text"
            minLength="6"
            maxLength="6"
            onChange={(e) => this.setState({ code: e.target.value })}
            placeholder="Введите код"
          />
        </div>

        <button type="button" onClick={this.handleSubmit}>
          Подтвердить
        </button>
      </div>
    );
  }
}

export default withNavigation(VerificationOrg);
