export default {
   preset: "ts-jest",
   testEnvironment: "jsdom",
   setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
   moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
   },
   testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
   ],
   collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/main.tsx",
      "!src/setupTests.ts",
   ],
   coverageThreshold: {
      global: {
         branches: 70,
         functions: 70,
         lines: 70,
         statements: 70,
      },
   },
}
