/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["prettier"],
  extends: [
    "vuetify",
    "@vue/eslint-config-typescript",
    "./.eslintrc-auto-import.json",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    camelcase: "off",
    eqeqeq: "off",
  },
};
