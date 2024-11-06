import mongoose, { Schema } from 'mongoose';
import { ExpertInterface } from '../utilities/interface';

const ExpertSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    expertImage: {
      type: String,
    },
    accountStatus: {
      type: String,
      default: 'UnBlocked',
    },
    isVerified: {
      type: String,
      default: 'false',
    },
    status: {
      type: String,
      default: 'offline',
    },
    verificationDetails: {
      govIdType: { type: String },
      govIdNumber: { type: String },
      document: { type: String },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    earnings: [
      {
        jobId: {
          type: String,
          required: true,
        },
        earning: {
          type: Number,
          required: true,
        },
      },
    ],
    totalEarning: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


const expertModel = mongoose.model<ExpertInterface>('Expert', ExpertSchema);

export default expertModel;
