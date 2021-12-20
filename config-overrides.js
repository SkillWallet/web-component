/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const { alias } = require('react-app-rewire-alias');

module.exports = {
  webpack: (configuration) => {
    configuration.entry = './src/index.tsx';
    configuration.output.filename = 'index.js';
    configuration.plugins = configuration.plugins.filter(
      (p) => p.constructor.name !== 'ManifestPlugin' && p.constructor.name !== 'MiniCssExtractPlugin'
    );
    delete configuration.optimization;
    const modifiedConfig = alias({
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      '@mui/material': path.resolve('./node_modules/@mui/material'),
      '@mui/icons-material': path.resolve('./node_modules/@mui/icons-material'),
      '@emotion/react': path.resolve('./node_modules/@emotion/react'),
      '@emotion/styled': path.resolve('./node_modules/@emotion/styled'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
    })(configuration);
    return modifiedConfig;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.contentBase = './src';
      return config;
    };
  },
};
