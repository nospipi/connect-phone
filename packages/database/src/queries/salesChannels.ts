/* eslint-disable prettier/prettier */
import { desc, eq, sql, and, gt, asc } from "drizzle-orm";
import { SalesChannel } from "../schema";
import { db } from "../index";

//----------------------------------------------------------------------

// New paginated version
export const getSalesChannelsOfOrganizationPaginated = async (
  organizationId: number,
  cursor?: number,
  pageSize = 10
): Promise<SalesChannel[]> => {
  return await db.query.salesChannels.findMany({
    where: (salesChannels, { eq, gt, and }) =>
      and(
        eq(salesChannels.organizationId, organizationId),
        cursor ? gt(salesChannels.id, cursor) : undefined
      ),
    orderBy: (salesChannels, { asc }) => asc(salesChannels.id),
    limit: pageSize,
  });
};
