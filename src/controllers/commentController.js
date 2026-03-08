const { Comment, User } = require('../models');
const { notifyUser } = require('../services/socketService');

exports.addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;

        const comment = await Comment.create({
            text,
            taskId,
            userId: req.user.id
        });

        // We could get task assignee and notify them
        // const { Task } = require('../models');
        // const task = await Task.findByPk(taskId);
        // if (task.assignedToId && task.assignedToId !== req.user.id) {
        //   notifyUser(task.assignedToId, 'new_comment', { taskId, comment });
        // }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await Comment.findAll({
            where: { taskId },
            include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
