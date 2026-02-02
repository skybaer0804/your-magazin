import mongoose from 'mongoose';

const magazineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    images: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videos: [
      {
        filename: String,
        url: String,
        videoType: {
          type: String,
          enum: ['upload', 'embed'],
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['lifestyle', 'tech', 'travel', 'food', 'fashion', 'other'],
      default: 'other',
    },
    tags: [String],
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

magazineSchema.index({ author: 1 });
magazineSchema.index({ category: 1 });
magazineSchema.index({ publishedAt: -1 });

export default mongoose.model('Magazine', magazineSchema);
