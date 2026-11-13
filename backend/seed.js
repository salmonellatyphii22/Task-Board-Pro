
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Workspace from './src/models/Workspace.js';
import Sprint from './src/models/Sprint.js';
import Task from './src/models/Task.js';
import ActivityLog from './src/models/ActivityLog.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing demo data
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Sprint.deleteMany({});
    await Task.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('Cleared existing database collections.');

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Create Indian demo users
    const admin = await User.create({
      name: 'Rohan Sharma',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin'
    });

    const manager = await User.create({
      name: 'Priya Verma',
      email: 'manager@example.com',
      passwordHash,
      role: 'manager'
    });

    const emp1 = await User.create({
      name: 'Aarav Gupta',
      email: 'employee1@example.com',
      passwordHash,
      role: 'employee'
    });

    const emp2 = await User.create({
      name: 'Ananya Singh',
      email: 'employee2@example.com',
      passwordHash,
      role: 'employee'
    });

    console.log('Created Indian demo users:');
    console.log(`Admin: ${admin.email}`);
    console.log(`Manager: ${manager.email}`);
    console.log(`Employee 1: ${emp1.email}`);
    console.log(`Employee 2: ${emp2.email}`);
    console.log('Demo password: Password123!');

    // 2. Create workspaces
    const ws1 = await Workspace.create({
      name: 'Technology & Development Team',
      description: 'Software development, backend engineering and API management',
      createdBy: admin._id,
      members: [admin._id, manager._id, emp1._id, emp2._id]
    });

    const ws2 = await Workspace.create({
      name: 'Business Operations Team',
      description: 'Accounting, finance, GST and business operations',
      createdBy: admin._id,
      members: [admin._id, manager._id, emp1._id, emp2._id]
    });

    const ws3 = await Workspace.create({
      name: 'Marketing & Design Team',
      description: 'Digital marketing, branding, UI design and campaigns',
      createdBy: admin._id,
      members: [admin._id, manager._id, emp2._id]
    });

    console.log('Created 3 Indian company workspaces.');

    // 3. Create sprints
    const now = new Date();
    const twoWeeksLater = new Date(
      now.getTime() + 14 * 24 * 60 * 60 * 1000
    );
    const fourWeeksLater = new Date(
      now.getTime() + 28 * 24 * 60 * 60 * 1000
    );

    const sprint1 = await Sprint.create({
      workspaceId: ws1._id,
      name: 'Sprint 1 - Core Development',
      startDate: now,
      endDate: twoWeeksLater,
      isActive: true
    });

    await Sprint.create({
      workspaceId: ws1._id,
      name: 'Sprint 2 - Testing & Integration',
      startDate: twoWeeksLater,
      endDate: fourWeeksLater,
      isActive: false
    });

    const sprintMobile = await Sprint.create({
      workspaceId: ws2._id,
      name: 'Sprint 1 - Business Operations',
      startDate: now,
      endDate: twoWeeksLater,
      isActive: true
    });

    console.log('Created sprints across workspaces.');

    // 4. Create realistic Indian workplace tasks
    const pastDueDate = new Date(
      now.getTime() - 2 * 24 * 60 * 60 * 1000
    );
    const futureDueDate = new Date(
      now.getTime() + 5 * 24 * 60 * 60 * 1000
    );

    const tasks = [
      // 8 tasks assigned to Aarav
      {
        title: 'Implement GST Database Validation',
        description: 'Develop and validate database fields for GST records and transactions.',
        priority: 'high',
        status: 'in_progress',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['GST', 'database'],
        comments: [{
          text: 'Initial database structure is ready.',
          author: manager._id,
          authorName: 'Priya Verma'
        }]
      },
      {
        title: 'Complete Employee Login & Access Management',
        description: 'Implement secure employee login and role-based access permissions.',
        priority: 'high',
        status: 'in_progress',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['security', 'authentication']
      },
      {
        title: 'Develop Monthly Attendance Management',
        description: 'Build employee attendance tracking and monthly attendance reports.',
        priority: 'high',
        status: 'review',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['HR', 'attendance']
      },
      {
        title: 'Prepare Monthly Financial Audit Report',
        description: 'Compile financial transactions and prepare the monthly audit report.',
        priority: 'medium',
        status: 'in_progress',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['finance', 'audit']
      },
      {
        title: 'Implement Real-Time Employee Notifications',
        description: 'Send live notifications when tasks are assigned or updated.',
        priority: 'medium',
        status: 'todo',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['notifications', 'realtime']
      },
      {
        title: 'Generate Monthly Business Performance Report',
        description: 'Prepare dashboard metrics for sales, expenses and completed tasks.',
        priority: 'high',
        status: 'todo',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['analytics', 'reporting']
      },
      {
        title: 'Configure Cloud Deployment Environment',
        description: 'Prepare the application environment for cloud hosting and deployment.',
        priority: 'low',
        status: 'todo',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['cloud', 'deployment']
      },
      {
        title: 'Validate Employee Workload and Task Limits',
        description: 'Check task assignment limits and employee workload distribution.',
        priority: 'medium',
        status: 'review',
        dueDate: futureDueDate,
        assignedTo: emp1._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['validation', 'workload']
      },

      // Tasks assigned to Ananya
      {
        title: 'Improve Mobile Dashboard Navigation',
        description: 'Improve responsive navigation and usability on mobile devices.',
        priority: 'medium',
        status: 'in_progress',
        dueDate: pastDueDate,
        assignedTo: emp2._id,
        sprintId: sprintMobile._id,
        workspaceId: ws2._id,
        createdBy: manager._id,
        labels: ['mobile', 'UI', 'overdue']
      },
      {
        title: 'Implement Team Discussion and Comments',
        description: 'Allow employees and managers to discuss tasks through comments.',
        priority: 'medium',
        status: 'done',
        dueDate: pastDueDate,
        assignedTo: emp2._id,
        sprintId: sprint1._id,
        workspaceId: ws1._id,
        createdBy: manager._id,
        labels: ['comments', 'completed']
      },
      {
        title: 'Design Company Dashboard UI Components',
        description: 'Create consistent dashboard components, layouts and visual styles.',
        priority: 'low',
        status: 'todo',
        dueDate: futureDueDate,
        assignedTo: emp2._id,
        sprintId: sprintMobile._id,
        workspaceId: ws2._id,
        createdBy: manager._id,
        labels: ['design', 'dashboard']
      }
    ];

    await Task.insertMany(tasks);

    console.log(`Created ${tasks.length} tasks across 3 workspaces.`);
    console.log('Aarav Gupta has 8 assigned active tasks.');

    // 5. Seed activity logs
    const workspaces = [ws1, ws2, ws3];

    for (const workspace of workspaces) {
      await ActivityLog.create({
        workspaceId: workspace._id,
        entityType: 'workspace',
        entityId: workspace._id,
        action: 'created',
        performedBy: admin._id,
        performedByName: admin.name,
        message: `Workspace '${workspace.name}' created by Admin '${admin.name}'`
      });
    }

    console.log('Seed activity logs created.');
    console.log('Seeding completed successfully!');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Seeding error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
