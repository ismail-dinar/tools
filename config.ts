export const PRETTIER_CONFIG = {
  tabWidth: 2,
  arrowParens: 'always',
  singleQuote: true,
  bracketSpacing: false,
  trailingComma: 'es5',
  semi: true,
  printWidth: 80,
};

export const LINT_STAGE_CONFIG = {
  '*.{ts,js,html,json,scss,md}': ['prettier --write'],
};
