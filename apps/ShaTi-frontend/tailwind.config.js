import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons';

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['mdi']),
    }),
  ],
};
