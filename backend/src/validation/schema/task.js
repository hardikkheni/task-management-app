const Yup = require('yup');
const { TaskStatus } = require('../../constants/enum.constant');

module.exports = {
  createTaskSchema: Yup.object({
    title: Yup.string().required(),
    description: Yup.string().optional(),
    status: Yup.string().required().oneOf(Object.values(TaskStatus)),
  }),
  updateTaskSchema: Yup.object({
    status: Yup.string().required().oneOf(Object.values(TaskStatus)),
  }),
};
