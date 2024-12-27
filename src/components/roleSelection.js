import React from "react";

class RoleSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: ""
        };
    }

    handleRoleChange = (event) => {
        this.setState({ role: event.target.value });
    }

    render() {
        return (
            <div>
                <h1>Добро Пожаловать!</h1>
                <h3>Чтобы начать регистрацию выберите вашу роль</h3>
                <div className="role-option">
                    <h4>Роль<span className="requiredMark">*</span></h4>
                    <form>
                        
                        <div>
                            <input type="radio" name="role" value="Organisation" onChange={this.handleRoleChange} id="organizer" />
                            <label htmlFor="organizer" className="context">Организатор</label>
                        </div>
                        <div>
                            <input type="radio" name="role" value="Checker" onChange={this.handleRoleChange} id="checker" />
                            <label htmlFor="checker" className="context">Проверяющий</label>
                        </div>
                        <button type="button"  onClick={() => this.props.onAdd({
                            role: this.state.role
                        })}>Продолжить</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default RoleSelection;
