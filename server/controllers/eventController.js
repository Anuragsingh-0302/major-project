// controllers/eventController.js


import Event from "../models/EventInfo.js";
import Student from "../models/StudentInfo.js";

export const createEvent = async (req, res) => {
  try {
    const { eventId, title, description, link, lastDate } = req.body;
    const createdBy = req.teacher?._id || req.hod?._id;

    const event = new Event({
      eventId,
      title,
      description,
      link,
      lastDate,
      createdBy,
    });
    await event.save();
    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Event creation failed" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

export const participateInEvent = async (req, res) => {
  const { id } = req.params; // Event ID from URL
  const tokenUser = req.user; // From middleware

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const student = await Student.findById(tokenUser.id); // ✅ full student info

    // ✅ Prevent duplicate participation
    const alreadyExists = event.participants.some(
      (p) => p.student.toString() === student._id.toString()
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Already participated" });
    }

    // ✅ Push full participant data
    event.participants.push({
      student: student._id,
      name: student.username,
      enrollment: student.enrollment,
      class: student.class,
      yearOfAdmission: student.yearOfAdmission,
      profileImage: student.profileImage, // ✅ now added
    });

    await event.save();

    res.status(200).json({ message: "Participation successful" });
  } catch (err) {
    console.error("Participation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};

export const deleteParticipant = async (req, res) => {
  try {
    const { eventId, participantId } = req.params;
    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    event.participants = event.participants.filter(
      (p) => p._id.toString() !== participantId
    );
    await event.save();
    res.status(200).json({ success: true, message: "Participant removed" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove participant" });
  }
};


export const updateEvent = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params);
    const { id } = req.params;
    const { title, description, link, lastDate } = req.body;

    const event = await Event.findById(id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    event.title = title;
    event.description = description;
    event.link = link;
    event.lastDate = lastDate;
    await event.save();
    res.status(200).json({ success: true, message: "Event updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};