<template>
  <nuxt/>
</template>

<style>
html {
  font-family:  'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Avenir',
    Roboto, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
*:hover {
	cursor: default;
}
.page-enter-active, .page-leave-active {
  transition: opacity .3s ease;
}
.page-enter, .page-leave-active {
  opacity: 0
}
</style>