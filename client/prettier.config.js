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
      options: { tabWidth: 4 },
    },
    {
      files: '*.d.ts',
      options: { tabWidth: 2 },
    },
  ],
};
