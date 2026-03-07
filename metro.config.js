const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer.minifierConfig,
    compress: {
      ...config.transformer.minifierConfig?.compress,
      drop_console: true,
      drop_debugger: true,
    },
  },
};

// Optimize asset handling
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'md');

module.exports = config;
