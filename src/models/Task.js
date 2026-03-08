const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'completed'),
        defaultValue: 'open',
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Task;
