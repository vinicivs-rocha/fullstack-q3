import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(SurveyorModel, (faker) => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
  gender: faker.helpers.arrayElement(['M', 'F']),
  phone: faker.phone.number(),
  license: faker.string.alphanumeric(10),
}));
