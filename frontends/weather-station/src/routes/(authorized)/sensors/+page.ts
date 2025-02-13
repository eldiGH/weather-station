import { trpcAuthed } from "@shared/ui/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const { data: sensors } = await trpcAuthed(fetch).sensor.getSensors.query();

  return { sensors };
};
