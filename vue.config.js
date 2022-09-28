// vue.config.js
module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  runtimeCompiler: true,
  publicPath: process.env.NODE_ENV === "production" ? "/vue/" : "/",
};
