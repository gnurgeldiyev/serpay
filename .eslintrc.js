module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: ['plugin:vue/recommended'],
    // required to lint *.vue files
    plugins: ['eslint-plugin-nuxt'],
    // add your custom rules here
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
}
