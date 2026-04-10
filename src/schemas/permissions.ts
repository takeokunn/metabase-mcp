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
      z.string(),
      z.record(
        z.string(),
        z.object({
          data: z
            .object({
              native: DataPermissionValueSchema.optional().describe('Native query permission'),
              schemas: z
                .union([
                  DataPermissionValueSchema,
                  z.record(
                    z.string(),
                    z.union([
                      DataPermissionValueSchema,
                      z.record(z.string(), DataPermissionValueSchema),
                    ]),
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
    .record(z.string(), z.record(z.string(), CollectionPermissionValueSchema))
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

// Membership schemas
export const MembershipIdSchema = z.number().int().positive().describe('Membership ID');
export const GroupIdSchema = z.number().int().positive().describe('Permission group ID');

export const ListMembershipsInputSchema = z.object({});

export const AddMembershipInputSchema = z.object({
  user_id: z.number().int().positive().describe('ID of the user to add'),
  group_id: z.number().int().positive().describe('ID of the permission group'),
});

export const UpdateMembershipInputSchema = z.object({
  id: z.number().int().positive().describe('Membership ID'),
  is_group_manager: z.boolean().optional().describe('Whether the user is a group manager'),
});

export const DeleteMembershipParamsSchema = z.object({
  id: z.number().int().positive().describe('Membership ID'),
});

export const ClearMembershipsParamsSchema = z.object({
  group_id: z.number().int().positive().describe('ID of the permission group to clear'),
});

export const GetDbPermissionsParamsSchema = z.object({
  db_id: z.number().int().positive().describe('Database ID'),
});

export const GetGroupPermissionsParamsSchema = z.object({
  group_id: z.number().int().positive().describe('ID of the permission group'),
});

// Membership type exports
export type ListMembershipsInput = z.infer<typeof ListMembershipsInputSchema>;
export type AddMembershipInput = z.infer<typeof AddMembershipInputSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipInputSchema>;
export type DeleteMembershipParams = z.infer<typeof DeleteMembershipParamsSchema>;
export type ClearMembershipsParams = z.infer<typeof ClearMembershipsParamsSchema>;
export type GetDbPermissionsParams = z.infer<typeof GetDbPermissionsParamsSchema>;
export type GetGroupPermissionsParams = z.infer<typeof GetGroupPermissionsParamsSchema>;
