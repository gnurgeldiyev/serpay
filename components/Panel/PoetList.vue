<template>
  <ul 
    v-if="data.length > 0"
    class="list">
    <li 
      v-for="(poet, i) in data"
      :key="i"
      class="list_item">
      {{ i+1 }}. {{ poet.name }}
      <span class="list_item_action">
        <el-button 
          class="list_item_action_item view"
          icon="el-icon-view"
          type="text"
          @click="viewPoet(poet)" />
        <el-button 
          class="list_item_action_item edit"
          icon="el-icon-edit"
          type="text"
          @click="editPoet(poet)" />
        <el-button 
          class="list_item_action_item delete"
          icon="el-icon-delete"
          type="text"
          @click="deletePoet(poet.url)" />
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
    methods: {
      viewPoet(poet) {
        this.$store.dispatch('poet/onView', poet)
        this.$store.dispatch('poet/viewFormDialogVisibility', true)
      },
      editPoet(poet) {
        this.$store.dispatch('poet/onEdit', poet)
        this.$store.dispatch('poet/editFormDialogVisibility', true)
      },
      deletePoet(id) {
        this.$confirm('This will permanently delete the poem. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(async () => {
          const result = await this.$store.dispatch('poet/delete', id);
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
  margin: 32px 0;
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
.list_item_action_item.delete:hover {
  color: red;
}
</style>