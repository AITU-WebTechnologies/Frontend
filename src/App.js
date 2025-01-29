import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddOrganisation from "./components/addOrganisation";
import AddChecker from "./components/addChecker";
import RoleSelection from "./components/roleSelection";
import AuthUser from "./components/auth";
import Verification from './components/verifyAccount';
import VerificationOrg from "./components/verifyAccountOrg";
import EventCreationForm from "./components/eventCreatingForm";
import OrganisationProfile from "./components/orgProfile";
import EventsList from "./components/eventsList";
import CheckerEvents from "./components/checkerEvents";
import CheckerProfile from "./components/checkerProfile";
import ForgetPassword from "./components/forgetPassword";
import VerificationPassword from "./components/verifyAccountPassword";
import CreateNewPassword from "./components/createNewPassword";
import DatabaseErrorPage from "./components/DatabaseErrorPage";
import DatabaseStatus from "./utils/DatabaseStatus";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatabaseAvailable: true, 
    };
  }

  componentDidMount() {

    DatabaseStatus.addListener(this.handleDatabaseStatusChange);
  }

  componentWillUnmount() {

    DatabaseStatus.removeListener(this.handleDatabaseStatusChange);
  }

  handleDatabaseStatusChange = (status) => {
    this.setState({ isDatabaseAvailable: status });
  };

  render() {
    const { isDatabaseAvailable } = this.state;

    if (!isDatabaseAvailable) {
      
      return <DatabaseErrorPage />;
    }

    return (
      <Router>
        <Routes>
          <Route path="/" element={<div className="container"><AuthUser /></div>} />
          <Route path="/role-selection" element={<div className="container"><RoleSelection /></div>} />
          <Route path="/add-organisation" element={<div className="container"><AddOrganisation /></div>} />
          <Route path="/add-checker" element={<div className="container"><AddChecker /></div>} />
          <Route path="/verify-checker" element={<div className="container"><Verification /></div>} />
          <Route path="/verify-code" element={<div className="container"><VerificationPassword /></div>} />
          <Route path="/create-new-password" element={<div className="container"><CreateNewPassword /></div>} />
          <Route path="/verify-organisation" element={<div className="container"><VerificationOrg /></div>} />
          <Route path="/event-creation" element={<EventCreationForm />} />
          <Route path="/events-list" element={<EventsList />} />
          <Route path="/profile-org" element={<OrganisationProfile />} />
          <Route path="/checker-events" element={<CheckerEvents />} />
          <Route path="/profile-checker" element={<CheckerProfile />} />
          <Route path="/forget-password" element={<div className="container"><ForgetPassword /></div>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
