<template>
  <div>
    <el-dialog 
      :visible="dialogVisibility"
      :close-on-click-modal="false"
      :append-to-body="true"
      :top="'2vh'"
      custom-class="form_dialog"
      @open="open"
      @close="close">
      <el-form 
        ref="form" 
        :model="form"
        :rules="rules"
        class="form">
        <h2 class="form_title">{{ getFormTitle }}</h2>
        <el-form-item 
          prop="firstname"
          label="First Name">
          <el-input 
            v-model="form.firstname"
            autocomplete="off"
            placeholder="Amalie" />
        </el-form-item>
        <el-form-item 
          prop="lastname"
          label="Last Name">
          <el-input 
            v-model="form.lastname"
            autocomplete="off"
            placeholder="Stone" />
        </el-form-item>
        <el-form-item 
          prop="email"
          label="Email Address">
          <el-input 
            v-model="form.email"
            autocomplete="off"
            placeholder="example@mail.com"/>
        </el-form-item>
        <el-form-item 
          v-if="type === 'add'"
          prop="password"
          label="User Password">
          <el-input 
            v-model="form.password"
            type="password"
            autocomplete="off"
            placeholder="••••••••" />
        </el-form-item>
        <el-form-item 
          prop="role"
          label="Editor Role">
          <el-select
            v-model="form.role"
            style="width: 100%;"
            placeholder="Select editor role">
            <el-option
              label="Admin"
              value="admin" />
            <el-option
              label="Editor"
              value="editor" />
          </el-select>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button 
            @click="close">
            Cancel
          </el-button>
          <el-button 
            type="primary" 
            @click="submitForm">
            {{ getSubmitButtonText }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { unlinkObj } from '@/assets/helper'

  export default {
    props: {
      type: {
        type: String,
        default: 'add'
      }
    },
    data() {
      return {
        form: {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          role: ''
        },
        rules: {
          firstname: [
            { required: true, message: 'Please enter first name', trigger: 'blur' },
            { min: 1, max: 100, message: 'Length should be max 100 characters', trigger: 'blur' }
          ],
          lastname: [
            { required: true, message: 'Please enter last name', trigger: 'blur' },
            { min: 1, max: 100, message: 'Length should be max 100 characters', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Please enter email address', trigger: 'blur' },
            { type: 'email', message: 'Please enter correct email address', trigger: ['blur', 'change'] }
          ],
          password: [
            { required: true, message: 'Please enter user password', trigger: 'blur' },
            { min: 8, message: 'Length should be min 8 characters', trigger: 'blur' }
          ],
          role: [
            { required: true, message: 'Please select editor role', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      dialogVisibility() {
        if (this.type === 'edit') {
          return this.$store.getters['editor/editFormDialogVisibility']
        } else {
          return this.$store.getters['editor/addFormDialogVisibility']
        }
      },
      inEdit() {
        return this.$store.getters['editor/inEdit']
      },
      getFormTitle() {
        if (this.type === 'edit') {
          return 'Edit Editor'
        } else {
          return 'Add a New Editor'
        }
      },
      getSubmitButtonText() {
        if (this.type === 'edit') {
          return 'Update Editor'
        } else {
          return 'Add Editor'
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
             if (this.type === 'edit') {
              let result 
              let data = {
                id: this.form.id,
                firstname: this.form.firstname,
                lastname: this.form.lastname,
                email: this.form.email,
                role: this.form.role
              }
              result = await this.$store.dispatch('editor/update', data)
              if (result.status === false) {
                this.$notify({
                  title: result.error.code,
                  message: result.error.message,
                  type: 'error'
                })
                return false
              }
              this.$store.dispatch('editor/editFormDialogVisibility', false)
              this.$refs.form.resetFields()
              this.$notify({
                title: 'Success',
                message: 'Successfully updated.',
                type: 'success'
              })
            } else {
              let result
              let data = {
                firstname: this.form.firstname,
                lastname: this.form.lastname,
                email: this.form.email,
                password: this.form.password,
                role: this.form.role
              }
              result = await this.$store.dispatch('editor/add', data)
              if (result.status === false) {
                this.$notify({
                  title: result.error.code,
                  message: result.error.message,
                  type: 'error'
                })
                return false
              }
              this.$store.dispatch('editor/addFormDialogVisibility', false)
              this.$refs.form.resetFields()
              this.$notify({
                title: 'Success',
                message: 'Successfully added.',
                type: 'success'
              })
            }
          } else {
            return false
          }
        })
      },
      open() {
        if (this.type === 'edit') {
          let d = {
            id: this.inEdit.id,
            firstname: this.inEdit.firstname,
            lastname: this.inEdit.lastname,
            email: this.inEdit.email,
            role: this.inEdit.role
          }
          this.form = unlinkObj(d)
        }
      },
      close() {
        if (this.type === 'edit') {
          this.$store.dispatch('editor/editFormDialogVisibility', false)
        } else {
          this.$store.dispatch('editor/addFormDialogVisibility', false)
        }
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
.form_title {
  margin-bottom: 16px;
}
.form {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}
</style>