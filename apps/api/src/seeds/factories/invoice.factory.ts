import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';
import { setSeederFactory } from 'typeorm-extension';
import { InvoiceStatus } from '@fullstack-q3/contracts';

export default setSeederFactory(
  InvoiceModel,
  (faker) =>
    ({
      status: faker.helpers.arrayElement<InvoiceStatus>([
        'PENDENTE',
        'APROVADA',
        'REPROVADA',
      ]),
      observation: faker.lorem.sentence(),
      price: parseFloat(faker.finance.amount({ min: 100, max: 2000, dec: 2 })),
      duration: parseFloat(faker.finance.amount({ min: 0.5, max: 8, dec: 2 })),
      createdAt: faker.date.recent(),
    }) as InvoiceModel,
);
