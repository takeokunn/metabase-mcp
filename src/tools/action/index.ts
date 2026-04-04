import type { ToolDefinition } from '@src/tools/registry';
import { createActionDefinition } from './create-action';
import { createActionPublicLinkDefinition } from './create-action-public-link';
import { deleteActionDefinition } from './delete-action';
import { deleteActionPublicLinkDefinition } from './delete-action-public-link';
import { executeActionDefinition } from './execute-action';
import { getActionDefinition } from './get-action';
import { getActionExecuteFormDefinition } from './get-action-execute-form';
import { listActionsDefinition } from './list-actions';
import { listPublicActionsDefinition } from './list-public-actions';
import { updateActionDefinition } from './update-action';

export const actionTools: ToolDefinition<unknown>[] = [
  listActionsDefinition,
  getActionDefinition,
  createActionDefinition,
  updateActionDefinition,
  deleteActionDefinition,
  getActionExecuteFormDefinition,
  executeActionDefinition,
  createActionPublicLinkDefinition,
  deleteActionPublicLinkDefinition,
  listPublicActionsDefinition,
];
