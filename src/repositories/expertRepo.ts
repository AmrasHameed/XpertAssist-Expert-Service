import Expert from '../entities/expert';
import { RegisterExpert, ExpertInterface, UpdateExpertRequest } from '../utilities/interface';

export default class ExpertRepository {
  findByEmail = async (email: string): Promise<ExpertInterface | null> => {
    try {
      const expertData = await Expert.findOne({ email });
      return expertData;
    } catch (error) {
      console.error('Error in findByEmail:', (error as Error).message);
      return null;
    }
  };

  find = async () => {
    try {
      const services = await Expert.find()
      return services;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  }; 

  saveExpert = async (expertData: RegisterExpert): Promise<{ message: string }> => {
    const newUser = new Expert({
      name: expertData.name,
      email: expertData.email,
      mobile: expertData.mobile,
      service: expertData.service,
      password: expertData.password,
      expertImage: expertData.expertImage,
    });

    try {
      await newUser.save();
      console.log('Expert saved into the database.');
      return { message: 'ExpertCreated' }; 
    } catch (error) {
      console.error('Error saving expert:', (error as Error).message);
      return { message: (error as Error).message }; 
    }
  };

  findById = async (id: string) => {
    try {
      const expert = await Expert.findById(id);
      return expert;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  findByIdAndUpdate = async (
    id: string,
    updates: Partial<UpdateExpertRequest> ,
  ): Promise<{ message: string }> => {
    try {
      const updatedExpert = await Expert.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!updatedExpert) {
        console.log('Expert not found.');
        return { message: 'Expert not found.' };
      }
      console.log('Expert updated successfully.');
      return { message: 'ExpertUpdated' };
    } catch (error) {
      console.error('Error updating user:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };
}
