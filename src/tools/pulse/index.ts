import type { ToolDefinition } from '@src/tools/registry';
import { createPulseDefinition } from './create-pulse';
import { deletePulseDefinition } from './delete-pulse';
import { getPulseDefinition } from './get-pulse';
import { getPulseFormInputDefinition } from './get-pulse-form-input';
import { getPulsePreviewCardDefinition } from './get-pulse-preview-card';
import { listPulsesDefinition } from './list-pulses';
import { testPulseDefinition } from './test-pulse';
import { unsubscribePulseDefinition } from './unsubscribe-pulse';
import { updatePulseDefinition } from './update-pulse';

export const pulseTools: ToolDefinition<unknown>[] = [
  listPulsesDefinition,
  getPulseDefinition,
  createPulseDefinition,
  updatePulseDefinition,
  deletePulseDefinition,
  testPulseDefinition,
  getPulseFormInputDefinition,
  getPulsePreviewCardDefinition,
  unsubscribePulseDefinition,
];
