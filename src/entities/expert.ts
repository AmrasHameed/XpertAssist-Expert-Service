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
  },
  {
    timestamps: true,
  }
);

const expertModel = mongoose.model<ExpertInterface>('Expert', ExpertSchema);

export default expertModel;
