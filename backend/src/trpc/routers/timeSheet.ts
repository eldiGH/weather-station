import { authedProcedure, router } from '..';
import {
  addTimeSheetInputSchema,
  deleteTimeSheetEntryInputSchema,
  deleteTimeSheetInputSchema,
  editTimeSheetInputSchema,
  getTimeSheetEntriesWithCursorInputSchema,
  getTimeSheetForMonthInputSchema,
  setTimeSheetEntryForMonthInputSchema,
  setTimeSheetEntryInputSchema
} from '../../schemas/timeSheet';
import { TimeSheetService } from '../../services/TimeSheetService';

export const timeSheetRouter = router({
  createTimeSheet: authedProcedure
    .input(addTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.createTimeSheet(input, ctx.user)),

  editTimeSheet: authedProcedure
    .input(editTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.editTimeSheet(input, ctx.user)),

  getTimeSheetForMonth: authedProcedure
    .input(getTimeSheetForMonthInputSchema)
    .query(({ input, ctx }) => TimeSheetService.getTimeSheetForMonth(input, ctx.user)),

  getTimeSheets: authedProcedure.query(({ ctx }) =>
    TimeSheetService.getTimeSheetsForUser(ctx.user)
  ),

  deleteTimeSheet: authedProcedure
    .input(deleteTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.deleteTimeSheet(input, ctx.user)),

  setTimeSheetEntry: authedProcedure
    .input(setTimeSheetEntryInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.setTimeSheetEntry(input, ctx.user)),

  setTimeSheetEntryForMonth: authedProcedure
    .input(setTimeSheetEntryForMonthInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.setTimeSheetEntryForMonth(input, ctx.user)),

  getTimeSheetEntriesWithCursor: authedProcedure
    .input(getTimeSheetEntriesWithCursorInputSchema)
    .query(({ input, ctx }) => TimeSheetService.getTimeSheetEntriesWithCursor(input, ctx.user)),

  deleteTimeSheetEntry: authedProcedure
    .input(deleteTimeSheetEntryInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.deleteTimeSheetEntry(input, ctx.user)),

  addTimeSheetEntry: authedProcedure
    .input(setTimeSheetEntryInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.addTimeSheetEntry(input, ctx.user)),

  editTimeSheetEntry: authedProcedure
    .input(setTimeSheetEntryInputSchema)
    .mutation(({ input, ctx }) => TimeSheetService.editTimeSheetEntry(input, ctx.user))
});
