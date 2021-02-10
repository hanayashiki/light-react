/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-typescript',
    ['@snowpack/plugin-webpack', {}]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {

  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    open: "none",
    hmr: false
  },
  buildOptions: {
    /* ... */
  },
};
