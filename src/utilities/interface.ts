import { Document, ObjectId } from "mongoose";


export interface ExpertInterface extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    mobile: number;
    password: string;
    expertImage: string;  
    accountStatus: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterExpert {
    name:string;
    email:string;
    mobile:string;
    password:string;
    expertImage:string;
}