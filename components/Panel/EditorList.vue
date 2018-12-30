<template>
  <el-table
    ref="table"
    :data="data"
    style="width: 100%;">
    <el-table-column
      prop="firstname"
      label="First Name"
      width="160"
      column-key="firstname"
      sortable />
    <el-table-column
      prop="lastname"
      label="Last Name"
      width="160"
      column-key="lastname"
      sortable />
    <el-table-column
      prop="email"
      label="Email"
      width="240" />
    <el-table-column
      prop="created_at"
      label="Joined"
      width="160">
      <template slot-scope="scope">
        {{ formatDate(scope.row.created_at) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="role"
      label="Role"
      width="160">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.role === 'admin' ? 'primary' : 'info'"
          size="small"
          style="margin-right:4px;"
          disable-transitions>
          {{ scope.row.role }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Operations"
      align="center">
      <template slot-scope="scope">
        <el-dropdown trigger="click">
          <span 
            class="el-icon-more"
            style="font-size:1.2em;" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button
                type="text"
                style="color:#606266;"
                @click="editItem(scope.row)">
                Edit Details
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                type="text"
                style="color:#606266;"
                @click="resetPassword(scope.row)">
                Reset Password
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-button
                type="text"
                style="color:red;"
                @click="deactivateItem(scope.row)">
                Deactivate User
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
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
      editItem(item) {
        this.$store.dispatch('editor/inEdit', item)
        this.$store.dispatch('editor/editFormDialogVisibility', true)
      },
      resetPassword(item) {
        this.$store.dispatch('editor/inReset', item)
        this.$store.dispatch('editor/resetFormDialogVisibility', true)
      },
      deactivateItem(item) {
        this.$confirm(`${item.firstname} won't be able to log in anymore.`, `Deactivate ${item.firstname} ${item.lastname}?`, {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(async () => {
          let result = await this.$store.dispatch('editor/deactivate', item)
          if (result.status === false) {
            this.$notify({
              title: result.error.code,
              message: result.error.message,
              type: 'error'
            })
            return
          }
          this.$notify({
            title: 'Success',
            message: 'Successfully deactivated',
            type: 'success'
          })
        }).catch(() => {
          return
        })
      },
      formatDate(date) {
        const day = new Date(date).getDate();
        const month = new Date(date).getMonth() + 1;
        const year = new Date(date).getFullYear();
        return day + '.' + month + '.' + year;
      }
    }
  }
</script>

<style scoped>

</style>