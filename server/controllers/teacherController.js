const { Major, Class, User, Attendance } = require('../models');
const { Op } = require('sequelize');

exports.getMajors = async (req, res) => {
  try {
    const majors = await Major.findAll();
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassesByMajor = async (req, res) => {
  try {
    const { majorId } = req.params;
    const classes = await Class.findAll({ where: { major_id: majorId } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await User.findAll({
      where: { class_id: classId, role: 'student' },
      attributes: ['id', 'name', 'username']
    });

    const today = new Date().toISOString().split('T')[0];

    const studentIds = students.map(s => s.id);
    const todaysAttendance = await Attendance.findAll({
      where: {
        user_id: { [Op.in]: studentIds },
        date: today
      },
      attributes: ['user_id', 'status', 'photo_url', 'notes', 'timestamp']
    });

    const attendanceMap = new Map();
    todaysAttendance.forEach(a => {
      attendanceMap.set(a.user_id, {
        status: a.status,
        photo_url: a.photo_url,
        notes: a.notes,
        timestamp: a.timestamp
      });
    });

    const result = students.map(s => {
      const att = attendanceMap.get(s.id);
      return {
        id: s.id,
        name: s.name,
        username: s.username,
        status: att?.status || 'alpha',
        photo_url: att?.photo_url || null,
        notes: att?.notes || null,
        timestamp: att?.timestamp || null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
