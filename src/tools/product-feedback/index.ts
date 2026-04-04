import type { ToolDefinition } from '@src/tools/registry';
import { submitProductFeedbackDefinition } from './submit-product-feedback';

export const productFeedbackTools: ToolDefinition<unknown>[] = [submitProductFeedbackDefinition];
