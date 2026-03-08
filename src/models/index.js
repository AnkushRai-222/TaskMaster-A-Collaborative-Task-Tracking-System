const User = require('./User');
const Team = require('./Team');
const TeamMember = require('./TeamMember');
const Task = require('./Task');
const Comment = require('./Comment');
const Attachment = require('./Attachment');

// Define Relationships

// User - Team (Many-to-Many through TeamMember)
User.belongsToMany(Team, { through: TeamMember, foreignKey: 'userId', as: 'teams' });
Team.belongsToMany(User, { through: TeamMember, foreignKey: 'teamId', as: 'members' });

// TeamMember associations (useful for explicit queries)
User.hasMany(TeamMember, { foreignKey: 'userId' });
TeamMember.belongsTo(User, { foreignKey: 'userId' });
Team.hasMany(TeamMember, { foreignKey: 'teamId' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId' });

// Team - Task (One-to-Many)
Team.hasMany(Task, { foreignKey: 'teamId', as: 'tasks' });
Task.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

// User - Task (Created By, Assigned To)
User.hasMany(Task, { foreignKey: 'createdById', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

User.hasMany(Task, { foreignKey: 'assignedToId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

// Task - Comment (One-to-Many)
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// User - Comment (One-to-Many)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Task - Attachment (One-to-Many)
Task.hasMany(Attachment, { foreignKey: 'taskId', as: 'attachments' });
Attachment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// User - Attachment (One-to-Many)
User.hasMany(Attachment, { foreignKey: 'userId', as: 'attachments' });
Attachment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Team,
    TeamMember,
    Task,
    Comment,
    Attachment
};
