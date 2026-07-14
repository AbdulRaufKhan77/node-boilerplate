const mongoose = require("mongoose");
const Event = require("../schemas/event.model");

// Get all events for the authenticated user
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).populate("album");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Create a new event
const addEvent = async (req, res) => {
  const { title, description, date, location, albumIdArray, visibility, category, virtualLink, playlist } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      user: req.user._id,
      album: albumIdArray,
      visibility,
      category,
      virtualLink,
      playlist,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Error creating event", error });
  }
};

// Get all public events
const getPublicEvents = async (req, res) => {
  try {
    const publicEvents = await Event.find({ visibility: "public" }).populate(
      "album",
    );
    res.json(publicEvents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public events", error });
  }
};

const addCommentsOnEvent =async (req, res) => {
    const { eventId } = req.params;
    const { comment } = req.body;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.comments.push({ user: req.user._id, comment });
        await event.save();
        res.json({ message: "Comment added", event });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
};

const addAttendee = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: "Already attending" });
    }
    event.attendees.push(req.user._id);
    await event.save();
    res.json({ message: "Added to attendees", event });
  } catch (error) {
    res.status(500).json({ message: "Error adding attendee", error });
  }
};

// Get a single public event with populated relations
const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(404).json({ message: "Event not found" });
    }
    const event = await Event.findById(eventId)
      .populate("user", "name role")
      .populate("album", "title artist coverUrl")
      .populate("attendees", "name")
      .populate("comments.user", "name");
    if (!event || event.visibility !== "public") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

module.exports = {
  getEvents,
  addEvent,
  getPublicEvents,
  addCommentsOnEvent,
  addAttendee,
  getEventById,
};
