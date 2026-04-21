const eventRouter = require("express").Router();
const Authentication = require("../../middlewares");
const Event = require("../../schemas/events.model");

eventRouter.get("/getEvents", Authentication, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id }).populate("album");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

eventRouter.post(("/addEvent", Authentication), async (req, res) => {
  const { title, description, date, location, albumIdArray, eventType } =
    req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      user: req.user._id,
      album: albumIdArray,
      eventType,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Error creating event", error });
  }
});

eventRouter.get("/getPublicEvents", async (req, res) => {
  try {
    const publicEvents = await Event.find({ eventType: "public" }).populate(
      "album",
    );
    res.json(publicEvents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public events", error });
  }
});

module.exports = eventRouter;
