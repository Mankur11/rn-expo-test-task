import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from './client';

const bookingRequestSchema = z.object({
  prestations: z.array(z.string()),
  appointment: z.string(),
  address: z.string().min(1),
});

const bookingResponseSchema = z.object({
  success: z.boolean(),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;

async function createBooking(request: BookingRequest): Promise<BookingResponse> {
  const validated = bookingRequestSchema.parse(request);
  const { data } = await apiClient.post('/booking', validated);
  return bookingResponseSchema.parse(data);
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  });
}
