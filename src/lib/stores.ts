import { writable } from 'svelte/store';
import { VizTypes, type View } from './types';
import { GridView } from './ui/gridview';

export const gridView = writable(new GridView(VizTypes.SkyView));