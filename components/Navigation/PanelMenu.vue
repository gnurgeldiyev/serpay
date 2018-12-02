<template>
  <el-menu mode="vertical">
    <el-menu-item
      index="1"
      @click="goTo('/@serpay/poems')">
      <span>Poems</span>
    </el-menu-item>
    <el-menu-item
      index="2"
      @click="goTo('/@serpay/poets')">
      <span>Poets</span>
    </el-menu-item>
    <el-menu-item
      v-if="true"
      index="3"
      @click="goTo('/@serpay/editors')">
      <span>Editors</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    methods: {
      goTo(url) {
        this.$router.push(url);
      },
    }
  }
</script>
