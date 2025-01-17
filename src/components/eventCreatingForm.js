import React from "react";
import LeftSlidebar from "./leftSlidebar";
import withNavigation from "../utils/withNavigation";
import axiosInstance from "../configurations/instance";

class EventCreationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
      eventType: "",
      eventDate: "",
      emailFields: [""],
      participants: [{ name: "", iin: "" }],
      errorMessage: "",
      isLoggedIn: true, 
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({ isLoggedIn: false });
      return;
    }
  }

  handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  addEmailField = () => {
    this.setState((prevState) => ({
      emailFields: [...prevState.emailFields, ""],
    }));
  };

  removeEmailField = (index) => {
    if (index > 0) {
      this.setState((prevState) => ({
        emailFields: prevState.emailFields.filter((_, i) => i !== index),
      }));
    }
  };

  handleEmailChange = (index, event) => {
    const newEmailFields = [...this.state.emailFields];
    newEmailFields[index] = event.target.value;
    this.setState({ emailFields: newEmailFields });
  };

  addParticipant = () => {
    this.setState((prevState) => ({
      participants: [...prevState.participants, { name: "", iin: "" }],
    }));
  };

  removeParticipant = (index) => {
    if (index > 0) {
      this.setState((prevState) => ({
        participants: prevState.participants.filter((_, i) => i !== index),
      }));
    }
  };

  handleParticipantChange = (index, field, value) => {
    const newParticipants = [...this.state.participants];
    newParticipants[index][field] = value;
    this.setState({ participants: newParticipants });
  };

  handleSubmit = () => {
    const { eventName, eventType, eventDate, emailFields, participants } =
      this.state;

    if (
      !eventName ||
      !eventType ||
      !eventDate ||
      emailFields.some((email) => !email) ||
      participants.some((participant) => !participant.name || !participant.iin)
    ) {
      this.setState({ errorMessage: "Все поля должны быть заполнены" });
      return;
    }

    const creatorEmail = localStorage.getItem("email");
    axiosInstance
      .post("/event/create-event", {
        eventName,
        eventType,
        eventDate,
        emailFields,
        participants,
        creatorEmail,
      })
      .then((response) => {
        console.log(response.data);
        this.props.navigate("/events-list");
        this.setState({ errorMessage: "" }); 
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  render() {
    const { errorMessage } = this.state;

    if (!this.state.isLoggedIn) {
      this.props.navigate("/");
    }

    return (
      <div className="creating-page">
        <header className="main-header"></header>
        <div className="page-main">
          <LeftSlidebar />
          <div className="content">
            <h1>Создание мероприятия</h1>
            <div className="createForm">
              {errorMessage && (
                <p className="error-message" >{errorMessage}</p>
              )}
              <h3>Название мероприятия</h3>
              <input
                type="text"
                placeholder="Напишите название мероприятия"
                onChange={(e) =>
                  this.handleInputChange("eventName", e.target.value)
                }
              />
              <h3>Выберите тип мероприятия</h3>
              <select
                value={this.state.eventType}
                onChange={(e) => this.handleInputChange("eventType", e.target.value)}
              >
                <option value="" disabled>
                  Выберите тип мероприятия
                </option>
                <option value="Семинар">Семинар</option>
                <option value="Соревнования">Соревнования</option>
                <option value="Конференция">Конференция</option>
              </select>
              <h3>Дата проведения</h3>
              <input
                type="datetime-local"
                className="datetime-input"
                onChange={(e) =>
                  this.handleInputChange("eventDate", e.target.value)
                }
              />
              <h3>Добавьте проверяющего(-их)</h3>
              {this.state.emailFields.map((email, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Введите почту проверяющего"
                    value={email}
                    onChange={(e) => this.handleEmailChange(index, e)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => this.removeEmailField(index)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={this.addEmailField}>
                Добавить проверяющего
              </button>
              <h3>Добавьте участника(-ов)</h3>
              {this.state.participants.map((participant, index) => (
                <div key={index}>
                  <h4>Участник №{index + 1}</h4>
                  <h3>ФИО</h3>
                  <input
                    type="text"
                    placeholder="Введите ФИО участника"
                    value={participant.name}
                    onChange={(e) =>
                      this.handleParticipantChange(index, "name", e.target.value)
                    }
                  />
                  <h3>ИИН</h3>
                  <input
                    type="number"
                    placeholder="Введите ИИН участника"
                    value={participant.iin}
                    onChange={(e) =>
                      this.handleParticipantChange(index, "iin", e.target.value)
                    }
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => this.removeParticipant(index)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={this.addParticipant}>
                Добавить участника
              </button>
              <button
                type="button"
                className="add-button"
                onClick={this.handleSubmit}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigation(EventCreationForm);
