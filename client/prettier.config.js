module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  bracketSameLine: true,
  trailingComma: 'es5',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
  overrides: [
    {
      files: '*.ts',
      options: {
        tabWidth: 4,
        endOfLine: 'auto',
      },
    },
    {
      files: '*.d.ts',
      options: { tabWidth: 2 },
    },
    {
      files: '*.tsx',
      options: {
        endOfLine: 'auto',
      },
    },
  ],
};
