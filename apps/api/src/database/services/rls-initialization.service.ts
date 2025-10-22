// apps/api/src/database/services/rls-initialization.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

//------------------------------------------------------------

@Injectable()
export class RlsInitializationService implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleInit() {
    await this.initializeRls();
  }

  private async initializeRls(): Promise<void> {
    try {
      console.log('🔐 Checking RLS configuration...');

      const isRlsEnabled = await this.checkRlsEnabled();

      if (!isRlsEnabled) {
        console.log(
          '🔧 RLS not configured. Enabling RLS and creating policies...'
        );
        await this.enableRls();
        await this.createPolicies();
        console.log('✅ RLS enabled and policies created successfully!');
      } else {
        console.log('✅ RLS already configured and enabled');
      }
    } catch (error) {
      console.error('❌ Error initializing RLS:', error);
    }
  }

  private async checkRlsEnabled(): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_class
        WHERE relname = 'sales_channels'
        AND relrowsecurity = true
      ) as rls_enabled;
    `);

    return result[0]?.rls_enabled || false;
  }

  private async enableRls(): Promise<void> {
    const tables = [
      'users',
      'organizations',
      'user_organizations',
      'sales_channels',
      'countries',
      'date_ranges',
      'prices',
      'price_date_ranges',
      'price_sales_channels',
      'media',
      'offer_inclusions',
      'offer_exclusions',
      'esim_offers',
      'esim_offer_inclusions',
      'esim_offer_exclusions',
      'esim_offer_images',
      'esim_offer_countries',
      'esim_offer_sales_channels',
      'esim_offer_prices',
      'user_invitations',
      'audit_logs',
    ];

    for (const table of tables) {
      await this.dataSource.query(
        `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
      );
    }
  }

  private async createPolicies(): Promise<void> {
    await this.dataSource.query(`
      -- Drop existing policies if any
      DO $$ 
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT schemaname, tablename, policyname 
                  FROM pg_policies 
                  WHERE schemaname = 'public') 
        LOOP
          EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
        END LOOP;
      END $$;

      -- Organization-scoped tables
      CREATE POLICY "org_access_sales_channels"
        ON sales_channels FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_countries"
        ON countries FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_date_ranges"
        ON date_ranges FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_prices"
        ON prices FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_media"
        ON media FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_esim_offers"
        ON esim_offers FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_offer_inclusions"
        ON offer_inclusions FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_offer_exclusions"
        ON offer_exclusions FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      CREATE POLICY "org_access_user_invitations"
        ON user_invitations FOR ALL
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      -- Users table
      CREATE POLICY "user_access_users"
        ON users FOR ALL
        USING (
          id::text = current_setting('app.current_user_id', true)
          OR id IN (
            SELECT "userId" FROM user_organizations
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      -- Organizations table
      CREATE POLICY "user_access_organizations"
        ON organizations FOR ALL
        USING (
          id::text = current_setting('app.current_organization_id', true)
          OR id IN (
            SELECT "organizationId" FROM user_organizations
            WHERE "userId"::text = current_setting('app.current_user_id', true)
          )
        );

      -- User organizations junction
      CREATE POLICY "user_access_user_organizations"
        ON user_organizations FOR ALL
        USING (
          "userId"::text = current_setting('app.current_user_id', true)
          OR "organizationId"::text = current_setting('app.current_organization_id', true)
        );

      -- Audit logs (read-only for users)
      CREATE POLICY "org_access_audit_logs"
        ON audit_logs FOR SELECT
        USING ("organizationId"::text = current_setting('app.current_organization_id', true));

      -- Junction tables
      CREATE POLICY "org_access_price_date_ranges"
        ON price_date_ranges FOR ALL
        USING (
          "priceId" IN (
            SELECT id FROM prices 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_price_sales_channels"
        ON price_sales_channels FOR ALL
        USING (
          "priceId" IN (
            SELECT id FROM prices 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_esim_offer_inclusions"
        ON esim_offer_inclusions FOR ALL
        USING (
          "offerId" IN (
            SELECT id FROM esim_offers 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_esim_offer_exclusions"
        ON esim_offer_exclusions FOR ALL
        USING (
          "offerId" IN (
            SELECT id FROM esim_offers 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_esim_offer_images"
        ON esim_offer_images FOR ALL
        USING (
          "offerId" IN (
            SELECT id FROM esim_offers 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_esim_offer_countries"
        ON esim_offer_countries FOR ALL
        USING (
          "offerId" IN (
            SELECT id FROM esim_offers 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_esim_offer_sales_channels"
        ON esim_offer_sales_channels FOR ALL
        USING (
          "offerId" IN (
            SELECT id FROM esim_offers 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );

      CREATE POLICY "org_access_esim_offer_prices"
        ON esim_offer_prices FOR ALL
        USING (
          "offerId" IN (
            SELECT id FROM esim_offers 
            WHERE "organizationId"::text = current_setting('app.current_organization_id', true)
          )
        );
    `);
  }
}
