import { z } from 'zod';

const articleSchema = z.object({
  id: z.string().min(1),
  rank: z.number().min(0),
  url: z.string().url(),
  title: z.string().min(1),
  score: z.number(),
  by: z.string().min(1),
  age: z.string().min(1),
});

export default articleSchema;
