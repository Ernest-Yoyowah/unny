module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@theme": "./src/theme",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@store": "./src/store",
            "@hooks": "./src/hooks",
            "@api": "./src/api",
            "@types": "./src/types",
            "@utils": "./src/utils",
            "@data": "./src/data",
          },
        },
      ],
    ],
  };
};
