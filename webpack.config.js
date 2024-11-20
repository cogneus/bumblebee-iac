/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: {
    authorizer: './packages/auth/src/handlers/authorizer.ts',
    error: './packages/api/src/handlers/error.ts',
    'add-template': './packages/api/src/handlers/add-template.ts',
    'get-template': './packages/api/src/handlers/get-template.ts',
    'update-template': './packages/api/src/handlers/update-template.ts',
    'remove-template': './packages/api/src/handlers/remove-template.ts',
    'query-template': './packages/api/src/handlers/query-template.ts',
    'template-versions': './packages/api/src/handlers/template-versions.ts',
  },
  externals: [
    nodeExternals({
      modulesDir: path.join(__dirname, 'node_modules'),
      allowlist: [
        'bumblebee-common',
        'bumblebee-services',
        'bumblebee-auth',
        'uuid',
        'lodash.pick',
        'jwt-decode',
        'jsonwebtoken',
        'tslib',
        'source-map-support/register',
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: [
          [
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, '/**/__mocks__'),
            path.resolve(__dirname, '/**/__tests__'),
          ],
        ],
      },
    ],
  },
}
