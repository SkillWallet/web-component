module.exports = {
  webpack: (configuration) => {
    configuration.entry = './src/index.tsx';
    configuration.output.filename = 'index.js';
    configuration.plugins = configuration.plugins.filter(
      (p) => p.constructor.name !== 'ManifestPlugin' && p.constructor.name !== 'MiniCssExtractPlugin'
    );
    delete configuration.optimization;
    return configuration;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.contentBase = './src';
      return config;
    };
  },
};
