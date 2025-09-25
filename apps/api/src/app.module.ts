import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { AuthModule } from './auth/auth.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CreateSurveyorTable1700000000000 } from './migrations/1700000000000-CreateSurveyorTable';
import { CreateVehicleTable1758718960773 } from './migrations/1758718960773-CreateVehicleTable';
import { CreateInvoiceTable1758718973738 } from './migrations/1758718973738-CreateInvoiceTable';
import { AddNameAndGenderToSurveyorTable1758718978616 } from './migrations/1758718978616-AddNameAndGenderToSurveyorTable';
import { AddColorFuelTypeAndMileageToVehicleTable1758719000000 } from './migrations/1758719000000-AddColorFuelTypeAndMileageToVehicleTable';
import { AddPhoneAndLicenseToSurveyorTable1758719001000 } from './migrations/1758719001000-AddPhoneAndLicenseToSurveyorTable';
import { CreateProblemTable1758810045611 } from './migrations/1758810045611-CreateProblemTable';
import { CreateInvoiceProblemTable1758810059425 } from './migrations/1758810059425-CreateInvoiceProblemTable';
import InvoiceFactory from './seeds/factories/invoice.factory';
import ProblemFactory from './seeds/factories/problem.factory';
import SurveyorFactory from './seeds/factories/surveyor.factory';
import VehicleFactory from './seeds/factories/vehicle.factory';
import { InvoiceSeeder } from './seeds/seeders/invoice.seeder';
import { SurveyorSeeder } from './seeds/seeders/surveyor.seeder';
import { SurveyorModule } from './surveyor/surveyor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        migrations: [
          CreateSurveyorTable1700000000000,
          CreateVehicleTable1758718960773,
          CreateInvoiceTable1758718973738,
          AddNameAndGenderToSurveyorTable1758718978616,
          AddColorFuelTypeAndMileageToVehicleTable1758719000000,
          AddPhoneAndLicenseToSurveyorTable1758719001000,
          CreateProblemTable1758810045611,
          CreateInvoiceProblemTable1758810059425,
        ],
        autoLoadEntities: true,
        migrationsRun: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    InvoicesModule,
    SurveyorModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    if (
      this.configService.get<string>('NODE_ENV') === 'development' &&
      this.dataSource.isInitialized
    ) {
      await runSeeders(this.dataSource, {
        seeds: [SurveyorSeeder, InvoiceSeeder],
        factories: [
          SurveyorFactory,
          VehicleFactory,
          InvoiceFactory,
          ProblemFactory,
        ],
      });
    }
  }
}
