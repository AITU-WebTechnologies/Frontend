import React from 'react';
import withNavigation from "../utils/withNavigation"; 
import logo from '../images/Logo.png'; 
import fifth from '../images/5.png';
import third from '../images/3.png';
import fourth from '../images/4.png';

class LeftSlidebarChecker extends React.Component {
    handleItemClick = (action) => {
        switch (action) {
            case 'checkEvent':
                this.props.navigate('/checker-events');
                break;
            case 'profile':
                this.props.navigate('/profile-checker');
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
                        onClick={() => this.handleItemClick('checkEvent')}
                    >
                        <img src={fifth} alt="fifth" />
                        <h4>Отслеживание<br/> Мероприятий</h4>
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

export default withNavigation(LeftSlidebarChecker);
