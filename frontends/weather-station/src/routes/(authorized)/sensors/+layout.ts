import { trpcAuthed } from "@shared/ui/api";
import { writable } from "svelte/store";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  const { data } = await trpcAuthed(fetch).sensor.getSensorTemplates.query();

  const sensorTemplates = writable(data);

  return { sensorTemplates: { subscribe: sensorTemplates.subscribe } };
};
