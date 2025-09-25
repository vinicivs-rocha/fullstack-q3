import { setSeederFactory } from 'typeorm-extension';
import { ProblemModel } from 'src/invoices/abstractions/models/problem.model';

export default setSeederFactory(ProblemModel, (faker) => {
  return {
    label: faker.lorem.words(2),
  };
});
