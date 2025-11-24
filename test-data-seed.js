const mongoose = require('mongoose');

const DB_URL = 'mongodb+srv://admin:admin@swp1-clouddb.jxujaha.mongodb.net/SWP1DB';

const sampleEmployees = [
  {
    employeeNumber: 'EMP001',
    userId: 'user001',
    fullName: 'John Doe',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'Male',
    nationality: 'American',
    nationalID: 'NAT001',
    maritalStatus: 'Single',
    phoneNumber: '+1-555-0101',
    email: 'john.doe@company.com',
    currentAddress: '123 Main St, New York, NY 10001',
    permanentAddress: '123 Main St, New York, NY 10001',
    dateOfHire: new Date('2020-01-15'),
    currentStatus: 'Active',
    contractType: 'Full-Time',
    probationEndDate: new Date('2020-07-15'),
    positionId: 'pos001',
    departmentId: 'dept001',
    directSupervisorPositionId: 'pos002',
    payGrade: 'Grade 5',
    biography: 'Senior software engineer with 5 years of experience.',
    profilePictureUrl: null,
  },
  {
    employeeNumber: 'EMP002',
    userId: 'user002',
    fullName: 'Jane Smith',
    dateOfBirth: new Date('1988-08-22'),
    gender: 'Female',
    nationality: 'American',
    nationalID: 'NAT002',
    maritalStatus: 'Married',
    phoneNumber: '+1-555-0102',
    email: 'jane.smith@company.com',
    currentAddress: '456 Oak Ave, Los Angeles, CA 90001',
    permanentAddress: '456 Oak Ave, Los Angeles, CA 90001',
    dateOfHire: new Date('2019-03-20'),
    currentStatus: 'Active',
    contractType: 'Full-Time',
    probationEndDate: new Date('2019-09-20'),
    positionId: 'pos002',
    departmentId: 'dept001',
    directSupervisorPositionId: null,
    payGrade: 'Grade 7',
    biography: 'Department manager with expertise in team leadership.',
    profilePictureUrl: null,
  },
  {
    employeeNumber: 'EMP003',
    userId: 'user003',
    fullName: 'Mike Johnson',
    dateOfBirth: new Date('1992-11-30'),
    gender: 'Male',
    nationality: 'American',
    nationalID: 'NAT003',
    maritalStatus: 'Single',
    phoneNumber: '+1-555-0103',
    email: 'mike.johnson@company.com',
    currentAddress: '789 Pine Rd, Chicago, IL 60601',
    permanentAddress: '789 Pine Rd, Chicago, IL 60601',
    dateOfHire: new Date('2021-06-01'),
    currentStatus: 'Active',
    contractType: 'Part-Time',
    probationEndDate: new Date('2021-12-01'),
    positionId: 'pos003',
    departmentId: 'dept001',
    directSupervisorPositionId: 'pos002',
    payGrade: 'Grade 4',
    biography: 'Junior developer passionate about web technologies.',
    profilePictureUrl: null,
  },
  {
    employeeNumber: 'EMP004',
    userId: 'user004',
    fullName: 'Sarah Williams',
    dateOfBirth: new Date('1985-02-14'),
    gender: 'Female',
    nationality: 'American',
    nationalID: 'NAT004',
    maritalStatus: 'Married',
    phoneNumber: '+1-555-0104',
    email: 'sarah.williams@company.com',
    currentAddress: '321 Elm St, Boston, MA 02101',
    permanentAddress: '321 Elm St, Boston, MA 02101',
    dateOfHire: new Date('2018-09-10'),
    currentStatus: 'Active',
    contractType: 'Full-Time',
    probationEndDate: new Date('2019-03-10'),
    positionId: 'pos004',
    departmentId: 'dept002',
    directSupervisorPositionId: null,
    payGrade: 'Grade 8',
    biography: 'HR Manager with 10+ years of experience.',
    profilePictureUrl: null,
  },
];

const sampleSystemRoles = [
  {
    employeeId: 'user001',
    systemRole: 'Department Employee',
    assignedBy: 'admin',
    assignedDate: new Date('2020-01-15'),
  },
  {
    employeeId: 'user002',
    systemRole: 'Department Manager',
    assignedBy: 'admin',
    assignedDate: new Date('2019-03-20'),
  },
  {
    employeeId: 'user003',
    systemRole: 'Department Employee',
    assignedBy: 'admin',
    assignedDate: new Date('2021-06-01'),
  },
  {
    employeeId: 'user004',
    systemRole: 'HR Manager',
    assignedBy: 'admin',
    assignedDate: new Date('2018-09-10'),
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URL);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;

    // Clear existing data
    console.log('\nClearing existing employee data...');
    await db.collection('employee_profiles').deleteMany({});
    await db.collection('employee_system_roles').deleteMany({});
    await db.collection('employee_profile_change_requests').deleteMany({});
    console.log('Cleared existing data.');

    // Insert sample employees
    console.log('\nInserting sample employees...');
    const result = await db.collection('employee_profiles').insertMany(sampleEmployees);
    console.log(`Inserted ${result.insertedCount} employees.`);

    // Insert system roles
    console.log('\nInserting system roles...');
    const rolesResult = await db.collection('employee_system_roles').insertMany(sampleSystemRoles);
    console.log(`Inserted ${rolesResult.insertedCount} system roles.`);

    // Verify insertion
    console.log('\n--- Database Summary ---');
    const empCount = await db.collection('employee_profiles').countDocuments();
    const rolesCount = await db.collection('employee_system_roles').countDocuments();
    console.log(`Employee Profiles: ${empCount}`);
    console.log(`System Roles: ${rolesCount}`);

    console.log('\n--- Sample Employee IDs for Testing ---');
    const employees = await db.collection('employee_profiles').find({}).toArray();
    employees.forEach(emp => {
      console.log(`${emp.fullName} (${emp.employeeNumber})`);
      console.log(`  - _id: ${emp._id}`);
      console.log(`  - userId: ${emp.userId}`);
      console.log(`  - Role: ${sampleSystemRoles.find(r => r.employeeId === emp.userId)?.systemRole}`);
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now test with Thunder Client using these employee IDs.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

seedDatabase();
