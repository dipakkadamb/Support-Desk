const sequelize = require('./models/index');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Message = require('./models/Message');
require('./models/associations');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced (force: true)');

        // Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'Agent'
        });
        console.log('Admin user created (admin@example.com / admin123)');

        // Create initial tickets
        const t1 = await Ticket.create({
            ticket_id: 'TCK-0001',
            subject: 'Login issue with new dashboard',
            customer_email: 'customer@test.com',
            status: 'Open',
            priority: 'High'
        });

        await Message.create({
            ticket_id: t1.id,
            body: "Hi support, I can't log in to my account since the update. Please help!",
            sender_type: 'Customer'
        });

        const t2 = await Ticket.create({
            ticket_id: 'TCK-0002',
            subject: 'Billing inquiry - invoice missing',
            customer_email: 'user@company.com',
            status: 'Pending',
            priority: 'Medium'
        });

        await Message.create({
            ticket_id: t2.id,
            body: "I haven't received the invoice for March. Can you please send it?",
            sender_type: 'Customer'
        });

        console.log('Seed tickets and messages created!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
