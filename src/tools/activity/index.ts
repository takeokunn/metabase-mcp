import type { ToolDefinition } from '@src/tools/registry';
import { addRecentActivityDefinition } from './add-recent-activity';
import { getMostRecentlyViewedDashboardDefinition } from './get-most-recently-viewed-dashboard';
import { listPopularItemsDefinition } from './list-popular-items';
import { listRecentViewsDefinition } from './list-recent-views';
import { listRecentsDefinition } from './list-recents';

export const activityTools: ToolDefinition<unknown>[] = [
  listRecentViewsDefinition,
  listRecentsDefinition,
  listPopularItemsDefinition,
  getMostRecentlyViewedDashboardDefinition,
  addRecentActivityDefinition,
];
