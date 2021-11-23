module.exports = {
  transpileDependencies: ["vuetify"],
  // devServer: {
  //   proxy: {
  //    "^/api": {
  //      "changeOrigin": true,
  //      "secure": true,
  //      "target": 'https://rateengine.ship.cars/',
  //      pathRewrite: { '^/api': '' },
  //      onProxyReq: proxyReq => {
  //         // Browers may send Origin headers even with same-origin
  //         // requests. To prevent CORS issues, we have to change
  //         // the Origin to match the target URL.
  //         if (proxyReq.getHeader('origin')) {
  //           proxyReq.setHeader('origin', 'https://rateengine.ship.cars/');
  //         }
  //         proxyReq.setHeader('origin', 'https://rateengine.ship.cars/');
  //         // proxyReq.setHeader('referer', 'https://rateengine.ship.cars/');
  //         // proxyReq.setHeader('host', 'https://rateengine.ship.cars/');
  //         proxyReq.setHeader('content-type', 'application/json');
  //         proxyReq.setHeader('accept', 'application/json');
  //       }
  //     }
  //   }
  // },
};
