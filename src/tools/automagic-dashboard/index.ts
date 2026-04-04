import type { ToolDefinition } from '@src/tools/registry';
import { getXrayDatabaseCandidatesDefinition } from './get-xray-database-candidates';
import { getXrayEntityDefinition } from './get-xray-entity';
import { getXrayEntityCellDefinition } from './get-xray-entity-cell';
import { getXrayEntityCellCompareDefinition } from './get-xray-entity-cell-compare';
import { getXrayEntityCellRuleDefinition } from './get-xray-entity-cell-rule';
import { getXrayEntityCellRuleCompareDefinition } from './get-xray-entity-cell-rule-compare';
import { getXrayEntityCompareDefinition } from './get-xray-entity-compare';
import { getXrayEntityQueryMetadataDefinition } from './get-xray-entity-query-metadata';
import { getXrayEntityRuleDefinition } from './get-xray-entity-rule';
import { getXrayEntityRuleCompareDefinition } from './get-xray-entity-rule-compare';
import { getXrayModelIndexDefinition } from './get-xray-model-index';

export const automagicDashboardTools: ToolDefinition<unknown>[] = [
  getXrayEntityDefinition,
  getXrayDatabaseCandidatesDefinition,
  getXrayEntityCellDefinition,
  getXrayEntityCellCompareDefinition,
  getXrayEntityCellRuleDefinition,
  getXrayEntityCellRuleCompareDefinition,
  getXrayEntityCompareDefinition,
  getXrayEntityQueryMetadataDefinition,
  getXrayEntityRuleDefinition,
  getXrayEntityRuleCompareDefinition,
  getXrayModelIndexDefinition,
];
