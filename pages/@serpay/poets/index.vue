<template>
  <div>
    <div class="page_action">
      <div class="page_action_item">
        <el-button 
          icon="el-icon-circle-plus-outline" 
          plain
          @click="openAddFormDialog">Add New</el-button>
        <poet-form :visibility="addFormDialogVisibility" />
      </div>
    </div>
    <div class="page_body">
      <poet-list :data="poets" />
      <poet-form
        :type="'view'"
        :visibility="viewFormDialogVisibility"
        :title="'View Poet'" />
      <poet-form
        :type="'edit'"
        :visibility="editFormDialogVisibility"
        :title="'Edit Poet'" />
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
        return this.$store.getters['poet/all']
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
    methods: {
      openAddFormDialog() {
        this.$store.dispatch('poet/addFormDialogVisibility', true)
      }
    }
  }
</script>

<style scoped>

</style>