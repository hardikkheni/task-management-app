const mongoose = require('mongoose');

module.exports = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  defaultOptions: {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
};
