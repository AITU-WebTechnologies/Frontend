import React from "react";
import withNavigation from "../utils/withNavigation";
import LeftSlidebar from "./leftSlidebar";
import axiosInstance from "../configurations/instance";

class EventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      selectedEvent: null,
      editEvent: null,
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

    axiosInstance
      .get("/event/all-events")
      .then((response) => {
        const sortedEvents = response.data.sort((a, b) => {
          const dateA = new Date(a.eventDate).getTime();
          const dateB = new Date(b.eventDate).getTime();
          return dateB - dateA; 
        });
        this.setState({ events: sortedEvents });
      })
      .catch((error) => console.error("Ошибка при загрузке событий:", error));
  }

  handleView = (id) => {
    axiosInstance
      .get(`/event/${id}`)
      .then((response) => {
        this.setState({ selectedEvent: response.data, editEvent: null });
      })
      .catch((error) => console.error("Ошибка при загрузке события:", error));
  };

  handleDelete = (id) => {
    axiosInstance
      .delete(`/event/${id}`)
      .then(() => {
        this.setState((prevState) => ({
          events: prevState.events.filter((event) => event.eventId !== id),
          selectedEvent: null,
          editEvent: null,
        }));
      })
      .catch((error) => console.error("Ошибка при удалении события:", error));
  };

  handleEdit = (id) => {
    axiosInstance
      .get(`/event/${id}`)
      .then((response) => {
        this.setState({ editEvent: response.data, selectedEvent: null });
      })
      .catch((error) => console.error("Ошибка при загрузке события:", error));
  };

  handleInputChange = (field, value) => {
    this.setState((prevState) => ({
      editEvent: {
        ...prevState.editEvent,
        [field]: value,
      },
    }));
  };

  handleEmailChange = (index, value) => {
    this.setState((prevState) => {
      const newEmailFields = [...prevState.editEvent.emailFields];
      newEmailFields[index] = value;
      return {
        editEvent: {
          ...prevState.editEvent,
          emailFields: newEmailFields,
        },
      };
    });
  };

  addEmailField = () => {
    this.setState((prevState) => ({
      editEvent: {
        ...prevState.editEvent,
        emailFields: [...prevState.editEvent.emailFields, ""],
      },
    }));
  };

  removeEmailField = (index) => {
    if (index > 0) {
      this.setState((prevState) => ({
        editEvent: {
          ...prevState.editEvent,
          emailFields: prevState.editEvent.emailFields.filter((_, i) => i !== index),
        },
      }));
    }
  };

  handleParticipantChange = (index, field, value) => {
    this.setState((prevState) => {
      const newParticipants = [...prevState.editEvent.participants];
      newParticipants[index][field] = value;
      return {
        editEvent: {
          ...prevState.editEvent,
          participants: newParticipants,
        },
      };
    });
  };

  addParticipant = () => {
    this.setState((prevState) => ({
      editEvent: {
        ...prevState.editEvent,
        participants: [...prevState.editEvent.participants, { name: "", iin: "" }],
      },
    }));
  };

  removeParticipant = (index) => {
    if (index > 0) {
      this.setState((prevState) => ({
        editEvent: {
          ...prevState.editEvent,
          participants: prevState.editEvent.participants.filter((_, i) => i !== index),
        },
      }));
    }
  };

  getStatus = (eventDate) => {
    const now = new Date();
    const eventStart = new Date(eventDate);
    const diffInMs = now - eventStart;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return "В ожидании";
    } else if (diffInHours <= 12) {
      return "В процессе";
    } else {
      return "Завершено";
    }
  };

  getStatusClass = (status) => {
    if (status === "В ожидании") return "status-pending";
    if (status === "В процессе") return "status-active";
    if (status === "Завершено") return "status-completed";
    return "";
  };

  isEditableOrDeletable(eventDate) {
    const now = new Date();
    const eventStart = new Date(eventDate);
    return now < eventStart;
  }

  handleUpdate = () => {
    const { editEvent } = this.state;

    if (
      !editEvent.eventName ||
      !editEvent.eventType ||
      !editEvent.eventDate ||
      editEvent.emailFields.some((email) => !email) ||
      editEvent.participants.some(
        (participant) => !participant.name || !participant.iin
      )
    ) {
      this.setState({ errorMessage: "Все поля должны быть заполнены" });
      return;
    }

    axiosInstance
      .put(`/event/${editEvent.eventId}`, editEvent)
      .then(() => {
        this.setState({ errorMessage: "", editEvent: null });
        this.componentDidMount();
      })
      .catch((error) => console.error("Ошибка при обновлении события:", error));
  };

  render() {
    const { events, selectedEvent, editEvent, errorMessage } = this.state;

    if (!this.state.isLoggedIn) {
      this.props.navigate("/");
    }

    return (
      <div className="creating-page">
        <header className="main-header"></header>
        <div className="profile-page">
          <LeftSlidebar />
          <div className="content">
            <h1>Список событий</h1>
            <table className="event-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Название</th>
                  <th>Дата проведения</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => {
                  const status = this.getStatus(event.eventDate);
                  const statusClass = this.getStatusClass(status);

                  return (
                    <tr key={event.eventId}>
                      <td>{index + 1}</td>
                      <td>{event.eventName}</td>
                      <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>{status}</span>
                      </td>
                      <td>
                        <button
                          className="check"
                          onClick={() => this.handleView(event.eventId)}
                        >
                          Просмотр
                        </button>
                        {this.isEditableOrDeletable(event.eventDate) && (
                          <>
                            <button
                              className="change"
                              onClick={() => this.handleEdit(event.eventId)}
                            >
                              Изменить
                            </button>
                            <button
                              className="delete"
                              onClick={() => this.handleDelete(event.eventId)}
                            >
                              Удалить
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {selectedEvent && (
              <div className="checkerViewForm">
                <h1>Детали события</h1>
                <h3>Название мероприятия</h3>
                <div className="field">{selectedEvent.eventName}</div>

                <h3>Тип мероприятия</h3>
                <div className="field">{selectedEvent.eventType}</div>

                <h3>Дата проведения</h3>
                <div className="field">
                  {new Date(selectedEvent.eventDate).toLocaleString()}
                </div>

                <h3>Проверяющие</h3>
                {selectedEvent.emailFields.map((email, index) => (
                  <div key={index} className="field">
                    {email}
                  </div>
                ))}

                <h3>Участники</h3>
                {selectedEvent.participants.map((participant, index) => (
                  <div key={index} className="participant">
                    <h4>Участник №{index + 1}</h4>
                    <div className="field">
                      <strong>ФИО:</strong> {participant.name}
                    </div>
                    <div className="field">
                      <strong>ИИН:</strong> {participant.iin}
                    </div>
                    <div className="field">
                      <strong>Статус:</strong>{" "}
                      <span
                        className={`status-badge ${
                          participant.status === "Посетил"
                            ? "came"
                            : "not-came"
                        }`}
                      >
                        {participant.status || "Неизвестно"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {editEvent && (
              <div className="createForm">
                <h1>Редактирование события</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <h3>Название мероприятия</h3>
                <input
                  type="text"
                  value={editEvent.eventName}
                  onChange={(e) => this.handleInputChange("eventName", e.target.value)}
                />

                <h3>Тип мероприятия</h3>
                <select
                  value={editEvent.eventType}
                  onChange={(e) => this.handleInputChange("eventType", e.target.value)}
                >
                  <option value="" disabled>
                    Выберите тип мероприятия
                  </option>
                  <option value="seminar">Семинар</option>
                  <option value="competition">Соревнования</option>
                  <option value="conference">Конференция</option>
                </select>

                <h3>Дата проведения</h3>
                <input
                  type="datetime-local"
                  value={new Date(editEvent.eventDate).toISOString().slice(0, 16)}
                  onChange={(e) => this.handleInputChange("eventDate", e.target.value)}
                />

                <h3>Добавьте проверяющего(-их)</h3>
                {editEvent.emailFields.map((email, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder="Введите почту проверяющего"
                      value={email}
                      onChange={(e) => this.handleEmailChange(index, e.target.value)}
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
                <button onClick={this.addEmailField}>Добавить проверяющего</button>

                <h3>Добавьте участника(-ов)</h3>
                {editEvent.participants.map((participant, index) => (
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
                <button onClick={this.addParticipant}>Добавить участника</button>
                <button className="add-button" onClick={this.handleUpdate}>
                  Сохранить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigation(EventsList);
