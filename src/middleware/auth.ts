import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default {
  createToken: async (
    clientId: ObjectId | string,
    expire: string
  ): Promise<string> => {
    try {
      const jwtSecretKey: string = process.env.USER_SECRET_KEY || 'Amras';
      const token = jwt.sign({ clientId }, jwtSecretKey, { expiresIn: expire });
      return token;
    } catch (error) {
      console.error(error);
      return 'Something went wrong';
    }
  },
};
