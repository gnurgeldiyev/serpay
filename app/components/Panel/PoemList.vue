<template>
  <ul 
    v-if="data.length > 0"
    class="list">
    <li 
      v-for="(poem, i) in data"
      :key="i"
      class="list_item">
      {{ i+1 }}. {{ poem.title }}
      <span class="list_item_action">
        <el-button 
          v-if="poem.is_approved === false && editor.role === 'admin'"
          class="list_item_action_item approve"
          icon="el-icon-circle-check-outline"
          type="text"
          title="Approve"
          @click="approvePoem(poem.id)" />
        <el-button 
          v-if="poem.is_approved === true && editor.role === 'admin'"
          class="list_item_action_item unapprove"
          icon="el-icon-circle-close-outline"
          type="text"
          title="Unapprove"
          @click="unapprovePoem(poem.id)" />
        <el-button 
          class="list_item_action_item view"
          icon="el-icon-view"
          type="text"
          @click="viewPoem(poem)" />
        <el-button 
          v-if="poem.is_approved === false && poem.added_by.id === editor.id"
          class="list_item_action_item edit"
          icon="el-icon-edit"
          type="text"
          title="Edit"
          @click="editPoem(poem)" />
        <el-button 
          v-if="poem.is_approved === false && poem.added_by.id === editor.id"
          class="list_item_action_item delete"
          icon="el-icon-delete"
          type="text"
          title="Delete"
          @click="deletePoem(poem.id)" />
      </span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    computed: {
      editor() {
        return this.$store.getters['editor/getOne']
      }
    },
    methods: {
      approvePoem(id) {
        this.$confirm('This will approve and publish the poem. Continue?', 'Info', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info',
        }).then(async () => {
          const result = await this.$store.dispatch('poem/approve', id);
          if (!result) {
            this.$message({
              message: 'An error occurred.',
              type: 'error'
            });
          } else {
            this.$message({
              type: 'success',
              message: 'Approved successfully.'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Approvement canceled.'
          });          
        });
      },
      unapprovePoem(id) {
        this.$confirm('This will unapprove and removes from public the poem. Continue?', 'Info', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info',
        }).then(async () => {
          const result = await this.$store.dispatch('poem/unapprove', id);
          if (!result) {
            this.$message({
              message: 'An error occurred.',
              type: 'error'
            });
          } else {
            this.$message({
              type: 'success',
              message: 'Unapproved successfully.'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Approvement canceled.'
          });          
        });
      },
      viewPoem(poem) {
        this.$store.dispatch('poem/inView', poem)
        this.$store.dispatch('poem/viewFormDialogVisibility', true)
      },
      editPoem(poem) {
        this.$store.dispatch('poem/inEdit', poem)
        this.$store.dispatch('poem/editFormDialogVisibility', true)
      },
      deletePoem(id) {
        this.$confirm('This will permanently delete the poem. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(async () => {
          const result = await this.$store.dispatch('poem/delete', id);
          if (!result) {
            this.$message({
              message: 'An error occurred.',
              type: 'error'
            });
          } else {
            this.$message({
              type: 'success',
              message: 'Delete completed.'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled.'
          });          
        });
      }
    }
  }
</script>

<style>
.a,
.a:hover,
.a:active,
.a:visited {
  color: inherit;
  text-decoration: none;
}
.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  padding: 0;
  border: 1px solid rgba(0,0,0,.09);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  margin: 16px 0;
}
.list_item { 
  padding: 16px;
  border-bottom: 1px solid rgba(0,0,0,.09);
}
.list_item:nth-last-child(2),
.list_item:last-child {
  border: none;
}
.list_item .a {
  color: #080808;
  font-size: 1em;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.3;
}
.list_item .a,
.list_item .a *:hover {
  cursor: pointer;
}
.list_item_action {
  margin-left: 32px;
}
.list_item_action_item {
  font-size: 1em;
  color: #656565;
}
.list_item_action_item:hover,
.list_item_action_item:hover i {
  cursor: pointer;
}
.list_item_action_item.approve:hover {
  color: green;
}
.list_item_action_item.view:hover {
  color: #080808;
}
.list_item_action_item.edit:hover {
  color: orange;
}
.list_item_action_item.delete:hover,
.list_item_action_item.unapprove:hover {
  color: red;
}
</style>