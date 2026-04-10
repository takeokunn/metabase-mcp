// Regression test: z.record(T) single-arg was broken in Zod v4 — valueType was
// undefined, causing MCP tools/list to crash. The fix is to use z.record(z.string(), T).
// This file ensures that a representative set of schemas containing z.record() fields can be serialised
// to JSON Schema without throwing.

import {
  ActionSchema,
  CreateActionInputSchema,
  ExecuteActionInputSchema,
  UpdateActionInputSchema,
} from '@src/schemas/action';
import {
  CreateCardInputSchema,
  ExecuteCardParamsSchema,
  ExecuteCardPivotParamsSchema,
  UpdateCardInputSchema,
} from '@src/schemas/card';
import {
  CreateChannelInputSchema,
  TestChannelInputSchema,
  UpdateChannelInputSchema,
} from '@src/schemas/channel';
import {
  DashcardSchema,
  ExecuteDashboardCardQueryInputSchema,
  ExecuteDashcardActionInputSchema,
  VisualizationSettingsSchema,
} from '@src/schemas/dashboard';
import { DatasetQuerySchema, ExecuteQueryInputSchema } from '@src/schemas/dataset';
import {
  CreateDashboardSubscriptionInputSchema,
  DashboardSubscriptionSchema,
  NotificationChannelSchema,
  SendAdhocNotificationInputSchema,
  UpdateDashboardSubscriptionInputSchema,
} from '@src/schemas/notification';
import {
  UpdateCollectionPermissionsInputSchema,
  UpdateDataPermissionsInputSchema,
} from '@src/schemas/permissions';
import {
  ExecutePublicActionSchema,
  ExecutePublicDashcardActionSchema,
  RunPublicCardPivotQuerySchema,
  RunPublicDashboardPivotQuerySchema,
  RunPublicDashcardQuerySchema,
} from '@src/schemas/public';
import {
  CreatePulseInputSchema,
  TestPulseInputSchema,
  UpdatePulseInputSchema,
} from '@src/schemas/pulse';
import { UpdateSearchWeightsInputSchema } from '@src/schemas/search';
import {
  CreateSegmentInputSchema,
  SegmentSchema,
  UpdateSegmentInputSchema,
} from '@src/schemas/segment';
import { CreateSetupInputSchema } from '@src/schemas/setup';
import { CreateUserInputSchema, UpdateUserInputSchema } from '@src/schemas/user';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('z.record() Zod v4 compatibility', () => {
  describe('action schemas', () => {
    it('ActionSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ActionSchema)).not.toThrow();
    });

    it('CreateActionInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateActionInputSchema)).not.toThrow();
    });

    it('UpdateActionInputSchema serialises to JSON Schema without throwing', () => {
      // UpdateActionInputSchema contains z.record(z.unknown()) — the single-arg form
      // that triggered the original crash.
      expect(() => z.toJSONSchema(UpdateActionInputSchema)).not.toThrow();
    });

    it('ExecuteActionInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecuteActionInputSchema)).not.toThrow();
    });
  });

  describe('dashboard schemas', () => {
    it('VisualizationSettingsSchema serialises to JSON Schema without throwing', () => {
      // VisualizationSettingsSchema is z.record(z.unknown()) — the single-arg form.
      expect(() => z.toJSONSchema(VisualizationSettingsSchema)).not.toThrow();
    });

    it('DashcardSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(DashcardSchema)).not.toThrow();
    });

    it('ExecuteDashboardCardQueryInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecuteDashboardCardQueryInputSchema)).not.toThrow();
    });

    it('ExecuteDashcardActionInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecuteDashcardActionInputSchema)).not.toThrow();
    });
  });

  describe('permissions schemas', () => {
    it('UpdateDataPermissionsInputSchema serialises to JSON Schema without throwing', () => {
      // Contains deeply-nested z.record() calls — the most complex case in the codebase.
      expect(() => z.toJSONSchema(UpdateDataPermissionsInputSchema)).not.toThrow();
    });

    it('UpdateCollectionPermissionsInputSchema serialises to JSON Schema without throwing', () => {
      // Contains z.record(z.record(z.string(), ...)) — nested records.
      expect(() => z.toJSONSchema(UpdateCollectionPermissionsInputSchema)).not.toThrow();
    });
  });

  describe('dataset schemas', () => {
    it('DatasetQuerySchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(DatasetQuerySchema)).not.toThrow();
    });

    it('ExecuteQueryInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecuteQueryInputSchema)).not.toThrow();
    });
  });

  describe('user schemas', () => {
    it('CreateUserInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateUserInputSchema)).not.toThrow();
    });

    it('UpdateUserInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdateUserInputSchema)).not.toThrow();
    });
  });

  describe('search schemas', () => {
    it('UpdateSearchWeightsInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdateSearchWeightsInputSchema)).not.toThrow();
    });
  });

  describe('card schemas', () => {
    it('CreateCardInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateCardInputSchema)).not.toThrow();
    });

    it('UpdateCardInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdateCardInputSchema)).not.toThrow();
    });

    it('ExecuteCardParamsSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecuteCardParamsSchema)).not.toThrow();
    });

    it('ExecuteCardPivotParamsSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecuteCardPivotParamsSchema)).not.toThrow();
    });
  });

  describe('notification schemas', () => {
    it('NotificationChannelSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(NotificationChannelSchema)).not.toThrow();
    });

    it('DashboardSubscriptionSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(DashboardSubscriptionSchema)).not.toThrow();
    });

    it('CreateDashboardSubscriptionInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateDashboardSubscriptionInputSchema)).not.toThrow();
    });

    it('UpdateDashboardSubscriptionInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdateDashboardSubscriptionInputSchema)).not.toThrow();
    });

    it('SendAdhocNotificationInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(SendAdhocNotificationInputSchema)).not.toThrow();
    });
  });

  describe('channel schemas', () => {
    it('CreateChannelInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateChannelInputSchema)).not.toThrow();
    });

    it('UpdateChannelInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdateChannelInputSchema)).not.toThrow();
    });

    it('TestChannelInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(TestChannelInputSchema)).not.toThrow();
    });
  });

  describe('public schemas', () => {
    it('ExecutePublicActionSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecutePublicActionSchema)).not.toThrow();
    });

    it('ExecutePublicDashcardActionSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(ExecutePublicDashcardActionSchema)).not.toThrow();
    });

    it('RunPublicCardPivotQuerySchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(RunPublicCardPivotQuerySchema)).not.toThrow();
    });

    it('RunPublicDashboardPivotQuerySchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(RunPublicDashboardPivotQuerySchema)).not.toThrow();
    });

    it('RunPublicDashcardQuerySchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(RunPublicDashcardQuerySchema)).not.toThrow();
    });
  });

  describe('pulse schemas', () => {
    it('CreatePulseInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreatePulseInputSchema)).not.toThrow();
    });

    it('UpdatePulseInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdatePulseInputSchema)).not.toThrow();
    });

    it('TestPulseInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(TestPulseInputSchema)).not.toThrow();
    });
  });

  describe('segment schemas', () => {
    it('SegmentSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(SegmentSchema)).not.toThrow();
    });

    it('CreateSegmentInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateSegmentInputSchema)).not.toThrow();
    });

    it('UpdateSegmentInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(UpdateSegmentInputSchema)).not.toThrow();
    });
  });

  describe('setup schemas', () => {
    it('CreateSetupInputSchema serialises to JSON Schema without throwing', () => {
      expect(() => z.toJSONSchema(CreateSetupInputSchema)).not.toThrow();
    });
  });
});
