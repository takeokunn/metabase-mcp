import type { ToolDefinition } from '@src/tools/registry';
import { submitProductFeedbackDefinition } from './submit-product-feedback';

/**
 * All product-feedback-related tool definitions
 */
export const productFeedbackTools: ToolDefinition<unknown>[] = [submitProductFeedbackDefinition];
