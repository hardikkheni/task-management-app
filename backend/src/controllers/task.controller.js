const { StatusCodes } = require('http-status-codes');
const { TaskModel } = require('../db/models');

async function findAll(req, res) {
  const search = req.query.search;
  const status = req.query.status;
  const query = [
    {
      $match: { userId: req.user._id },
    },
    ...(search
      ? [
          {
            $match: {
              $or: [
                {
                  title: { $regex: search, $options: 'i' },
                },
                {
                  description: { $regex: search, $options: 'i' },
                },
              ],
            },
          },
        ]
      : []),
    ...(status ? [{ $match: { status } }] : []),
  ];
  const tasks = await TaskModel.aggregate(query);
  return res.status(StatusCodes.OK).send({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Task fetched successfully.',
    data: tasks,
  });
}

async function insert(req, res) {
  const task = (await TaskModel.create({ ...req.body, userId: req.user._id })).toJSON();
  return res.status(StatusCodes.OK).send({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Task created successfully.',
    data: task,
  });
}

async function update(req, res) {
  const task = await TaskModel.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) throw new NotFoundException('Task not found.');
  task.status = req.body.status;
  await task.save();
  return res.status(StatusCodes.OK).send({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Task created successfully.',
    data: task,
  });
}

async function remove(req, res) {
  const task = await TaskModel.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) throw new NotFoundException('Task not found.');
  await task.deleteOne();
  return res.status(StatusCodes.OK).send({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Task deleted successfully.',
  });
}

module.exports = { findAll, insert, update, remove };
