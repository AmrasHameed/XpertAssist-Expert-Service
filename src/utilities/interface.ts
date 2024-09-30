import { Document, ObjectId } from "mongoose";


export interface ExpertInterface extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    mobile: number;
    service: string;
    password: string;
    expertImage: string;  
    accountStatus: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateExpertRequest {
    id: string;
    name?: string;
    mobile?: number;
    expertImage?: File | null;
    password?: string | null;
  }

export interface RegisterExpert {
    name:string;
    email:string;
    mobile:string;
    service:string;
    password:string;
    expertImage:string;
}