const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TeamMember = sequelize.define('TeamMember', {
    role: {
        type: DataTypes.ENUM('member', 'admin'),
        defaultValue: 'member',
    }
}, {
    timestamps: true,
});

module.exports = TeamMember;
