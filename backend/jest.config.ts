export default {
  preset: "ts-jest/presets/default-esm", // nutzt ts-jest mit ESM
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // erlaubt .ts-Importe ohne Endung
  },
};
