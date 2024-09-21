import auth from '../middleware/auth';
import ExpertRepository from '../repositories/expertRepo';
import bcrypt from '../services/bcrypt';
import { ExpertInterface } from '../utilities/interface';

const expertRepository = new ExpertRepository()

export default class RegisterUseCase {
  registerExpert = async (
    name: string,
    email: string,
    password: string,
    mobile: string,
    expertImage: string
  ) => {
    try {
      const expert = (await expertRepository.findByEmail(email)) as ExpertInterface;
      if (expert) {
        return { message: 'UserExist' };
      }
      const hashedPassword = await bcrypt.securePassword(password);
      const newUserData = {
        name,
        email,
        mobile,
        password: hashedPassword,
        expertImage,
      };
      const response = await expertRepository.saveExpert(newUserData);
      if (response.message === 'ExpertCreated') {
        const user = (await expertRepository.findByEmail(email)) as ExpertInterface;
        const token = await auth.createToken(user._id.toString(), '15m');
        const refreshToken = await auth.createToken(user._id.toString(), '7d');
        return {
          message: 'Success',
          name: user.name,
          token,
          _id: user._id,
          refreshToken,
          image: user.expertImage,
        };
      } else {
        return { message: 'UserNotCreated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}
