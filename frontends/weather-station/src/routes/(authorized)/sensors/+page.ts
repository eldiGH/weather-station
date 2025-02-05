import { trpcAuthed } from "@shared/ui/api";
import type { PageLoad } from "./$types";
import { createArrayApiCache } from "@shared/ui/stores";
import { writable } from "svelte/store";

export const load: PageLoad = async ({ fetch }) => {
  const { data } = await trpcAuthed(fetch).sensor.getSensorTemplates.query();

  const sensorTemplates = writable(data);

  return { sensorTemplates: { subscribe: sensorTemplates.subscribe } };
};
