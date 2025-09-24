import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(VehicleModel, (faker) => ({
  plate: faker.vehicle.vrm(),
  model: faker.vehicle.model(),
  brand: faker.vehicle.manufacturer(),
  year: faker.date
    .between({ from: '2010-01-01', to: '2024-01-01' })
    .getFullYear(),
  chassis: faker.string.alphanumeric(17).toUpperCase(),
  proprietary: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
  color: faker.color.human(),
  fuelType: faker.helpers.arrayElement([
    'GASOLINA',
    'ETANOL',
    'FLEX',
    'DIESEL',
    'ELETRICO',
    'HIBRIDO',
  ]),
}));
