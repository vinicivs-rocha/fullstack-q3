import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(SurveyorModel, (faker) => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
}));
