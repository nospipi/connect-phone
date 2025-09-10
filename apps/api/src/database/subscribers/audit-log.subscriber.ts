// src/database/subscribers/audit-log.subscriber.ts
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { AuditLogEntry } from '../entities/audit-log.entity';
import { CurrentDbUserService } from '@/common/core/current-db-user.service';

//------------------------------------------------------------

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  private currentDbUserService: CurrentDbUserService;
  listenTo() {
    return Object; // catch all entities
  }

  async afterInsert(event: InsertEvent<any>) {
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entity.id),
      operation: 'INSERT',
      before: null,
      after: event.entity,
      actor_id: this.currentDbUserService.getCurrentDbUser(),
    });
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entity?.id ?? event.databaseEntity?.id),
      operation: 'UPDATE',
      before: event.databaseEntity,
      after: event.entity,
      actor_id: this.getActorId(event),
    });
  }

  async afterRemove(event: RemoveEvent<any>) {
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entityId),
      operation: 'DELETE',
      before: event.entity,
      after: null,
      actor_id: this.getActorId(event),
    });
  }

  private getActorId(event: any): string | null {
    // You need to integrate Nest request context to get the current user
    return null;
  }
}
