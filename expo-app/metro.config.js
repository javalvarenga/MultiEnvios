const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web platform support so Metro can bundle for platform=web.
// Without 'web' in platforms, requests for *.bundle?platform=web fail with
// a 404 served as JSON (wrong MIME type) instead of a JS bundle.
config.resolver.platforms = ['ios', 'android', 'web'];

// Ensure .web.* extensions are resolved before the generic ones so that
// web-specific overrides (e.g. react-native-web) take precedence.
config.resolver.sourceExts = config.resolver.sourceExts.flatMap((ext) => [
  `web.${ext}`,
  ext,
]);

// Prefer the browser/react-native-web entry points for web bundles.
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;