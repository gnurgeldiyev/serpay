<template>
  <div>
    <el-dialog 
      v-if="editor.role === 'admin'"
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
          prop="wiki_link"
          label="Wikipedia Link">
          <el-input 
            v-model="form.wiki_link"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Wikipedia page link of the poet'"/>
        </el-form-item>
        <el-form-item 
          prop="avatar"
          label="Avatar">
          <el-upload
            :disabled="type === 'view'"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
            :on-error="handleError"
            :on-success="handleSuccess"
            :file-list="fileList"
            action="/api/poets/upload"
            class="upload">
            <img 
              v-if="form.avatar" 
              :src="'/' + form.avatar" 
              class="avatar">
            <i 
              v-else 
              class="el-icon-plus upload-icon" />
          </el-upload>
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
        fileList: [],
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
            { required: true, message: 'Please upload a avatar', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      editor() {
        return this.$store.getters['editor/getOne']
      },
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
        if (this.fileList.length > 0) {
          this.$axios.$delete(`/api/poets/upload/${this.fileList[0]}`)
            .then(() => {
              this.fileList = []
            })
            .catch((err) => {
              this.$message.error(err.message)
            })
        }
        this.$refs.form.resetFields()
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 < 50
        if (!isJPG) {
          this.$message.error('Avatar picture must be JPG format!')
        }
        if (!isLt2M) {
          this.$message.error('Avatar picture size can not exceed 50kb!')
        }
        return isJPG && isLt2M
      },
      onRemove(file, fileList) {
        this.$axios.$delete(`/api/poets/upload/${file.response.file.filename}`)
          .then(() => {
            this.fileList = fileList
            this.form.avatar = ''
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      },
      handleSuccess(response, file, fileList) {
        this.fileList[0] = response.file.filename
        this.form.avatar = response.file.filename
      },
      handleError(err, file, fileList) {
        this.$message.error(err.message)
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
  height: auto;
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
  padding-bottom: 60px;
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
.el-form-item__label {
  width: 100%;
  text-align: left;
}
.el-upload-list {
  width: 200px;
}
.upload .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.upload .el-upload:hover {
  border-color: #409EFF;
}
.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
  object-fit: cover;
}
</style>