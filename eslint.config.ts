import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

configureVueProject({
  scriptLangs: ['ts', 'tsx'],
})

export default defineConfigWithVueTs([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    files: ['src/**/__tests__/*'],
    ...pluginVitest.configs.recommended,
  },

  skipFormatting,

  {
    name: 'app/custom-rules',
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
])
