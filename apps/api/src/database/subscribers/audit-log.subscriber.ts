// src/database/subscribers/audit-log.subscriber.ts
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { AuditLogEntry } from '../entities/audit-log.entity';
import { User } from '../entities/user.entity';
import { UserContext } from '../../common/context/user-context';

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Object; // catch all entities
  }

  async afterInsert(event: InsertEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const actor = await this.getActor(event);
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entity.id),
      operation: 'INSERT',
      before: null,
      after: event.entity,
      actor,
    });
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const actor = await this.getActor(event);
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entity?.id ?? event.databaseEntity?.id),
      operation: 'UPDATE',
      before: event.databaseEntity,
      after: event.entity,
      actor,
    });
  }

  async afterRemove(event: RemoveEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const actor = await this.getActor(event);
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entityId),
      operation: 'DELETE',
      before: event.entity,
      after: null,
      actor,
    });
  }

  private async getActor(event: any): Promise<User | null> {
    const userId = UserContext.getCurrentUserId();

    if (!userId) {
      return null;
    }

    return event.manager.getRepository(User).findOne({
      where: { id: userId },
    });
  }
}
