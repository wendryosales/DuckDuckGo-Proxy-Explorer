import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3001),
  DUCKDUCKGO_BASE_URL: z
    .string()
    .optional()
    .default('http://api.duckduckgo.com/'),
  DUCKDUCKGO_FORMAT: z.string().optional().default('json'),
});

export type Env = z.infer<typeof envSchema>;
