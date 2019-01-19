<template>
  <div>
    <div class="page_action">
      <div 
        v-if="editor.role === 'admin'"
        class="page_action_item">
        <el-button 
          icon="el-icon-circle-plus-outline" 
          plain
          @click="openAddFormDialog">Add New</el-button>
        <poet-form />
      </div>
    </div>
    <div class="page_body">
      <poet-list :data="poets" />
      <poet-form :type="'view'" />
      <poet-form :type="'edit'" />
    </div>
  </div>
</template>

<script>
import PoetList from '@/components/Panel/PoetList'
import PoetForm from '@/components/Panel/PoetForm'

  export default {
    layout: 'panel',
    components: {
      'poet-list': PoetList,
      'poet-form': PoetForm
    },
    computed: {
      poets() {
        return this.$store.getters['poet/getAll']
      },
      editor() {
        return this.$store.getters['editor/getOne']
      },
      addFormDialogVisibility() {
        return this.$store.getters['poet/addFormDialogVisibility']
      },
      viewFormDialogVisibility() {
        return this.$store.getters['poet/viewFormDialogVisibility']
      },
      editFormDialogVisibility() {
        return this.$store.getters['poet/editFormDialogVisibility']
      }
    },
    beforeCreate() {
      this.$store.dispatch('poet/fetchAll')
    },
    methods: {
      openAddFormDialog() {
        this.$store.dispatch('poet/addFormDialogVisibility', true)
      }
    }
  }
</script>

<style scoped>

</style>