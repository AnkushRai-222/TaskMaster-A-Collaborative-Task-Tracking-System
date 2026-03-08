const { Attachment } = require('../models');

exports.uploadAttachment = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        const file_url = `/uploads/${req.file.filename}`;
        const file_name = req.file.originalname;

        const attachment = await Attachment.create({
            file_url,
            file_name,
            taskId,
            userId: req.user.id
        });

        res.status(201).json(attachment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;

        const attachments = await Attachment.findAll({
            where: { taskId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(attachments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
