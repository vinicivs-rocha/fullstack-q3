import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';
import { setSeederFactory } from 'typeorm-extension';
import { FuelType } from '@fullstack-q3/contracts';

export default setSeederFactory(
  VehicleModel,
  (faker) =>
    ({
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
      fuelType: faker.helpers.arrayElement<FuelType>([
        'GASOLINA',
        'ETANOL',
        'FLEX',
        'DIESEL',
        'ELETRICO',
        'HIBRIDO',
      ]),
      mileage: faker.number.int({ min: 0, max: 100000 }),
    }) as VehicleModel,
);
