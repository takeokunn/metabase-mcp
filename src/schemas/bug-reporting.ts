import { z } from 'zod';

// No input schemas needed for bug-reporting endpoints (all GET with no params)
export const BugReportingPlaceholderSchema = z.object({}).describe('No input required');
export type BugReportingPlaceholder = z.infer<typeof BugReportingPlaceholderSchema>;
