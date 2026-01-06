const express = require('express');
const router = express.Router();
const { submitAttendance, getStudentHistory, getTodayStatus } = require('../controllers/attendanceController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', verifyToken, authorizeRole('student'), upload.single('photo'), submitAttendance);
router.get('/history', verifyToken, authorizeRole('student'), getStudentHistory);
router.get('/today', verifyToken, authorizeRole('student'), getTodayStatus);

module.exports = router;
