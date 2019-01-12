<template>
  <div>
    <div class="page_action">
      <div 
        v-if="poets && poets.length > 0"
        class="page_action_item">
        <el-select 
          v-model="poetId" 
          filterable 
          placeholder="View by Poet"
          @change="getPoemsOfPoet(poetId)">
          <el-option
            v-for="p in poets"
            :key="p.id"
            :label="p.fullname"
            :value="p.id" />
        </el-select>
      </div>
      <div class="page_action_item">
        <el-button 
          icon="el-icon-circle-plus-outline" 
          plain
          @click="openAddFormDialog">Add New</el-button>
        <poem-form :type="'add'" />
      </div>
    </div>
    <div class="page_body">
      <el-tabs 
        value="approved"
        @tab-click="handleTabClick">
        <el-tab-pane 
          label="Approved" 
          name="approved">
          <poem-list :data="poems" />
        </el-tab-pane>
        <el-tab-pane 
          label="Unapproved" 
          name="unapproved">
          <poem-list :data="unapprovedPoems" />
        </el-tab-pane>
      </el-tabs>
      
      <poem-form :type="'view'" />
      <poem-form :type="'edit'" />
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
        poetId: '',
        poems: [],
        unapprovedPoems: []
      }
    },
    computed: {
      poets() {
        return this.$store.getters['poet/getAll']
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
    beforeCreate() {
      this.$store.dispatch('poet/fetchAll')
    },
    methods: {
      async getPoemsOfPoet(poetId) {
        await this.$store.dispatch('poem/fetchAll', poetId)
        this.poems = this.$store.getters['poem/getAll']
      },
      async handleTabClick(tab) {
        if (tab.name === 'unapproved' && this.poetId !== '') {
          await this.$store.dispatch('poem/fetchAllUnapproved', this.poetId)
          this.unapprovedPoems = this.$store.getters['poem/getAllUnapproved']
        } else if (tab.name === 'approved' && this.poetId !== '') {
          await this.$store.dispatch('poem/fetchAll', this.poetId)
          this.poems = this.$store.getters['poem/getAll']
        }
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
.page_body {
  margin: 32px 0;
}
</style>