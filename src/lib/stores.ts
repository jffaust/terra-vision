import { writable } from 'svelte/store';
import { VizTypes, type View } from './types';

const defaultView: View = {
    id: 0,
    type: VizTypes.DefaultSpace,
    region: {
        left: 0,
        top: 0,
        width: 1,
        height: 1
    }
}
export const views = writable([defaultView]);