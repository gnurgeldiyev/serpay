<template>
  <el-menu 
    mode="vertical"
    router
  >
    <el-menu-item
      index="/@serpay/poems"
    >
      <span>Poems</span>
    </el-menu-item>
    <el-menu-item
      index="/@serpay/poets"
    >
      <span>Poets</span>
    </el-menu-item>
    <el-menu-item
      v-if="editor.role === 'admin'"
      index="/@serpay/editors"
    >
      <span>Editors</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    computed: {
      editor() {
        return this.$store.getters['editor/getOne']
      }
    }
  }
</script>
