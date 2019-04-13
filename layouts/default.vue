<template>
  <div>
    <app-header :brand="brand" />
    <section class="container">
      <nuxt />
    </section>
    <app-footer />
  </div>
</template>
<script>
import AppHeader from '@/components/Navigation/AppHeader'
import AppFooter from '@/components/Navigation/AppFooter'

export default {
	components: {
		'app-header': AppHeader,
		'app-footer': AppFooter
	},
	data() {
		return {
			brand: {
				title: 'Serpaý',
				subtitle: 'Goşgular Çemeni'
			}
		}
	}
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Avenir',
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
@font-face {
	font-family: 'Inria Serif';
  font-display: auto;
	src: local('Inria Serif'),	url('../assets/font/InriaSerif-Regular.eot'),
    url('../assets/font/InriaSerif-Regular.eot?#iefix') format('embedded-opentype'),
    url('../assets/font/InriaSerif-Regular.woff2') format('woff2'),
    url('../assets/font/InriaSerif-Regular.woff') format('woff'),
    url('../assets/font/InriaSerif-Regular.svg') format('svg');
	font-weight: 400;
	font-style: normal;
}
@font-face {
  font-family: 'Inria Serif';
  font-display: auto;
  src: local('Inria Serif'),	url('../assets/font/InriaSerif-Bold.eot'),
    url('../assets/font/InriaSerif-Bold.eot?#iefix') format('embedded-opentype'),
    url('../assets/font/InriaSerif-Bold.woff2') format('woff2'),
    url('../assets/font/InriaSerif-Bold.woff') format('woff'),
    url('../assets/font/InriaSerif-Bold.svg') format('svg');
	font-weight: 700;
	font-style: normal;
}
@media (max-width: 480px) {
  .container {
    min-height: 100vh;
    width: 100vw;
    padding: 16px;
  }
  .title {
    color: #080808;
    font-size: 1.2em;
    font-weight: 500;
    font-family: Georgia, serif;
    line-height: 1;
    display: inline-block;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .container {
    min-height: 100vh;
    width: 100vw;
    padding: 16px 24px;
  }
  .title {
    color: #080808;
    font-size: 1.2em;
    font-weight: 500;
    font-family: Georgia, serif;
    line-height: 1;
    display: inline-block;
  }
}
@media (min-width: 768px) and (max-width: 1087px) {
  .container {
    min-height: 100vh;
    width: 100vw;
    padding: 32px;
  }
  .title {
    color: #080808;
    font-size: 1.4em;
    font-weight: 500;
    font-family: Georgia, serif;
    line-height: 1;
    display: inline-block;
  }
}
@media (min-width: 1088px) {
  .container {
    min-height: 100vh;
    width: 1024px;
    margin: 0 auto;
    padding: 32px 0;
  }
  .title {
    color: #080808;
    font-size: 1.4em;
    font-weight: 500;
    font-family: Georgia, serif;
    line-height: 1;
    display: inline-block;
  }
}
.page-enter-active, .page-leave-active {
  transition: opacity .3s ease;
}
.page-enter, .page-leave-active {
  opacity: 0
}
</style>
