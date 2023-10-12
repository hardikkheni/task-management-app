const Yup = require('yup');

module.exports = {
  registerSchema: Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8).max(32),
  }),
  loginSchema: Yup.object({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8).max(32),
  }),
};
