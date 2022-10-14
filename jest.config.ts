import type {Config} from 'jest';

const config: Config = {
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
      "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node" ,
    testTimeout: 10000,
    coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
    coveragePathIgnorePatterns : ["main.ts"]
  };

export default config;
