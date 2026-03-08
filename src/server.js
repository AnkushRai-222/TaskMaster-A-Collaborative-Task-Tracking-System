const http = require('http');
const app = require('./app');
const sequelize = require('./config/db');
const { initSocket } = require('./services/socketService');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Define relations and sync database
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Import models and relationships
        require('./models');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await syncDatabase();
});
