/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const { alias } = require('react-app-rewire-alias');

module.exports = {
  webpack: (configuration) => {
    configuration.output.filename = 'index.js';

    const isBuilding = configuration.mode === 'production';
    if (isBuilding) {
      configuration.entry = './src/index.tsx';
      configuration.output.library = 'InitSwAuth';
      configuration.output.libraryTarget = 'commonjs';
      configuration.output.libraryExport = 'default';
    } else {
      configuration.entry = './src/dev.index.tsx';
    }

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
};
