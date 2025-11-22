// svelte.config.js
import adapter from '@sveltejs/adapter-static'; // 1. Import the static adapter

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: 'index.html',
            prerender: true
        }),
        prerender: {
            entries: [
                '/',
                '/tools/',
                '/tools/json-explorer',
                '/tools/csv-json-converter',
                '/tools/column-to-csv'
            ] 
        },
        paths: {
			// base: process.argv.includes('dev') ? '' : '/dev-toolbox',
			base: '/dev-toolbox',
            relative: false
        }
    }
};

export default config;