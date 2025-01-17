import React from 'react';
import withNavigation from "../utils/withNavigation"; 
import logo from '../images/Logo.png'; 
import first from '../images/1.png';
import second from '../images/2.png';
import third from '../images/3.png';
import fourth from '../images/4.png';

class LeftSlidebar extends React.Component {
    handleItemClick = (action) => {
        switch (action) {
            case 'createEvent':
                this.props.navigate('/event-creation');
                break;
            case 'eventList':
                this.props.navigate('/events-list'); 
                break;
            case 'profile':
                this.props.navigate('/profile-org');
                break;
            case 'logout':
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                this.props.navigate('/');
                break;
            default:
                console.log('Unknown action:', action);
        }
    };

    render() {
        return (
            <div className="left-sidebar">
                <div className="left-sidebar-header">
                    <img src={logo} alt="logo" className='logo' />
                    <h3>Система учета<br /> посещаемости</h3>
                </div>
                
                <div className="content-bar">
                    <button 
                        className="content-bar-item" 
                        onClick={() => this.handleItemClick('createEvent')}
                    >
                        <img src={first} alt="first" />
                        <h4>Создание<br/> мероприятия</h4>
                    </button>
                    <button 
                        className="content-bar-item" 
                        onClick={() => this.handleItemClick('eventList')}
                    >
                        <img src={second} alt="second" />
                        <h4>Список созданных <br/>мероприятий</h4>
                    </button>
                    <button 
                        className="content-bar-item" 
                        onClick={() => this.handleItemClick('profile')}
                    >
                        <img src={third} alt="third" />
                        <h4>Профиль</h4>
                    </button>
                    <button 
                        className="content-bar-item" 
                        onClick={() => this.handleItemClick('logout')}
                    >
                        <img src={fourth} alt="fourth" />
                        <h4>Выход</h4>
                    </button>
                </div>
            </div>
        );
    }
}

export default withNavigation(LeftSlidebar);
