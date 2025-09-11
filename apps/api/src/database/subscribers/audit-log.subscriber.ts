// src/database/subscribers/audit-log.subscriber.ts
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Injectable, Scope } from '@nestjs/common';
import { AuditLogEntry } from '../entities/audit-log.entity';
import { CurrentDbUserService } from '@/common/core/current-db-user.service';
import { User } from '../entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  constructor(private readonly currentDbUserService: CurrentDbUserService) {}

  listenTo() {
    return Object; // catch all entities
  }

  async afterInsert(event: InsertEvent<any>) {
    // Skip audit log entries to prevent infinite loops
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const actor = await this.getActor();
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
    // Skip audit log entries to prevent infinite loops
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const actor = await this.getActor();
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
    // Skip audit log entries to prevent infinite loops
    if (event.metadata.targetName === 'AuditLogEntry') {
      return;
    }

    const actor = await this.getActor();
    await event.manager.getRepository(AuditLogEntry).insert({
      table_name: event.metadata.tableName,
      row_id: String(event.entityId),
      operation: 'DELETE',
      before: event.entity,
      after: null,
      actor,
    });
  }

  private async getActor(): Promise<User | null> {
    try {
      return await this.currentDbUserService.getCurrentDbUser();
    } catch (error) {
      // Handle cases where there's no request context (migrations, background tasks, etc.)
      console.log('No user context available for audit log:', error.message);
      return null;
    }
  }
}
