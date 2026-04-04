import type { ToolDefinition } from '@src/tools/registry';
import { getPremiumTokenStatusDefinition } from './get-premium-token-status';
import { refreshPremiumTokenDefinition } from './refresh-premium-token';

export const premiumFeaturesTools: ToolDefinition<unknown>[] = [
  getPremiumTokenStatusDefinition,
  refreshPremiumTokenDefinition,
];
