import { setTimeSheetEntryInputSchema } from 'backend/schemas';
import { string, z } from 'zod';

export const setTimeSheetEntryFormInputSchema = setTimeSheetEntryInputSchema.extend({
	date: string().date()
});

export type SetTimeSheetEntryFormInput = z.infer<typeof setTimeSheetEntryFormInputSchema>;
