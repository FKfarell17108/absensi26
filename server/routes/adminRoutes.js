const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const {
  getAllUsers, createUser, deleteUser,
  getAllClasses, createClass, deleteClass,
  getAllMajors, createMajor, deleteMajor,
  getAttendanceReport
} = require('../controllers/adminController');

router.use(verifyToken, authorizeRole('admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get('/classes', getAllClasses);
router.post('/classes', createClass);
router.delete('/classes/:id', deleteClass);

router.get('/majors', getAllMajors);
router.post('/majors', createMajor);
router.delete('/majors/:id', deleteMajor);

router.get('/attendance', getAttendanceReport);

module.exports = router;
