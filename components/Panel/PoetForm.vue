<template>
  <div>
    <el-dialog 
      :lock-scroll="true"
      :top="'2vh'"
      :visible="dialogVisibility"
      :close-on-click-modal="false"
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
          prop="fullname"
          label="Full Name">
          <el-input 
            v-model="form.fullname"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Full name of the poet'" />
        </el-form-item>
        <el-form-item 
          prop="bio"
          label="Short Bio">
          <el-input
            v-model="form.bio"
            :rows="4"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Short bio of the poet'"
            type="textarea" />
        </el-form-item>
        <el-form-item 
          prop="birth_date"
          label="Birth Date">
          <el-input 
            v-model="form.birth_date"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Birth date of poet'"
            @keypress.native="onlyNumbers"/>
        </el-form-item>
        <el-form-item 
          prop="death_date"
          label="Death Date">
          <el-input 
            v-model="form.death_date"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Death date of poet'"
            @keypress.native="onlyNumbers"/>
        </el-form-item>
        <el-form-item 
          prop="avatar"
          label="Avatar Link">
          <el-input 
            v-model="form.avatar"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Avatar image link of the poet'"/>
        </el-form-item>
        <el-form-item 
          prop="wiki_link"
          label="Wikipedia Link">
          <el-input 
            v-model="form.wiki_link"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Wikipedia page link of the poet'"/>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button 
            @click="close">
            {{ getCloseButtonText }}
          </el-button>
          <el-button 
            v-if="type !== 'view'"
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
      const checkYear = (rule, value, callback) => {
        if (value !== '') {
          const year = new Date().getFullYear()
          if (value <= year) {
            callback()
          } 
          callback(new Error('Writter year must be valid'))
        } else {
          callback()
        }
      }
      return {
        form: {
          fullname: '',
          birth_date: '',
          death_date: '',
          bio: '',
          wiki_link: '',
          avatar: ''
        },
        rules: {
          fullname: [
            { required: true, message: 'Please enter a full name', trigger: 'blur' },
            { min: 1, max: 100, message: 'Length should be max 100 characters', trigger: 'blur' }
          ],
          birth_date: [],
          death_date: [],
          bio: [],
          wiki_link: [],
          avatar: [
            { required: true, message: 'Please enter a avatar link', trigger: 'blur' },
            { type: 'url', message: 'Please input correct link', trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    computed: {
      dialogVisibility() {
        if (this.type === 'edit') {
          return this.$store.getters['poet/editFormDialogVisibility']
        } else if (this.type === 'view'){
          return this.$store.getters['poet/viewFormDialogVisibility']
        } else {
          return this.$store.getters['poet/addFormDialogVisibility']
        }
      },
      inEdit() {
        return this.$store.getters['poet/inEdit']
      },
      inView() {
        return this.$store.getters['poet/inView']
      },
      getFormTitle() {
        if (this.type === 'edit') {
          return 'Edit Poet'
        } else if (this.type === 'view'){
          return 'View Poet'
        } else {
          return 'Add a New Poet'
        }
      },
      getSubmitButtonText() {
        if (this.type === 'edit') {
          return 'Update Poet'
        } else {
          return 'Add Poet'
        }
      },
      getCloseButtonText() {
        if (this.type === 'view') {
          return 'Close'
        } else {
          return 'Cancel'
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
                fullname: this.form.fullname,
                birth_date: this.form.birth_date.toString(),
                death_date: this.form.death_date.toString(),
                bio: this.form.bio,
                avatar: this.form.avatar,
                wiki_link: this.form.wiki_link,
              }
              result = await this.$store.dispatch('poet/update', data)
              if (result.status === false) {
                this.$notify({
                  title: result.error.code,
                  message: result.error.message,
                  type: 'error'
                })
                return false
              }
              this.$store.dispatch('poet/editFormDialogVisibility', false)
              this.$refs.form.resetFields()
              this.$notify({
                title: 'Success',
                message: 'Successfully updated.',
                type: 'success'
              })
            } else {
              let result
              let data = {
                fullname: this.form.fullname,
                birth_date: this.form.birth_date,
                death_date: this.form.death_date,
                bio: this.form.bio,
                avatar: this.form.avatar,
                wiki_link: this.form.wiki_link,
              }
              result = await this.$store.dispatch('poet/add', data)
              if (result.status === false) {
                this.$notify({
                  title: result.error.code,
                  message: result.error.message,
                  type: 'error'
                })
                return false
              }
              this.$store.dispatch('poet/addFormDialogVisibility', false)
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
        if (this.type === 'view') {
          let p = this.inView
          this.form = unlinkObj(p)
        } else if (this.type === 'edit') {
          let p = this.inEdit
          this.form = unlinkObj(p)
        }
      },
      close() {
        if (this.type === 'view') {
          this.$store.dispatch('poet/viewFormDialogVisibility', false)
        } else if (this.type === 'edit') {
          this.$store.dispatch('poet/editFormDialogVisibility', false)
        } else {
          this.$store.dispatch('poet/addFormDialogVisibility', false)
        }
        this.$refs.form.resetFields()
      },
      onlyNumbers(e){
        const numbers = /^[0-9]*$/
        if (numbers.test(e.key)) {
          return true
        } 
        return e.preventDefault()
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
.form {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}
.form_title {
  margin-bottom: 16px;
}
.form .ql-editor {
  color: #080808;
  font-size: inherit;
  height: 360px;
  overflow-y: auto;
}
.ql-container.ql-snow {
  border:  1px solid #ddd;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.ql-toolbar.ql-snow {
  border:  1px solid #ddd;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.form .container {
  width:100% !important;
  min-height: 360px !important;
  height: auto !important;
  padding: 40px 0 0 0 !important;
}
</style>