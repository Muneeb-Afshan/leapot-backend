const Message = require('../../model/courseBuilder/CourseDiscussionSchema');
exports.getMessages = async (req, res) => {
    try {
      const { courseId } = req.params;
      const messages = await Message.find({ course: courseId }) .populate({
        path: "sender",
        populate: { path: "userid", model: "User" }, 
      })
      .exec();
      return res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
  };
  
  // Add a new message to a course
  exports.addMessage = async (req, res) => {
    try {
      const { course, sender, text, replyTo, attachments } = req.body;
  
      const newMessage = new Message({
        course,
        sender,
        text,
        replyTo,
        attachments,
      });
  
      await newMessage.save();
  
      return res.status(201).json({ success: true, message: 'Message added successfully', data: newMessage });
    } catch (error) {
      console.error('Error adding message:', error);
      return res.status(500).json({ success: false, message: 'Failed to add message' });
    }
  };

  exports.thumbUp = async (req, res) => {
    try {
      const { userId } = req.body;
      const message = await Message.findById(req.params.messageId);
      if (!message) return res.status(404).send('Message not found');
  
      if (message.usersVoted.thumbUps.includes(userId)) {
        return res.status(400).send('User has already voted thumb up');
      }
  
      message.thumbUps += 1;
      message.usersVoted.thumbUps.push(userId);
      const thumbDownIndex = message.usersVoted.thumbDowns.indexOf(userId);
      if (thumbDownIndex !== -1) {
        message.thumbDowns -= 1;
        message.usersVoted.thumbDowns.splice(thumbDownIndex, 1);
      }
  
      await message.save();
  
      res.send(message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  exports.thumbDown = async (req, res) => {
    try {
      const { userId } = req.body;
      const message = await Message.findById(req.params.messageId);
      if (!message) return res.status(404).send('Message not found');
  
      if (message.usersVoted.thumbDowns.includes(userId)) {
        return res.status(400).send('User has already voted thumb down');
      }
  
      message.thumbDowns += 1;
      message.usersVoted.thumbDowns.push(userId);
  
      const thumbUpIndex = message.usersVoted.thumbUps.indexOf(userId);
      if (thumbUpIndex !== -1) {
        message.thumbUps -= 1;
        message.usersVoted.thumbUps.splice(thumbUpIndex, 1);
      }
  
      await message.save();
  
      res.send(message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };