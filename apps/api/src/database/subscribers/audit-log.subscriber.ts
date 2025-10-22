// // src/database/subscribers/audit-log.subscriber.ts
// import {
//   EventSubscriber,
//   EntitySubscriberInterface,
//   InsertEvent,
//   UpdateEvent,
//   RemoveEvent,
// } from 'typeorm';
// import { AuditLogEntryEntity } from '../entities/audit-log.entity';
// import { UserContext } from '../../common/context/user-context';
// import { OrganizationContext } from '../../common/context/organization-context';

// @EventSubscriber()
// export class AuditLogSubscriber implements EntitySubscriberInterface {
//   listenTo() {
//     return Object; // catch all entities
//   }

//   async afterInsert(event: InsertEvent<any>) {
//     // Prevent logging AuditLogEntry changes to avoid infinite loop
//     if (event.metadata.targetName === 'AuditLogEntryEntity') {
//       return;
//     }

//     const organizationId = this.getCurrentOrganizationId();
//     const userId = UserContext.getCurrentUserId();

//     await event.manager.getRepository(AuditLogEntryEntity).insert({
//       table_name: event.metadata.tableName,
//       row_id: String(event.entity.id),
//       operation: 'INSERT',
//       before: null,
//       after: event.entity,
//       userId,
//       organizationId,
//     });
//   }

//   async afterUpdate(event: UpdateEvent<any>) {
//     if (event.metadata.targetName === 'AuditLogEntryEntity') {
//       return;
//     }

//     const organizationId = this.getCurrentOrganizationId();
//     const userId = UserContext.getCurrentUserId();

//     await event.manager.getRepository(AuditLogEntryEntity).insert({
//       table_name: event.metadata.tableName,
//       row_id: String(event.entity?.id ?? event.databaseEntity?.id),
//       operation: 'UPDATE',
//       before: event.databaseEntity,
//       after: event.entity,
//       userId,
//       organizationId,
//     });
//   }

//   async afterRemove(event: RemoveEvent<any>) {
//     if (event.metadata.targetName === 'AuditLogEntryEntity') {
//       return;
//     }

//     const userId = UserContext.getCurrentUserId();

//     const organizationId = this.getCurrentOrganizationId();

//     await event.manager.getRepository(AuditLogEntryEntity).insert({
//       table_name: event.metadata.tableName,
//       row_id: String(event.entityId),
//       operation: 'DELETE',
//       before: event.entity,
//       after: null,
//       userId,
//       organizationId,
//     });
//   }

//   private getCurrentOrganizationId(): number | null {
//     return OrganizationContext.getCurrentOrganizationId();
//   }
// }

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
    return Object;
  }

  async afterInsert(event: InsertEvent<any>) {
    if (event.metadata.targetName === 'AuditLogEntryEntity') {
      return;
    }

    const rowId = this.getRowId(event.entity, event.metadata);
    if (!rowId) {
      return;
    }

    const organizationId = this.getCurrentOrganizationId();
    const userId = UserContext.getCurrentUserId();

    await event.manager.getRepository(AuditLogEntryEntity).insert({
      table_name: event.metadata.tableName,
      row_id: rowId,
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

    const entity = event.entity ?? event.databaseEntity;
    const rowId = this.getRowId(entity, event.metadata);
    if (!rowId) {
      return;
    }

    const organizationId = this.getCurrentOrganizationId();
    const userId = UserContext.getCurrentUserId();

    await event.manager.getRepository(AuditLogEntryEntity).insert({
      table_name: event.metadata.tableName,
      row_id: rowId,
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

    const rowId = this.getRowId(
      event.entity ?? event.databaseEntity,
      event.metadata
    );
    if (!rowId) {
      return;
    }

    const userId = UserContext.getCurrentUserId();
    const organizationId = this.getCurrentOrganizationId();

    await event.manager.getRepository(AuditLogEntryEntity).insert({
      table_name: event.metadata.tableName,
      row_id: rowId,
      operation: 'DELETE',
      before: event.entity,
      after: null,
      userId,
      organizationId,
    });
  }

  private getRowId(entity: any, metadata: any): string | null {
    if (!entity) {
      return null;
    }

    if (entity.id !== undefined && entity.id !== null) {
      return String(entity.id);
    }

    const primaryColumns = metadata.primaryColumns;
    if (!primaryColumns || primaryColumns.length === 0) {
      return null;
    }

    const primaryKeyParts: string[] = [];
    for (const column of primaryColumns) {
      const value = entity[column.propertyName];
      if (value !== undefined && value !== null) {
        primaryKeyParts.push(`${column.propertyName}:${value}`);
      }
    }

    return primaryKeyParts.length > 0 ? primaryKeyParts.join('|') : null;
  }

  private getCurrentOrganizationId(): number | null {
    return OrganizationContext.getCurrentOrganizationId();
  }
}
