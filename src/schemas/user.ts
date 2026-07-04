import { z } from 'zod';
import { PaginationParamsSchema } from './common';

// User status enum
export const UserStatusSchema = z.enum(['active', 'deactivated']).describe('User account status');

// List users input schema
export const ListUsersInputSchema = PaginationParamsSchema.extend({
  status: UserStatusSchema.optional().describe('Filter by user status'),
  query: z.string().optional().describe('Search query for user name/email'),
  group_id: z.number().int().positive().optional().describe('Filter by permission group ID'),
});

// Get user input schema
export const GetUserInputSchema = z.object({
  id: z.number().int().positive().describe('User ID'),
});

// Create user input schema
export const CreateUserInputSchema = z.object({
  first_name: z.string().min(1).describe('User first name'),
  last_name: z.string().min(1).describe('User last name'),
  email: z.string().email().describe('User email address'),
  password: z.string().min(8).optional().describe('Initial password (optional if using SSO)'),
  group_ids: z.array(z.number().int().positive()).optional().describe('Permission group IDs'),
  login_attributes: z.record(z.string(), z.string()).optional().describe('Custom login attributes'),
});

// Update user input schema
export const UpdateUserInputSchema = z.object({
  id: z.number().int().positive().describe('User ID'),
  first_name: z.string().min(1).optional().describe('User first name'),
  last_name: z.string().min(1).optional().describe('User last name'),
  email: z.string().email().optional().describe('User email address'),
  is_superuser: z.boolean().optional().describe('Superuser status'),
  is_group_manager: z.boolean().optional().describe('Group manager status'),
  login_attributes: z.record(z.string(), z.string()).optional().describe('Custom login attributes'),
  locale: z.string().optional().describe('User locale preference'),
});

// Delete user input schema
export const DeleteUserInputSchema = z.object({
  id: z.number().int().positive().describe('User ID'),
});

// Get current user input schema (empty, no params needed)
export const GetCurrentUserInputSchema = z.object({});

// Update user password input schema
export const UpdateUserPasswordInputSchema = z.object({
  id: z.number().int().positive().describe('User ID'),
  password: z.string().min(8).describe('New password'),
  old_password: z.string().optional().describe('Current password (required for non-admins)'),
});

// Reactivate user input schema
export const ReactivateUserInputSchema = z.object({
  id: z.number().int().positive().describe('User ID to reactivate'),
});

// Send invite input schema
export const SendInviteInputSchema = z.object({
  id: z.number().int().positive().describe('User ID to send invite to'),
});

// Get user memberships input schema
export const GetUserMembershipsParamsSchema = z.object({
  id: z.number().int().positive().describe('User ID to get group memberships for'),
});

// Dismiss user modal input schema
export const DismissUserModalInputSchema = z.object({
  id: z.number().describe('User ID'),
  modal: z.string().describe('Modal type to dismiss'),
});

// Create user password reset URL input schema
export const CreateUserPasswordResetUrlInputSchema = z.object({
  id: z.number().int().positive().describe('User ID to generate a password reset URL for'),
});

// Inferred types
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;
export type GetUserInput = z.infer<typeof GetUserInputSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;
export type GetCurrentUserInput = z.infer<typeof GetCurrentUserInputSchema>;
export type UpdateUserPasswordInput = z.infer<typeof UpdateUserPasswordInputSchema>;
export type ReactivateUserInput = z.infer<typeof ReactivateUserInputSchema>;
export type SendInviteInput = z.infer<typeof SendInviteInputSchema>;
export type GetUserMembershipsParams = z.infer<typeof GetUserMembershipsParamsSchema>;
export type DismissUserModalInput = z.infer<typeof DismissUserModalInputSchema>;
export type CreateUserPasswordResetUrlInput = z.infer<typeof CreateUserPasswordResetUrlInputSchema>;
