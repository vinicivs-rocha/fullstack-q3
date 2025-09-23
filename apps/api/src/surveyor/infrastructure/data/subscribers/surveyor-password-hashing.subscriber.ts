import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as argon2 from 'argon2';

@EventSubscriber()
export class SurveyorPasswordHashingSubscriber
  implements EntitySubscriberInterface<SurveyorModel>
{
  constructor(private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return SurveyorModel;
  }

  async beforeInsert(event: InsertEvent<SurveyorModel>) {
    event.entity.password = await argon2.hash(event.entity.password);
  }
}
