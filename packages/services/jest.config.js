const ignorePaths = ['dist', 'node_modules']
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  coveragePathIgnorePatterns: ignorePaths,
  testPathIgnorePatterns: ignorePaths,
  modulePathIgnorePatterns: ignorePaths,
  setupFiles: [],
}
