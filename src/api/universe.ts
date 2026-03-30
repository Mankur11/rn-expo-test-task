import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from './client';

const prestationSchema = z.object({
  reference: z.string(),
  title: z.string(),
  price: z.number(),
  duration: z.number(),
});

const categorySchema = z.object({
  reference: z.string(),
  title: z.string(),
  prestations: z.array(prestationSchema),
});

const universeSchema = z.object({
  reference: z.string(),
  title: z.string(),
  categories: z.array(categorySchema),
});

export type Prestation = z.infer<typeof prestationSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Universe = z.infer<typeof universeSchema>;

async function fetchUniverse(): Promise<Universe> {
  const { data } = await apiClient.get('/universe');
  return universeSchema.parse(data);
}

export function useUniverse() {
  return useQuery({
    queryKey: ['universe'],
    queryFn: fetchUniverse,
    staleTime: Infinity,
  });
}
