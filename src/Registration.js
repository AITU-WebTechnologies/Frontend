import React from "react";
import AddOrganisation from "./components/addOrganisation";
import AddChecker from "./components/addChecker";
import RoleSelection from "./components/roleSelection";
import AuthUser from "./components/auth";

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      isRegistering: false
    };
  }

  render() {
    return (
      <div className="container">
        {!this.state.isRegistering && this.state.role === "" && <AuthUser onRegister={this.handleRegister} />}
        {this.state.isRegistering && <RoleSelection onAdd={this.addUser} />}
        {this.state.role === "Organisation" && <AddOrganisation />} 
        {this.state.role === "Checker" && <AddChecker />}
      </div>
    );
  }

  addUser = (user) => {
    this.setState({ role: user.role, isRegistering: false });
    console.log(user);
  }

  handleRegister = () => {
    this.setState({ isRegistering: true });
  }
}

export default Registration;
