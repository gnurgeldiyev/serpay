<template>
  <el-container>
    <el-header class="pheader">
      <panel-header />
    </el-header> 
    <el-main>
      <el-row :gutter="16">
        <el-col :span="4">
          <panel-menu />
        </el-col>
        <el-col :span="20">
          <nuxt />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import PanelHeader from '@/components/Navigation/PanelHeader';
import PanelMenu from '@/components/Navigation/PanelMenu';

export default {
  middleware: ['checkAuth', 'validateToken'],
  head() {
    return {
      meta: [{ name: 'robots', content: 'noindex nofollow' }]
    }
  },
  components: {
    'panel-header': PanelHeader,
    'panel-menu': PanelMenu,
  }
}
</script>

<style>
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