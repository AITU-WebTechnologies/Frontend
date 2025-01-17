import React from "react";
import axiosInstance from "../configurations/instance";
import LeftSlidebarChecker from "./leftSlidebarChecker";
import withNavigation from "../utils/withNavigation";

class CheckerEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      selectedEvent: null,
      updatedParticipants: [],
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
      .get("/event/checker-events")
      .then((response) => {
        const sortedEvents = response.data.sort((a, b) => {
          const dateA = new Date(a.eventDate).getTime();
          const dateB = new Date(b.eventDate).getTime();
          return dateB - dateA; 
        });
        this.setState({ events: sortedEvents });
      })
      .catch((error) =>
        console.error("Ошибка при загрузке событий проверяющего:", error)
      );
  }

  handleView = (id) => {
    axiosInstance
      .get(`/event/checker/${id}`)
      .then((response) => {
        this.setState({
          selectedEvent: response.data,
          updatedParticipants: response.data.participants,
        });
      })
      .catch((error) =>
        console.error("Ошибка при загрузке деталей события:", error)
      );
  };

  handleStatusChange = (index, status) => {
    const updatedParticipants = [...this.state.updatedParticipants];
    updatedParticipants[index].status = status;
    this.setState({ updatedParticipants });
  };

  handleSaveStatus = () => {
    const { selectedEvent, updatedParticipants } = this.state;

    axiosInstance
      .put(`/event/update-participant-status/${selectedEvent.eventId}`, {
        participants: updatedParticipants,
      })
      .then((response) => {
        console.log("Статусы успешно обновлены:", response.data);
        this.setState({ selectedEvent: response.data });
      })
      .catch((error) =>
        console.error("Ошибка при сохранении статусов участников:", error)
      );
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

  render() {
    const { events, selectedEvent, updatedParticipants } = this.state;

    if (!this.state.isLoggedIn) {
      this.props.navigate("/");
    }

    return (
      <div className="checker-page">
        <header className="main-header"></header>
        <div className="profile-page">
          <LeftSlidebarChecker />
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
                        {status === "В процессе" && (
                          <button
                            className="check"
                            onClick={() => this.handleView(event.eventId)}
                          >
                            Просмотр
                          </button>
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

                <h3>Участники</h3>
                {updatedParticipants.map((participant, index) => (
                  <div key={index} className="participant">
                    <h4>Участник №{index + 1}</h4>
                    <div className="field">
                      <strong>ФИО:</strong> {participant.name}
                    </div>
                    <div className="field">
                      <strong>ИИН:</strong> {participant.iin}
                    </div>
                    <div>
                      <h4>Статус:</h4>
                      <select
                        className={`select-status ${
                          participant.status === "Посетил" ? "came" : "not-came"
                        }`}
                        value={participant.status}
                        onChange={(e) =>
                          this.handleStatusChange(index, e.target.value)
                        }
                      >
                        <option value="Не посетил">Не посетил</option>
                        <option value="Посетил">Посетил</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-button"
                  onClick={this.handleSaveStatus}
                >
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

export default withNavigation(CheckerEvents);
