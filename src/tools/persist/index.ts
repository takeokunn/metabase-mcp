import type { ToolDefinition } from '@src/tools/registry';
import { disableModelPersistenceDefinition } from './disable-model-persistence';
import { enableModelPersistenceDefinition } from './enable-model-persistence';
import { getCardPersistedModelDefinition } from './get-card-persisted-model';
import { getPersistedModelDefinition } from './get-persisted-model';
import { listPersistedModelsDefinition } from './list-persisted-models';
import { persistCardDefinition } from './persist-card';
import { persistDatabaseModelsDefinition } from './persist-database-models';
import { refreshPersistedModelDefinition } from './refresh-persisted-model';
import { setPersistRefreshScheduleDefinition } from './set-persist-refresh-schedule';
import { unpersistCardDefinition } from './unpersist-card';

/**
 * All persist-related tool definitions
 */
export const persistTools: ToolDefinition<unknown>[] = [
  listPersistedModelsDefinition,
  getPersistedModelDefinition,
  getCardPersistedModelDefinition,
  persistCardDefinition,
  unpersistCardDefinition,
  refreshPersistedModelDefinition,
  enableModelPersistenceDefinition,
  disableModelPersistenceDefinition,
  setPersistRefreshScheduleDefinition,
  persistDatabaseModelsDefinition,
];
