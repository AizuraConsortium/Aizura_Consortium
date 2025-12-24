import sharedPreset from '../shared/styles/tailwind.preset.js';

export default {
  presets: [sharedPreset],
  content: [
    '/tmp/cc-agent/61496421/project/client/index.html',
    '/tmp/cc-agent/61496421/project/client/**/*.{js,ts,jsx,tsx}',
    '/tmp/cc-agent/61496421/project/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
