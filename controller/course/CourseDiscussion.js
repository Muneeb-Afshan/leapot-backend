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

  exports.updateThumbs = async (req, res) => {
    const { id } = req.params;
    const { type, increment } = req.body;
  
    try {
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      if (type === 'thumbUps') {
        increment ? message.thumbUps++ : message.thumbUps--;
      } else if (type === 'thumbDowns') {
        increment ? message.thumbDowns++ : message.thumbDowns--;
      }
  
      await message.save();
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
