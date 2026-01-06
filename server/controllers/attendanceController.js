const { Attendance, User, Class, Major } = require('../models');
const { Op } = require('sequelize');

exports.submitAttendance = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const existing = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (existing) {
      return res.status(400).json({ message: 'Anda sudah melakukan absensi hari ini.' });
    }

    let photoUrl = null;
    if (status === 'hadir' || req.file) {
      if (!req.file && status === 'hadir') {
         return res.status(400).json({ message: 'Foto wajib untuk status Hadir.' });
      }
      if (req.file) photoUrl = req.file.path;
    }

    const attendance = await Attendance.create({
      user_id: userId,
      date: today,
      status,
      photo_url: photoUrl,
      notes,
      timestamp: new Date()
    });

    const user = await User.findByPk(userId, { include: [Class] });
    
    req.io.emit('new_attendance', {
      attendance,
      user: {
        name: user.name,
        class_name: user.Class ? user.Class.name : 'Unknown'
      }
    });

    res.status(201).json({ message: 'Absensi berhasil dicatat.', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Attendance.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const status = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });
    res.json(status); // Returns null if not present
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
