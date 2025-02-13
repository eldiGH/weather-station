import { trpcAuthed } from "@shared/ui/api";
import { get, writable } from "svelte/store";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  const { data } = await trpcAuthed(fetch).sensor.getSensorTemplates.query();

  const sensorTemplates = writable(data);

  return {
    sensorTemplates: {
      subscribe: sensorTemplates.subscribe,

      getById: (id: number) =>
        get(sensorTemplates).find((template) => template.id === id),
    },
  };
};
