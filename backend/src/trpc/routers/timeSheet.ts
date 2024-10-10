import { authedProcedure, router } from '..';
import { createTimeSheetInputSchema, getTimeSheetInputSchema } from '../../schemas/timeSheet';
import { TimeSheetServiceTRPC } from '../services';

export const timeSheetRouter = router({
  createTimeSheet: authedProcedure
    .input(createTimeSheetInputSchema)
    .mutation(({ input, ctx }) => TimeSheetServiceTRPC.createTimeSheet(input, ctx.user)),

  getTimeSheet: authedProcedure
    .input(getTimeSheetInputSchema)
    .query(({ input, ctx }) => TimeSheetServiceTRPC.getTimeSheet(input, ctx.user)),

  getTimeSheets: authedProcedure.query(({ ctx }) =>
    TimeSheetServiceTRPC.getTimeSheetsForUser(ctx.user)
  )
});
