const eventRouter = require("express").Router();
const Authentication = require("../../middlewares");
const {
  getEvents,
  addEvent,
  getPublicEvents,
  addCommentsOnEvent,
  addAttendee,
} = require("../../controllers/eventsController");

eventRouter.get("/getEvents", Authentication, getEvents);

eventRouter.post("/addEvent", Authentication, addEvent);

eventRouter.get("/getPublicEvents", getPublicEvents);
eventRouter.post("/addCommentsOnEvent/:eventId", Authentication, addCommentsOnEvent);
eventRouter.post("/addAttendee/:eventId", Authentication, addAttendee);

module.exports = eventRouter;
