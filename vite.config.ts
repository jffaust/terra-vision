import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

const config: UserConfig = {
	plugins: [sveltekit(), glsl()],
	ssr: {
		noExternal: ['three', 'troika-three-text']
	}
};

export default config;
