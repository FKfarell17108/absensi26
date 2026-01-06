const express = require('express');
const router = express.Router();
const { getMajors, getClassesByMajor, getClassAttendance } = require('../controllers/teacherController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/majors', verifyToken, authorizeRole('teacher', 'admin'), getMajors);
router.get('/majors/:majorId/classes', verifyToken, authorizeRole('teacher', 'admin'), getClassesByMajor);
router.get('/classes/:classId/attendance', verifyToken, authorizeRole('teacher', 'admin'), getClassAttendance);

module.exports = router;
