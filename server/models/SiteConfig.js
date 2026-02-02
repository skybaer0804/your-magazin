import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      default: 'YOUR MAGAZINE',
      trim: true,
    },
    logoText: {
      type: String,
      default: 'M',
      maxlength: 2,
    },
    menus: [
      {
        title: {
          type: String,
          required: true,
          maxlength: 6,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// 단일 설정 문서만 존재하도록 보장하기 위한 헬퍼 (옵션)
export default mongoose.model('SiteConfig', siteConfigSchema);
