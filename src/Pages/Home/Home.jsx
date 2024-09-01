import React, { useEffect, useRef, useState } from "react";
import ApiCall from "../../Api/ApiCall";
import { startApiCall } from "../../Helpers/globalFunctions";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import "../../Style/style.css";
import { EventEndPoint } from "../../Api/Endpoints";
import MainRoutes from "../../Routes/MainRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { AuthEndPoints } from "../../Api/Endpoints";
import toast from "react-hot-toast";
import ApiLoader from "../../Components/Loaders/ApiLoader";
import { resolveErrorMessage } from "../../Api/service";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import Tooltip from "react-tooltip-lite";
import moment from "moment";
import SkeletonLoader from "../../Components/Loaders/SkeletonLoader";
const Home = ({ user }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [errorMessage, seterrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [editmodalIsOpen, seteditmodalIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [eventId, seteventId] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [participants, setparticipants] = useState([{ email: "" }]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [time, settime] = useState(null);
  const [duration, setduration] = useState("");
  const [sessionNotes, setsessionNotes] = useState("");
  const [loader, setLoader] = useState(false);
  const [skelloading, setskelloading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const prevDateRangeRef = useRef(dateRange);

  console.log(dateRange);

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();

    let editEvent = events.find((e) => e.id === info?.event?._def?.publicId);

    seteventId(editEvent?.id);
    settitle(editEvent?.title);
    setdescription(
      editEvent?.description?.includes("Session Notes:")
        ? editEvent?.description.split("Session Notes:")[0]?.trim()
        : editEvent?.description?.trim()
    );
    setparticipants(editEvent?.attendees);
    setSelectedDate(editEvent?.start.split("T")[0]);
    settime(editEvent?.start.split("T")[1].split("+")[0]);
    setduration(
      (new Date(editEvent?.end) - new Date(editEvent?.start)) / (3600 * 1000)
    );
    setsessionNotes(
      editEvent?.description?.includes("Session Notes:")
        ? editEvent?.description?.split("Session Notes:")[1]
        : ""
    );

    seteditmodalIsOpen(true);
    // if (info.event.url) {
    //   window.open(info.event.url);
    // }
  };

  const handleDateClick = (clickInfo) => {
    setSelectedDate(clickInfo.dateStr);
    setModalIsOpen(true);
  };



  const handleDatesSet = async (arg) => {
    setskelloading(true)
    const newStartDate = moment(arg.start).format("YYYY-MM-DD");
    const newEndDate = moment(arg.end).format("YYYY-MM-DD");
   
    setEvents([])
      const data = {
        userId: user._id,
        startDate: newStartDate,
        endDate: newEndDate,
      };
      const res = await ApiCall("post", EventEndPoint.getEvents, data);

      if (res?.success) {
        setskelloading(false)
        setEvents(res?.result);
      } else {
        setskelloading(false)
        seterrorMessage(resolveErrorMessage(res.error));
      }
   
  };

  // useEffect(() => {
  //   console.log("================================")
  //   if(dateRange.startDate && dateRange.endDate) {
  //     // console.log("useEffecttttttt==============")
  //     handleGetEvents();

  //   }
  // }, [dateRange]);

  const deleteEvent = async () => {
    const data = {
      userId: user._id,
      google_event_id: eventId,
    };
    const res = await ApiCall("post", EventEndPoint.deleteEvent, data);
    if (res?.success) {
      toast.loading("Event Deleted Successfully");
      window.location.reload();
    } else {
      seterrorMessage(resolveErrorMessage(res.error));
      setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventStartTime = new Date(`${selectedDate}T${time}`);
    const eventEndTime = new Date(
      eventStartTime.getTime() + duration * 60 * 60 * 1000
    );
    const data = {
      userId: user._id,
      summary: title,
      description: `${description}\n\nSession Notes: ${sessionNotes}`,
      start: {
        dateTime: new Date(eventStartTime.toISOString()),
      },
      end: {
        dateTime: new Date(eventEndTime.toISOString()),
      },
      attendees: participants,
    };
    const res = await ApiCall("post", EventEndPoint.addEvent, data);
    if (res?.success) {
      toast.loading("Event Added Successfully");
      closeModal();
      window.location.reload();
    } else {
      seterrorMessage(resolveErrorMessage(res.error));
      setLoader(false);
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const eventStartTime = new Date(`${selectedDate}T${time}`);
    const eventEndTime = new Date(
      eventStartTime.getTime() + duration * 60 * 60 * 1000
    );
    console.log(eventStartTime, eventEndTime)
    const data = {
      google_event_id: eventId,
      userId: user._id,
      summary: title,
      description: `${description}\n\nSession Notes: ${sessionNotes}`,
      start: {
        dateTime: new Date(eventStartTime.toISOString()),
      },
      end: {
        dateTime: new Date(eventEndTime.toISOString()),
      },
      attendees: participants,
    };
    const res = await ApiCall("post", EventEndPoint.editEvent, data);
    if (res?.success) {
      toast.loading("Event Edited Successfully");
      window.location.reload();
    } else {
      seterrorMessage(resolveErrorMessage(res.error));
      setLoader(false);
    }
  };

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const start = new Date(event?.start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const end = event?.end
      ? new Date(event?.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div style={{ backgroundColor: "#2a89ef", width: "100%" }}>
        <b style={{ color: "white" }}>{event?.title.substring(0, 6) + "..."}</b>
        <div style={{ color: "white" }}>start : {start}</div>
        <div style={{ color: "white" }}>end : {end}</div>
      </div>
    );
  };

  const closeModal = () => {
    settitle("");
    setdescription("");
    setparticipants([{ email: "" }]);
    setSelectedDate("");
    settime("");
    setduration("");
    setsessionNotes("");
    setModalIsOpen(false);
    setNewEventTitle("");
  };
  const handleInputChange = (index, event) => {
    const newParticipants = [...participants];
    newParticipants[index] = { email: event.target.value };
    setparticipants(newParticipants);
  };

  const appendParticipant = () => {
    if (
      participants[participants.length - 1]?.email &&
      participants[participants.length - 1]?.email?.trim() !== "" &&
      emailPattern.test(participants[participants.length - 1]?.email.trim())
    ) {
      setparticipants([...participants, { email: "" }]);
    }
  };
  return (
    <div>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>
          Create at least one event to see your events
        </h2>
        {skelloading && (
        <i class="fa fa-circle-o-notch" style={{fontSize:"36px"}}></i>
      )}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            timeZone="local"
          />
      </div>
      {modalIsOpen && (
        <div class="modal-container">
          <div class="modal">
            <div class="modal-header">
              <h2 style={{ marginBlock: "0px" }}>Add Event</h2>
              <span class="modal-close" onClick={() => setModalIsOpen(false)}>
                &times;
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div class="modal-body">
                <div>
                  <label>Event Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label>Participants:</label>

                  {Array.isArray(participants) &&
                    participants.map((participant, index) => (
                      <div className="participants-div" key={index}>
                        <span>Email: </span>
                        <input
                          type="text"
                          name="participants"
                          value={participant?.email}
                          onChange={(e) => handleInputChange(index, e)}
                          required
                        />
                        {index === participants.length - 1 && (
                          <span
                            className="participants-button"
                            onClick={appendParticipant}
                          >
                            +
                          </span>
                        )}
                      </div>
                    ))}
                </div>

                <div>
                  <label>Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={time}
                    onChange={(e) => settime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Duration (in hours):</label>
                  <input
                    type="number"
                    name="duration"
                    value={duration}
                    onChange={(e) => setduration(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Session Notes:</label>
                  <textarea
                    name="sessionNotes"
                    value={sessionNotes}
                    onChange={(e) => setsessionNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="modal-button">
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editmodalIsOpen && (
        <div class="modal-container">
          <div class="modal">
            <div class="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h2 style={{ marginBlock: "0px" }}>Edit Event</h2>
                <button
                  className="delete-event"
                  type="button"
                  onClick={
                    () => setdeleteModal(true)
                    // deleteEvent
                  }
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
              <span
                class="modal-close"
                onClick={() => {
                  settitle("");
                  setdescription("");
                  setparticipants([""]);
                  setSelectedDate("");
                  settime("");
                  setSelectedDate("");
                  setduration("");
                  setsessionNotes("");
                  seteditmodalIsOpen(false);
                }}
              >
                &times;
              </span>
            </div>

            <form onSubmit={handleEdit}>
              <div class="modal-body">
                <div>
                  <label>Event Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label>Participants:</label>

                  {Array.isArray(participants) &&
                    participants.map((participant, index) => (
                      <div className="participants-div" key={index}>
                        <span>Email: </span>
                        <input
                          type="text"
                          name="participants"
                          value={participant?.email}
                          onChange={(e) => handleInputChange(index, e)}
                          required
                        />
                        {index === participants.length - 1 && (
                          <span
                            className="participants-button"
                            onClick={appendParticipant}
                          >
                            +
                          </span>
                        )}
                      </div>
                    ))}
                </div>
                <div>
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={time}
                    onChange={(e) => settime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Duration (in hours):</label>
                  <input
                    type="number"
                    name="duration"
                    value={duration}
                    onChange={(e) => setduration(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Session Notes:</label>
                  <textarea
                    name="sessionNotes"
                    value={sessionNotes}
                    onChange={(e) => setsessionNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="modal-button">
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteModal && (
        <div class="modal-container">
          <div class="modal">
            <div class="modal-header">
              <span class="modal-title">Delete Item</span>
              <span class="modal-close" onClick={() => setdeleteModal(false)}>
                &times;
              </span>
            </div>
            <div class="modal-body">
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </div>
            <div class="modal-footer">
              <button class="modal-button delete-button" onClick={deleteEvent}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
