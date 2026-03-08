let io;

const initSocket = (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Clients will join a room based on their user ID to receive targeted notifications
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their notification room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

// Helper function to send notification to a specific user
const notifyUser = (userId, eventName, data) => {
    if (io) {
        io.to(userId.toString()).emit(eventName, data);
    }
};

module.exports = {
    initSocket,
    getIo,
    notifyUser
};
