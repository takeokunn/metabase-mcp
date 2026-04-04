import { z } from 'zod';

export const ListPulsesInputSchema = z.object({
  archived: z.boolean().optional().describe('Filter by archived status'),
});
export type ListPulsesInput = z.infer<typeof ListPulsesInputSchema>;

export const GetPulseInputSchema = z.object({
  id: z.number().describe('The pulse ID'),
});
export type GetPulseInput = z.infer<typeof GetPulseInputSchema>;

export const CreatePulseInputSchema = z.object({
  name: z.string().describe('Name of the pulse'),
  cards: z.array(z.record(z.unknown())).describe('Cards to include in the pulse'),
  channels: z.array(z.record(z.unknown())).describe('Channels to send the pulse to'),
  collection_id: z.number().nullable().optional().describe('Collection ID for the pulse'),
  skip_if_empty: z.boolean().optional().describe('Skip sending if result is empty'),
});
export type CreatePulseInput = z.infer<typeof CreatePulseInputSchema>;

export const UpdatePulseInputSchema = z.object({
  id: z.number().describe('The pulse ID'),
  name: z.string().optional().describe('Name of the pulse'),
  cards: z.array(z.record(z.unknown())).optional().describe('Cards to include'),
  channels: z.array(z.record(z.unknown())).optional().describe('Channels to send to'),
  skip_if_empty: z.boolean().optional().describe('Skip sending if result is empty'),
  archived: z.boolean().optional().describe('Archive the pulse'),
});
export type UpdatePulseInput = z.infer<typeof UpdatePulseInputSchema>;

export const DeletePulseInputSchema = z.object({
  id: z.number().describe('The pulse ID'),
});
export type DeletePulseInput = z.infer<typeof DeletePulseInputSchema>;

export const TestPulseInputSchema = z.object({
  pulse: z.record(z.unknown()).describe('Pulse object to test'),
});
export type TestPulseInput = z.infer<typeof TestPulseInputSchema>;

export const GetPulseFormInputInputSchema = z.object({});
export type GetPulseFormInputInput = z.infer<typeof GetPulseFormInputInputSchema>;

export const GetPulsePreviewCardInputSchema = z.object({
  id: z.number().describe('The card ID to preview'),
});
export type GetPulsePreviewCardInput = z.infer<typeof GetPulsePreviewCardInputSchema>;

export const UnsubscribePulseInputSchema = z.object({
  id: z.number().describe('The pulse ID'),
});
export type UnsubscribePulseInput = z.infer<typeof UnsubscribePulseInputSchema>;

export const UnsubscribePulseEmailInputSchema = z.object({
  hash: z.string().describe('Unsubscribe hash'),
  email: z.string().describe('Email address to unsubscribe'),
  pulse_id: z.number().describe('Pulse ID'),
});
export type UnsubscribePulseEmailInput = z.infer<typeof UnsubscribePulseEmailInputSchema>;

export const UndoPulseUnsubscribeInputSchema = z.object({
  hash: z.string().describe('Unsubscribe hash'),
  email: z.string().describe('Email address to unsubscribe'),
  pulse_id: z.number().describe('Pulse ID'),
});
export type UndoPulseUnsubscribeInput = z.infer<typeof UndoPulseUnsubscribeInputSchema>;
