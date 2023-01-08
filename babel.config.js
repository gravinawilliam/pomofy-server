module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@application': './src/application',
          '@contracts': './src/domain/contracts',
          '@errors': './src/domain/entities/errors',
          '@external': './src/external',
          '@factories': './src/main/factories',
          '@infrastructure': './src/infrastructure',
          '@main': './src/main',
          '@models': './src/domain/entities/models',
          '@presentation': './src/presentation',
          '@shared': './src/shared',
          '@use-cases': './src/domain/use-cases',
          '@value-objects': './src/domain/entities/value-objects',
          '@domain': './src/domain'
        }
      }
    ],
    'babel-plugin-transform-typescript-metadata',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false
      }
    ]
  ],
  ignore: ['**/*.spec.ts']
};
