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
          prop="title"
          label="Title">
          <el-input 
            v-model="form.title"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Title of the poem'" />
        </el-form-item>
        <el-form-item 
          prop="author"
          label="Author">
          <el-select 
            v-model="form.author"
            :disabled="type === 'view'" 
            :placeholder="type === 'view' ? '' : 'Author of the poem'"
            style="width: 100%;">
            <el-option 
              v-for="poet in poets"
              :key="poet.id"
              :label="poet.fullname" 
              :value="poet.id" />
          </el-select>
        </el-form-item>
        <el-form-item 
          prop="year"
          label="Year">
          <el-input 
            v-model="form.year"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Written year of the poem'"
            @keypress.native="onlyNumbers"/>
        </el-form-item>
        <el-form-item 
          prop="youtube_link"
          label="YouTube Video Link">
          <el-input 
            v-model="form.youtube_link"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'YouTube video link of the poem'"/>
        </el-form-item>
        <el-form-item 
          prop="category"
          label="Category">
          <el-select
            v-model="form.category"
            :disabled="type === 'view'"
            :multiple-limit="3"
            :placeholder="type === 'view' ? '' : 'Categories of the poem'"
            style="width: 100%;"
            multiple
            filterable
            default-first-option>
            <el-option
              v-for="item in categories"
              :key="item"
              :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item 
          prop="notes"
          label="Notes">
          <el-input
            v-model="form.notes"
            :rows="4"
            :disabled="type === 'view'"
            :placeholder="type === 'view' ? '' : 'Notes of the poem'"
            type="textarea" />
        </el-form-item>
        <el-form-item 
          prop="content"
          label="Poem">
          <section class="container">
            <div 
              v-quill:myQuillEditor="editorOption"
              :content="form.content"
              :disabled="type === 'view'"
              @change="onEditorChange($event)" />
          </section>
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
      const validateVideoLink = (rule, value, callback) => {
        const ytRgx = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm
        if (value && value !== '') {
          let result = ytRgx.test(this.form.youtube_link)
          if (result) {
            callback()
          } else {
            callback(new Error('Please enter a valid YouTube video URL'))
          }
        } else {
          callback()
        }
      }
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
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              ['clean']
            ]
          },
          placeholder: this.type === 'view' ? '' : 'Poem content...',
          theme: 'snow'
        },
        form: {
          title: '',
          author: '',
          year: '',
          content: null,
          notes: '',
          youtube_link: '',
          category: []
        },
        rules: {
          title: [
            { required: true, message: 'Please enter a title', trigger: 'blur' },
            { min: 1, max: 100, message: 'Length should be max 100 characters', trigger: 'blur' }
          ],
          notes: [
            { min: 0, max: 300, message: 'Length should be max 300 characters', trigger: 'blur' }
          ],
          category: [
            { type: 'array', required: true, message: 'Please select at least one category', trigger: 'change' }
          ],
          youtube_link: [
            { validator: validateVideoLink, trigger: 'blur' }
          ],
          author: [
            { required: true, message: 'Please select the author', trigger: 'blur' }
          ],
          year: [
            { validator: checkYear, trigger: 'blur' }
          ],
          content: [
            { required: true, message: 'Poem content cannot be blank', trigger: 'blur' }
          ],
        }
      }
    },
    computed: {
      poets() {
        return this.$store.getters['poet/getAll']
      },
      categories() {
        return this.$store.getters['poem/categories']
      },
      editor() {
        return this.$store.getters['editor/getOne']
      },
      dialogVisibility() {
        if (this.type === 'edit') {
          return this.$store.getters['poem/editFormDialogVisibility']
        } else if (this.type === 'view'){
          return this.$store.getters['poem/viewFormDialogVisibility']
        } else {
          return this.$store.getters['poem/addFormDialogVisibility']
        }
      },
      inEdit() {
        return this.$store.getters['poem/inEdit']
      },
      inView() {
        return this.$store.getters['poem/inView']
      },
      getFormTitle() {
        if (this.type === 'edit') {
          return 'Edit Poem'
        } else if (this.type === 'view'){
          return 'View Poem'
        } else {
          return 'Add a New Poem'
        }
      },
      getSubmitButtonText() {
        if (this.type === 'edit') {
          return 'Update Poem'
        } else {
          return 'Add Poem'
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
      onEditorChange({ quill, html }) {
        this.form.content = html;
      },
      getEmbedLink(url) {        
        const videoId = /^https?:\/\/(www\.)?youtu\.be/.test(url) ? url.replace(/^https?:\/\/(www\.)?youtu\.be\/([\w-]{11}).*/,"$2") : url.replace(/.*\?v=([\w-]{11}).*/,"$1")
        return 'https://www.youtube.com/embed/' + videoId
      },
      submitForm() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if (this.type === 'edit') {
              let result
              let data = {
                id: this.form.id,
                title: this.form.title,
                author: this.form.author.id ? this.form.author.id : this.form.author,
                year: this.form.year.toString(),
                content: this.form.content,
                notes: this.form.notes,
                youtube_link: this.form.youtube_link ? this.getEmbedLink(this.form.youtube_link) : null,
                category: this.form.category,
                added_by: this.form.added_by.id
              }
              result = await this.$store.dispatch('poem/update', data)
              if (result.status === false) {
                this.$notify({
                  title: result.error.code,
                  message: result.error.message,
                  type: 'error'
                })
                return false
              }
              this.$store.dispatch('poem/editFormDialogVisibility', false)
              this.$refs.form.resetFields()
              this.$notify({
                title: 'Success',
                message: 'Successfully updated.',
                type: 'success'
              })
            } else {
              let result
              let data = {
                title: this.form.title,
                author: this.form.author,
                year: this.form.year.toString(),
                content: this.form.content,
                notes: this.form.notes,
                youtube_link: this.form.youtube_link ? this.getEmbedLink(this.form.youtube_link) : null,
                category: this.form.category,
                added_by: this.editor.id
              }
              result = await this.$store.dispatch('poem/add', data)
              if (result.status === false) {
                this.$notify({
                  title: result.error.code,
                  message: result.error.message,
                  type: 'error'
                })
                return false
              }
              this.$store.dispatch('poem/addFormDialogVisibility', false)
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
          this.$store.dispatch('poem/viewFormDialogVisibility', false)
        } else if (this.type === 'edit') {
          this.$store.dispatch('poem/editFormDialogVisibility', false)
        } else {
          this.$store.dispatch('poem/addFormDialogVisibility', false)
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
  height: auto;
  border-radius: 0;
  padding-bottom: 48px;
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