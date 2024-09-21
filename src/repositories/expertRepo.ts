import Expert from '../entities/expert';
import { RegisterExpert, ExpertInterface } from '../utilities/interface';

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

  saveExpert = async (expertData: RegisterExpert): Promise<{ message: string }> => {
    const newUser = new Expert({
      name: expertData.name,
      email: expertData.email,
      mobile: expertData.mobile,
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
}
