module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
    v2_dev: true,
    v2_meta: true,
  },
  serverDependenciesToBundle: [
    "react-markdown",
    "hast-util-to-jsx-runtime",
    "devlop",
    "comma-separated-tokens",
    "estree-util-is-identifier-name",
    "d3-scale",
    "d3-array",
    "internmap",
    "d3-interpolate",
    "d3-time",
    "d3-format",
    "d3-time-format",
    "d3-color",
    "d3-scale-chromatic",
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
