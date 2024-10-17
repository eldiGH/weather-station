import { authedProcedure, router } from '..';
import {
  createTimeSheetInputSchema,
  deleteTimeSheetInputSchema,
  editTimeSheetInputSchema,
  getTimeSheetInputSchema,
  setTimeSheetEntryForMonthInputSchema,
  setTimeSheetEntryInputSchema
} from '../../schemas/timeSheet';
import { TimeSheetServiceTRPC } from '../services';

export const timeSheetRouter = router({
  createTimeSheet: authedProcedure
    .input(createTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetServiceTRPC.createTimeSheet(input, ctx.user)),

  editTimeSheet: authedProcedure
    .input(editTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetServiceTRPC.editTimeSheet(input, ctx.user)),

  getTimeSheet: authedProcedure
    .input(getTimeSheetInputSchema)
    .query(({ input, ctx }) => TimeSheetServiceTRPC.getTimeSheet(input, ctx.user)),

  getTimeSheets: authedProcedure.query(({ ctx }) =>
    TimeSheetServiceTRPC.getTimeSheetsForUser(ctx.user)
  ),

  deleteTimeSheet: authedProcedure
    .input(deleteTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetServiceTRPC.deleteTimeSheet(input, ctx.user)),

  setTimeSheetEntry: authedProcedure
    .input(setTimeSheetEntryInputSchema)
    .mutation(({ input, ctx }) => TimeSheetServiceTRPC.setTimeSheetEntry(input, ctx.user)),

  setTimeSheetEntryForMonth: authedProcedure
    .input(setTimeSheetEntryForMonthInputSchema)
    .mutation(({ input, ctx }) => TimeSheetServiceTRPC.setTimeSheetEntryForMonth(input, ctx.user))
});
