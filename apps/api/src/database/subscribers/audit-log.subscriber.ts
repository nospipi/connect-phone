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
import { OrganizationContext } from '../../common/context/organization-context';

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Object; // catch all entities
  }

  async afterInsert(event: InsertEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const user = await this.getActorId(event);
    const organizationId = this.getCurrentOrganizationId();
    const userId = UserContext.getCurrentUserId();

    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entity.id),
      operation: 'INSERT',
      before: null,
      after: event.entity,
      userId,
      organizationId,
    });
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const user = await this.getActorId(event);
    const organizationId = this.getCurrentOrganizationId();
    const userId = UserContext.getCurrentUserId();

    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entity?.id ?? event.databaseEntity?.id),
      operation: 'UPDATE',
      before: event.databaseEntity,
      after: event.entity,
      userId,
      organizationId,
    });
  }

  async afterRemove(event: RemoveEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const userId = UserContext.getCurrentUserId();

    const user = await this.getActorId(event);
    const organizationId = this.getCurrentOrganizationId();

    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entityId),
      operation: 'DELETE',
      before: event.entity,
      after: null,
      userId,
      organizationId,
    });
  }

  private async getActorId(event: any): Promise<number | null> {
    const userId = UserContext.getCurrentUserId();

    if (!userId) {
      return null;
    }

    // return event.manager.getRepository(User).findOne({
    //   where: { id: userId },
    // });

    //return id
    return userId;
  }

  private getCurrentOrganizationId(): number | null {
    return OrganizationContext.getCurrentOrganizationId();
  }
}
