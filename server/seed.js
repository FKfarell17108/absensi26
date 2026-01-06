const seed = async () => {
  const { sequelize, User, Major, Class } = require('./models');
  const bcrypt = require('bcryptjs');

  try {
    await sequelize.authenticate();

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    
    await sequelize.sync({ force: true }); 

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

    console.log('Database synced. Seeding data...');
    const majorsData = ['KGS', 'TEK', 'TITL', 'TFLM', 'TKR', 'SIJA'];
    const majors = await Major.bulkCreate(majorsData.map(name => ({ name })));
    console.log('Majors seeded.');

    const classesData = [];
    for (const major of majors) {
      for (let grade of [10, 11, 12]) {
        for (let num of [1, 2]) {
          classesData.push({
            name: `${grade} ${major.name} ${num}`,
            major_id: major.id
          });
        }
      }
    }
    await Class.bulkCreate(classesData);
    console.log('Classes seeded.');

    const commonPassword = await bcrypt.hash('123456', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);

    const usersData = [];

    usersData.push({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      name: 'Administrator Utama'
    });

    const sijaMajor = majors.find(m => m.name === 'SIJA');
    usersData.push({
      username: '98765', // NIP
      password: teacherPassword,
      role: 'teacher',
      name: 'Pak Budi (Guru SIJA)',
      major_id: sijaMajor.id
    });

    const tkrMajor = majors.find(m => m.name === 'TKR');
    usersData.push({
      username: '98766', // NIP
      password: teacherPassword,
      role: 'teacher',
      name: 'Bu Siti (Guru TKR)',
      major_id: tkrMajor.id
    });

    const sija10_1 = await Class.findOne({ where: { name: '10 SIJA 1' } });
    usersData.push({
      username: '12345', // NIS
      password: studentPassword,
      role: 'student',
      name: 'Andi Saputra',
      class_id: sija10_1.id
    });

    const sija10_2 = await Class.findOne({ where: { name: '10 SIJA 2' } });
    usersData.push({
      username: '12346', // NIS
      password: studentPassword,
      role: 'student',
      name: 'Budi Hartono',
      class_id: sija10_2.id
    });
    
    const tkr12_1 = await Class.findOne({ where: { name: '12 TKR 1' } });
    usersData.push({
      username: '12347', // NIS
      password: studentPassword,
      role: 'student',
      name: 'Citra Kirana',
      class_id: tkr12_1.id
    });

    await User.bulkCreate(usersData);
    console.log('Users seeded.');

    console.log('==========================================');
    console.log('SEEDING COMPLETE');
    console.log('==========================================');
    console.log('Akun Admin:   username: admin, password: admin123');
    console.log('Akun Guru:    username: 98765, password: teacher123');
    console.log('Akun Siswa:   username: 12345, password: student123');
    console.log('==========================================');

    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
