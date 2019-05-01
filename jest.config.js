module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupJestTests.js'],
  extraGlobals: ['Math']
}
