export default {
  plugins: [['@babel/plugin-syntax-import-attributes', { deprecatedAssertSyntax: true }]],
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
      },
    ],
  ],
};
