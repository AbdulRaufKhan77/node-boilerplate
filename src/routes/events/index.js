const eventRouter = require("express").Router();
const Authentication = require("../../middlewares");
const {
  getEvents,
  addEvent,
  getPublicEvents,
} = require("../../controllers/eventsController");

eventRouter.get("/getEvents", Authentication, getEvents);

eventRouter.post("/addEvent", Authentication, addEvent);

eventRouter.get("/getPublicEvents", getPublicEvents);

module.exports = eventRouter;
