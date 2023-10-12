const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { schema, validator } = require('../validation');
const { authGuard } = require('../middlewares');
const asyncHandler = require('../utils/helpers/async.helper');
const { authController, taskController } = require('../controllers');

const router = express.Router();
router.use(express.json({}));
router.use(express.urlencoded({ extended: true }));

/**
 * =======================================================
 * Auth routes
 * =======================================================
 */
router.post('/auth/register', validator(schema.auth.registerSchema), asyncHandler(authController.register));
router.post('/auth/login', validator(schema.auth.loginSchema), asyncHandler(authController.login));
router.get('/auth/profile', authGuard, asyncHandler(authController.profile));

router.get('/task', authGuard, asyncHandler(taskController.findAll));
router.post('/task', authGuard, validator(schema.task.createTaskSchema), asyncHandler(taskController.insert));
router.put('/task/:id', authGuard, validator(schema.task.updateTaskSchema), asyncHandler(taskController.update));
router.delete('/task/:id', authGuard, asyncHandler(taskController.remove));

router.use((err, _req, res, _next) => {
  if (res.headersSent) return;
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const hasErrors = err.errors && Object.keys(err.errors).length > 0;
  res.status(statusCode).json({
    status: false,
    statusCode,
    message: err.message || err.toString(),
    ...(hasErrors ? { errors: err.errors } : {}),
  });
});

module.exports = router;
