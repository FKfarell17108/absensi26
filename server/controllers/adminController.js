const { User, Class, Major, Attendance } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Class, include: [Major] },
        { model: Major }
      ],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, name, class_id, major_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      name,
      class_id: role === 'student' ? class_id : null,
      major_id: role === 'teacher' ? major_id : null
    });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({ include: [Major] });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, major_id } = req.body;
    const newClass = await Class.create({ name, major_id });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await Class.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMajors = async (req, res) => {
  try {
    const majors = await Major.findAll();
    res.json(majors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMajor = async (req, res) => {
  try {
    const { name } = req.body;
    const newMajor = await Major.create({ name });
    res.status(201).json(newMajor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMajor = async (req, res) => {
  try {
    await Major.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Major deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [
        { 
          model: User, 
          attributes: ['name', 'username'],
          include: [{ model: Class, attributes: ['name'] }]
        }
      ],
      order: [['date', 'DESC'], ['timestamp', 'DESC']]
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
