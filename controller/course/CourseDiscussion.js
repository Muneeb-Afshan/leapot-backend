const Message = require('../../model/courseBuilder/CourseDiscussionSchema');
exports.getMessages = async (req, res) => {
    try {
      const { courseId } = req.params;
      const messages = await Message.find({ course: courseId })
      return res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
  };
  
  // Add a new message to a course
  exports.addMessage = async (req, res) => {
    try {
      const { course, sender, text, replyTo, attachments, thumbUps = 0, thumbDowns = 0  } = req.body;
  
      // Create a new message
      const newMessage = new Message({
        course,
        sender,
        text,
        replyTo,
        attachments,
        thumbUps,
        thumbDowns,
      });
  
      // Save the message to the database
      await newMessage.save();
  
      // Return success response
      return res.status(201).json({ success: true, message: 'Message added successfully', data: newMessage });
    } catch (error) {
      console.error('Error adding message:', error);
      return res.status(500).json({ success: false, message: 'Failed to add message' });
    }
  };

  exports.thumbUp = async (req, res) => {
    try {
      const message = await Message.findById(req.params.messageId);
      if (!message) return res.status(404).send('Message not found');
  
      message.thumbUp += 1;
      await message.save();
  
      res.send(message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  exports.thumbDown = async (req, res) => {    try {
      const message = await Message.findById(req.params.messageId);
      if (!message) return res.status(404).send('Message not found');
  
      message.thumbDown += 1;
      await message.save();
  
      res.send(message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };