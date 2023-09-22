module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineModel: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  plugins: ['eslint-plugin-vue', 'eslint-plugin-prettier', 'eslint-plugin-import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'vue/multi-word-component-names': 'off',

    'import/no-unresolved': ['off', { commonjs: true }],
    'import/no-extraneous-dependencies': 'error',
    'node/no-missing-require': 'off',
    'node/no-extraneous-import': 'off',

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: ['*.vue', '*.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
