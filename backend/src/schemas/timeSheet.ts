import { array, number, object, string, type z } from 'zod';
import { dateRangeQuerySchema } from './helpers';

export const createTimeSheetInputSchema = object({
  name: string().min(3).max(30),
  defaultPricePerHour: number().gt(0).optional(),
  defaultHours: number().gt(0).lte(24).optional()
});

export type CreateTimeSheetInput = z.infer<typeof createTimeSheetInputSchema>;

export const getTimeSheetInputSchema = object({
  id: string().uuid(),
  dates: dateRangeQuerySchema.optional()
});

export type GetTimeSheetInput = z.infer<typeof getTimeSheetInputSchema>;

const timeSheetHours = number().gt(0).lte(24);

export const setTimeSheetEntryInputSchema = object({
  date: string().date(),
  hours: timeSheetHours,
  timeSheetId: string().uuid(),
  pricePerHour: number().gt(0)
});

export type SetTimeSheetEntryInput = z.infer<typeof setTimeSheetEntryInputSchema>;

export const setTimeSheetEntryBulkInputSchema = object({
  timeSheetId: string().uuid(),
  entries: array(
    object({
      date: string().date(),
      hours: timeSheetHours,
      pricePerHour: number().gt(0)
    })
  )
});

export type SetTimeSheetEntryBulkInput = z.infer<typeof setTimeSheetEntryBulkInputSchema>;

export const deleteTimeSheetEntryInputSchema = object({
  date: string().date(),
  timeSheetId: string().uuid()
});

export type DeleteTimeSheetEntryInput = z.infer<typeof deleteTimeSheetEntryInputSchema>;

export const deleteTimeSheetEntryBulkInputSchema = object({
  timeSheetId: string().uuid(),
  dates: array(string().date())
});

export type DeleteTimeSheetEntryBulkInput = z.infer<typeof deleteTimeSheetEntryBulkInputSchema>;
