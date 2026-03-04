const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer.minifierConfig,
    compress: {
      ...config.transformer.minifierConfig?.compress,
      // drop_console: true,
    },
  },
};

module.exports = config;
