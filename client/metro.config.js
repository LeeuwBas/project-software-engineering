const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add SVG support via react-native-svg-transformer
const { transformer, resolver } = config;

transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
resolver.assetExts = resolver.assetExts.filter((ext) => ext !== 'svg');
resolver.sourceExts.push('svg');

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
