import { z } from 'zod';

// Permission group schemas
export const ListPermissionGroupsInputSchema = z.object({});

export const GetPermissionGroupInputSchema = z.object({
  id: z.number().int().positive().describe('Permission group ID'),
});

export const CreatePermissionGroupInputSchema = z.object({
  name: z.string().min(1).describe('Permission group name'),
});

export const UpdatePermissionGroupInputSchema = z.object({
  id: z.number().int().positive().describe('Permission group ID'),
  name: z.string().min(1).describe('New permission group name'),
});

export const DeletePermissionGroupInputSchema = z.object({
  id: z.number().int().positive().describe('Permission group ID'),
});

// Data permissions
export const DataPermissionValueSchema = z
  .enum(['all', 'none', 'unrestricted', 'impersonated', 'legacy-no-self-service', 'block'])
  .describe('Data permission level');

export const GetDataPermissionsInputSchema = z.object({});

export const UpdateDataPermissionsInputSchema = z.object({
  revision: z.number().int().describe('Current permissions revision number'),
  groups: z
    .record(
      z.record(
        z.object({
          data: z
            .object({
              native: DataPermissionValueSchema.optional().describe('Native query permission'),
              schemas: z
                .union([
                  DataPermissionValueSchema,
                  z.record(
                    z.union([DataPermissionValueSchema, z.record(DataPermissionValueSchema)]),
                  ),
                ])
                .optional()
                .describe('Schema-level permissions'),
            })
            .optional(),
        }),
      ),
    )
    .describe('Permission groups mapping: group_id -> database_id -> permissions'),
});

// Collection permissions
export const CollectionPermissionValueSchema = z
  .enum(['read', 'write', 'none'])
  .describe('Collection permission level');

export const GetCollectionPermissionsInputSchema = z.object({});

export const UpdateCollectionPermissionsInputSchema = z.object({
  revision: z.number().int().describe('Current permissions revision number'),
  groups: z
    .record(z.record(CollectionPermissionValueSchema))
    .describe('Permission groups mapping: group_id -> collection_id -> permission'),
});

// Type exports
export type ListPermissionGroupsInput = z.infer<typeof ListPermissionGroupsInputSchema>;
export type GetPermissionGroupInput = z.infer<typeof GetPermissionGroupInputSchema>;
export type CreatePermissionGroupInput = z.infer<typeof CreatePermissionGroupInputSchema>;
export type UpdatePermissionGroupInput = z.infer<typeof UpdatePermissionGroupInputSchema>;
export type DeletePermissionGroupInput = z.infer<typeof DeletePermissionGroupInputSchema>;
export type GetDataPermissionsInput = z.infer<typeof GetDataPermissionsInputSchema>;
export type UpdateDataPermissionsInput = z.infer<typeof UpdateDataPermissionsInputSchema>;
export type GetCollectionPermissionsInput = z.infer<typeof GetCollectionPermissionsInputSchema>;
export type UpdateCollectionPermissionsInput = z.infer<
  typeof UpdateCollectionPermissionsInputSchema
>;
