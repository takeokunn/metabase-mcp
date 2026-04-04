import type { ToolDefinition } from '@src/tools/registry';
import { createPulseDefinition } from './create-pulse';
import { getPulseDefinition } from './get-pulse';
import { getPulseFormInputDefinition } from './get-pulse-form-input';
import { listPulsesDefinition } from './list-pulses';
import { testPulseDefinition } from './test-pulse';
import { undoPulseUnsubscribeDefinition } from './undo-pulse-unsubscribe';
import { unsubscribePulseDefinition } from './unsubscribe-pulse';
import { unsubscribePulseEmailDefinition } from './unsubscribe-pulse-email';
import { updatePulseDefinition } from './update-pulse';

export const pulseTools: ToolDefinition<unknown>[] = [
  listPulsesDefinition,
  getPulseDefinition,
  createPulseDefinition,
  updatePulseDefinition,
  testPulseDefinition,
  getPulseFormInputDefinition,
  unsubscribePulseDefinition,
  unsubscribePulseEmailDefinition,
  undoPulseUnsubscribeDefinition,
];
