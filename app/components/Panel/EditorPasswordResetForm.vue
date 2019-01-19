<template>
  <div>
    <el-dialog 
      :visible="dialogVisibility"
      :close-on-click-modal="false"
      :append-to-body="true"
      :top="'4vh'"
      custom-class="form_dialog"
      @open="open"
      @close="close">
      <el-form 
        ref="form" 
        :model="form"
        :rules="rules"
        class="form">
        <h2 class="form_title">
          Reset Password
        </h2>
        <h4 class="form_description">
          {{ inReset.firstname + ' ' + inReset.lastname }}
        </h4>
        <el-form-item 
          prop="password"
          label="New Password">
          <el-input 
            v-model="form.password"
            type="password"
            autocomplete="off"
            placeholder="••••••••" />
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button 
            @click="close">
            Cancel
          </el-button>
          <el-button 
            type="primary" 
            @click="submitForm">
            Reset Password
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { unlinkObj } from '@/assets/helper'

  export default {
    data() {
      return {
        form: {
          password: ''
        },
        rules: {
          password: [
            { required: true, message: 'Please enter user password', trigger: 'blur' },
            { min: 8, message: 'Length should be min 8 characters', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      dialogVisibility() {
        return this.$store.getters['editor/resetFormDialogVisibility']
      },
      inReset() {
        return this.$store.getters['editor/inReset']
      }
    },
    methods: {
      submitForm() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            let result 
            let data = {
              id: this.form.id,
              password: this.form.password
            }
            result = await this.$store.dispatch('editor/resetPassword', data)
            if (result.status === false) {
              this.$notify({
                title: result.error.code,
                message: result.error.message,
                type: 'error'
              })
              return false
            }
            this.$store.dispatch('editor/resetFormDialogVisibility', false)
            this.$refs.form.resetFields()
            this.$notify({
              title: 'Success',
              message: 'Successfully updated.',
              type: 'success'
            })
          } else {
            return false
          }
        })
      },
      open() {
        let d = {
          id: this.inReset.id,
        }
        this.form = unlinkObj(d)
      },
      close() {
        this.$store.dispatch('editor/resetFormDialogVisibility', false)
        this.$refs.form.resetFields()
      }
    }
  }
</script>

<style>
.form_dialog {
  margin: 0 !important;
  width: 100%;
  min-height: 100vh;
  border-radius: 0;
}
.form_dialog .el-icon {
  font-size: 2em;
  margin: 16px 24px 0 0;
}
.form_title,
.form_description {
  margin-bottom: 16px;
}
.form {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}
</style>