import { TransitionConfig } from 'svelte/transition';

export const delayDestroy = (_: Element, { duration = 400 }): TransitionConfig => ({ duration });
