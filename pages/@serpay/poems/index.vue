<template>
  <div>
    <div class="page_action">
      <div class="page_action_item">
        <el-select 
          v-model="poet" 
          filterable 
          placeholder="View by Poet"
          @change="getPoemsOfPoet(poet)">
          <el-option
            v-for="p in poets"
            :key="p.url"
            :label="p.name"
            :value="p.url" />
        </el-select>
      </div>
      <div class="page_action_item">
        <el-button 
          icon="el-icon-circle-plus-outline" 
          plain
          @click="openAddFormDialog">Add New</el-button>
        <poem-form :visibility="addFormDialogVisibility" />
      </div>
    </div>
    <div class="page_body">
      <poem-list :data="poems" />
      <poem-form
        :type="'view'"
        :visibility="viewFormDialogVisibility"
        :title="'View Poem'" />
      <poem-form
        :type="'edit'"
        :visibility="editFormDialogVisibility"
        :title="'Edit Poem'" />
    </div>
  </div>
</template>

<script>
import PoemForm from '@/components/Panel/PoemForm'
import PoemList from '@/components/Panel/PoemList'

  export default {
    layout: 'panel',
    components: {
      'poem-form': PoemForm,
      'poem-list': PoemList
    },
    data() {
      return {
        poet: '',
        poems: []
      }
    },
    computed: {
      poets() {
        return this.$store.getters['poet/all']
      },
      addFormDialogVisibility() {
        return this.$store.getters['poem/addFormDialogVisibility']
      },
      viewFormDialogVisibility() {
        return this.$store.getters['poem/viewFormDialogVisibility']
      },
      editFormDialogVisibility() {
        return this.$store.getters['poem/editFormDialogVisibility']
      }
    },
    methods: {
      getPoemsOfPoet(poet) {
        console.log(poet)
        this.poems = this.$store.getters['poem/all']
      },
      openAddFormDialog() {
        this.$store.dispatch('poem/addFormDialogVisibility', true)
      }
    }
  }
</script>

<style scoped>
.page_action {
  display: flex;
}
.page_action_item:last-child {
  margin-left: 32px;
}
</style>