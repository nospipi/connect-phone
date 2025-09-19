// src/database/subscribers/audit-log.subscriber.ts
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { AuditLogEntryEntity } from '../entities/audit-log.entity';
import { UserContext } from '../../common/context/user-context';
import { OrganizationContext } from '../../common/context/organization-context';

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Object; // catch all entities
  }

  async afterInsert(event: InsertEvent<any>) {
    // Prevent logging AuditLogEntry changes to avoid infinite loop
    if (event.metadata.targetName === 'AuditLogEntryEntity') {
      return;
    }

    const organizationId = this.getCurrentOrganizationId();
    const userId = UserContext.getCurrentUserId();

    await event.manager.getRepository(AuditLogEntryEntity).insert({
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
    if (event.metadata.targetName === 'AuditLogEntryEntity') {
      return;
    }

    const organizationId = this.getCurrentOrganizationId();
    const userId = UserContext.getCurrentUserId();

    await event.manager.getRepository(AuditLogEntryEntity).insert({
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
    if (event.metadata.targetName === 'AuditLogEntryEntity') {
      return;
    }

    const userId = UserContext.getCurrentUserId();

    const organizationId = this.getCurrentOrganizationId();

    await event.manager.getRepository(AuditLogEntryEntity).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entityId),
      operation: 'DELETE',
      before: event.entity,
      after: null,
      userId,
      organizationId,
    });
  }

  private getCurrentOrganizationId(): number | null {
    return OrganizationContext.getCurrentOrganizationId();
  }
}
