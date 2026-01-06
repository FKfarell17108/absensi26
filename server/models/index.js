const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Major = sequelize.define('Major', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, { 
  timestamps: false,
  tableName: 'majors'
});

const Class = sequelize.define('Class', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { 
  timestamps: false,
  tableName: 'classes'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users'
});

const Attendance = sequelize.define('Attendance', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('hadir', 'sakit', 'izin', 'alpha'),
    allowNull: false
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance'
});

const AuditLog = sequelize.define('AuditLog', {
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'audit_logs'
});

Major.hasMany(Class, { foreignKey: 'major_id' });
Class.belongsTo(Major, { foreignKey: 'major_id' });

Class.hasMany(User, { foreignKey: 'class_id' });
User.belongsTo(Class, { foreignKey: 'class_id' });

Major.hasMany(User, { foreignKey: 'major_id', as: 'teachers' });
User.belongsTo(Major, { foreignKey: 'major_id' });

User.hasMany(Attendance, { foreignKey: 'user_id' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Major,
  Class,
  User,
  Attendance,
  AuditLog
};
