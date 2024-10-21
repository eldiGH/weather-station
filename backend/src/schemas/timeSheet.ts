import { array, date, number, object, string, type z } from 'zod';

export const addTimeSheetInputSchema = object({
  name: string().min(3).max(30),
  defaultPricePerHour: number().gt(0).optional(),
  defaultHours: number().gt(0).lte(24).optional()
});

export type AddTimeSheetInput = z.infer<typeof addTimeSheetInputSchema>;

export const editTimeSheetInputSchema = addTimeSheetInputSchema.extend({
  timeSheetId: string().uuid()
});

export type EditTimeSheetInput = z.infer<typeof editTimeSheetInputSchema>;

export const getTimeSheetForMonthInputSchema = object({
  timeSheetId: string().uuid(),
  date: string().date().or(date())
});

export type GetTimeSheetForMonthInput = z.infer<typeof getTimeSheetForMonthInputSchema>;

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

export const setTimeSheetEntryForMonthInputSchema = object({
  timeSheetId: string().uuid(),
  date: string().date().or(date()),
  entries: array(
    object({
      date: string().date(),
      hours: timeSheetHours,
      pricePerHour: number().gt(0)
    })
  )
});

export type SetTimeSheetEntryForMonthInput = z.infer<typeof setTimeSheetEntryForMonthInputSchema>;

export const deleteTimeSheetInputSchema = object({
  timeSheetId: string().uuid()
});

export type DeleteTimeSheetInput = z.infer<typeof deleteTimeSheetInputSchema>;

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

export const getTimeSheetEntriesWithCursorInputSchema = object({
  cursor: string().date().or(date().optional()).optional(),
  timeSheetId: string().uuid(),
  count: number().int().min(1).optional()
});

export type GetTimeSheetEntriesWithCursorInput = z.infer<
  typeof getTimeSheetEntriesWithCursorInputSchema
>;
