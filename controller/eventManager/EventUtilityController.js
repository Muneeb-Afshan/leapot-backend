const EventType = require('../../model/EventType');
const MemberType = require('../../model/MemberType');
const DeliveryMethod = require('../../model/EventDelivery');
const EventAffiliation = require('../../model/EventAfffiliation');
const EventAccessibility = require('../../model/EventAccessibility');

exports.createEventType = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
  
      const existingEventType = await EventType.findOne({ name });
      if (existingEventType) {
        return res.status(400).json({ message: "Event type with this name already exists" });
      }
  
      const newEventType = new EventType({
        name,
      });

      await newEventType.save();
  
      res.status(201).json(newEventType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.eventType = async (req, res) => {
  try {
    const eventTypes = await EventType.find();
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMemberType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingMemberType = await MemberType.findOne({ name });
    if (existingMemberType) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const newMemberType = new MemberType({
      name,
    });

    await newMemberType.save();

    res.status(201).json(newMemberType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchMemberType = async (req, res) => {
try {
  const memberTypes = await MemberType.find();
  res.json(memberTypes);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

exports.createDeliveryMethod = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingMethod = await DeliveryMethod.findOne({ name });
    if (existingMethod) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const newMethod = new DeliveryMethod({
      name,
    });

    await newMethod.save();

    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchDeliveryMethod = async (req, res) => {
try {
  const method = await DeliveryMethod.find();
  res.json(method);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

exports.createEventAffiliation = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingAffiliation = await EventAffiliation.findOne({ name });
    if (existingAffiliation) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const newAffiliation = new EventAffiliation({
      name,
    });

    await newAffiliation.save();

    res.status(201).json(newAffiliation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchEventAffiliation = async (req, res) => {
try {
  const method = await EventAffiliation.find();
  res.json(method);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

exports.createEventAccessibility = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingMethod = await EventAccessibility.findOne({ name });
    if (existingMethod) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const newMethod = new EventAccessibility({
      name,
    });

    await newMethod.save();

    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchEventAccessibility = async (req, res) => {
try {
  const method = await EventAccessibility.find();
  res.json(method);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
