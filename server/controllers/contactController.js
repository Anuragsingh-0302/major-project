import sendEmail from "../utils/sendEmail.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const subject = `📬 New Contact Message from ${name}`;
    const html = `
      <h2>DeptHub Contact Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/> ${message}</p>
    `;

    // ✉️ Send email to yourself
    await sendEmail("anuragsingh4006@gmail.com", subject, html); // <- change this

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("sendContactMessage error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
