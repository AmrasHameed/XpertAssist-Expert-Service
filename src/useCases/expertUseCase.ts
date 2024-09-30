import ExpertRepository from '../repositories/expertRepo';
import bcrypt from '../services/bcrypt';
import { ExpertInterface, UpdateExpertRequest } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';

const expertRepository = new ExpertRepository();

export default class ExpertUseCase {
  getExpert = async (id: string) => {
    try {
      const expert = await expertRepository.findById(id);
      if (expert) {
        return { message: 'success', ...expert };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updateExpert = async (id: string, updates: Partial<UpdateExpertRequest>) => {
    try {
      const user = (await expertRepository.findById(id)) as ExpertInterface;
      if (user) {
        const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          return { message: 'success' };
        } else {
          return { message: 'Expert Not Updated' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };


  changePassword = async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
        console.log(id, currentPassword, newPassword)
      const expert = await expertRepository.findById(id);
      if (!expert) {
        return { message: 'No User Found' };
      }
      const isMatch = await comparePassword(currentPassword, expert.password)
      if (!isMatch) {
        return { message: 'Entered current password is invalid' };
      }
      const hashedPass = await bcrypt.securePassword(newPassword)
      const updates = {password: hashedPass}
      const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          console.log('Password changed successfully')
          return { message: 'success' };
        } else {
          return { message: 'User Not Updated' };
        }
    } catch (error) {
      return { message: (error as Error).message };
    }
  }; 
}
