import { z } from 'zod';

export const ConfigureEmailInputSchema = z.object({
  host: z.string().describe('SMTP server hostname (e.g., "smtp.example.com")'),
  port: z.string().optional().describe('SMTP server port (e.g., "587")'),
  security: z
    .enum(['tls', 'ssl', 'starttls', 'none'])
    .optional()
    .describe('SMTP connection security type'),
  username: z.string().optional().describe('SMTP authentication username'),
  password: z.string().optional().describe('SMTP authentication password'),
  from_address: z.string().optional().describe('Email address used as the "From" field'),
  reply_to: z.string().optional().describe('Email address used as the "Reply-To" field'),
  from_name: z.string().optional().describe('Display name used in the "From" field'),
});
export type ConfigureEmailInput = z.infer<typeof ConfigureEmailInputSchema>;

export const TestEmailInputSchema = z.object({
  to: z.string().email().optional().describe('Recipient email address for the test email'),
});
export type TestEmailInput = z.infer<typeof TestEmailInputSchema>;
