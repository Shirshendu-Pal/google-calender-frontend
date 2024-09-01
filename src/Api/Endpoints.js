const userPrefix = "user";
const authPrefix = "auth";

// ** AUTH RELATED ENDPOINTS **
export const AuthEndPoints = {
  userLogin: authPrefix + "/login",
  verifyUser: authPrefix + "/verify"

};

// ** USER RELATED ENDPOINTS **
export const EventEndPoint = {
  addEvent: userPrefix + "/add-event",
  editEvent: userPrefix + "/edit-event",
  deleteEvent: userPrefix + "/delete-event",
  getEvents: userPrefix + "/get-all-events"

};
