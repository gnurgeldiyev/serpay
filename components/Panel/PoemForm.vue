<template>
  <div>
    <el-dialog 
      :lock-scroll="true"
      :top="'2vh'"
      :visible="visibility"
      :close-on-click-modal="false"
      custom-class="form_dialog"
      @open="open"
      @close="close">
      <el-form 
        ref="poem" 
        :model="poem"
        :rules="rules"
        class="form">
        <h2 class="form_title">{{ title }}</h2>
        <el-form-item 
          prop="title"
          label="Title">
          <el-input 
            v-model="poem.title"
            :disabled="type === 'view'"
            placeholder="Title of the poem" />
        </el-form-item>
        <el-form-item 
          prop="author"
          label="Author">
          <el-select 
            v-model="poem.author"
            :disabled="type === 'view'" 
            style="width: 100%;"
            placeholder="Author of the poem">
            <el-option 
              v-for="poet in poets"
              v-if="poet"
              :key="poet.name"
              :label="poet.name" 
              :value="poet.url" />
          </el-select>
        </el-form-item>
        <el-form-item 
          prop="year"
          label="Year">
          <el-input 
            v-model.number="poem.year"
            :disabled="type === 'view'"
            placeholder="Written year of the poem"
            @keypress.native="onlyNumbers"/>
        </el-form-item>
        <el-form-item 
          prop="video"
          label="YouTube Video Link">
          <el-input 
            v-model="poem.video"
            :disabled="type === 'view'"
            placeholder="YouTube video link of the poem"/>
        </el-form-item>
        <el-form-item 
          prop="category"
          label="Category">
          <el-select
            v-model="poem.category"
            :disabled="type === 'view'"
            :multiple-limit="3"
            style="width: 100%;"
            multiple
            filterable
            default-first-option
            placeholder="Categories of the poem">
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
            v-model="poem.notes"
            :rows="4"
            :disabled="type === 'view'"
            type="textarea"
            placeholder="Notes of the poem"/>
        </el-form-item>
        <el-form-item 
          prop="poem"
          label="Poem">
          <section class="container">
            <div 
              v-quill:myQuillEditor="editorOption"
              :content="poem.poem"
              :disabled="type === 'view'"
              @change="onEditorChange($event)" />
          </section>
        </el-form-item>
        <el-form-item>
          <el-button 
            style="float:right;"
            type="primary" 
            @click="submitForm">Submit for approval</el-button>
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
      },
      visibility: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Add a New Poem'
      }
    },
    data() {
      const validateVideoLink = (rule, value, callback) => {
        if (value !== '') {
          if (this.poem.video !== '' 
            && (this.poem.video.match('https://www.youtube.com/')
            || this.poem.video.match('https://youtube.com/')
            || this.poem.video.match('http://www.youtube.com/')
            || this.poem.video.match('http://youtube.com/')
            || this.poem.video.match('https://youtu.be/')
            || this.poem.video.match('http://youtu.be/'))) {
            callback()
          }
          callback(new Error('Please enter a valid YouTube video URL'))
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
          placeholder: 'Poem content...',
          theme: 'snow'
        },
        poem: {
          title: '',
          author: '',
          year: '',
          poem: null,
          notes: '',
          video: '',
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
          video: [
            { validator: validateVideoLink, trigger: 'blur' }
          ],
          author: [
            { required: true, message: 'Please select the author', trigger: 'blur' }
          ],
          year: [
            { validator: checkYear, trigger: 'blur' }
          ],
          poem: [
            { required: true, message: 'Poem content cannot be blank', trigger: 'blur' }
          ],
        }
      }
    },
    computed: {
      poets() {
        return this.$store.getters['poet/all']
      },
      categories() {
        return this.$store.getters['poem/categories']
      }
    },
    methods: {
      onEditorChange({ quill, html }) {
        this.poem.poem = html;
      },
      getEmbedLink(url) {        
        const videoId = /^https?:\/\/(www\.)?youtu\.be/.test(url) ? url.replace(/^https?:\/\/(www\.)?youtu\.be\/([\w-]{11}).*/,"$2") : url.replace(/.*\?v=([\w-]{11}).*/,"$1");
        return 'https://www.youtube.com/embed/' + videoId;
      },
      submitForm() {
        this.$refs.poem.validate(async (valid) => {
          if (valid) {
            let result
            let poem = {
              title: this.poem.title,
              author: this.poem.author,
              year: this.poem.year,
              poem: this.poem.poem,
              notes: this.poem.notes,
              video: this.getEmbedLink(this.poem.video),
              category: this.poem.category
            }
            result = await this.$store.dispatch('poem/add', poem)
            if (!result) {
              this.$message({
                message: 'An error occurred.',
                type: 'error'
              })
              return false
            }
            if (this.type === 'view') {
              this.$store.dispatch('poem/viewFormDialogVisibility', false)
            } else if (this.type === 'edit') {
              this.$store.dispatch('poem/editFormDialogVisibility', false)
            } else {
              this.$store.dispatch('poem/addFormDialogVisibility', false)
            }
            this.$refs.poem.resetFields()
            this.$message({
              message: 'A new poem submitted for approval.',
              type: 'success'
            })
          } else {
            return false
          }
        });
      },
      open() {
        if (this.type === 'view') {
          let p = this.$store.getters['poem/onView']
          console.log(p)
          this.poem = unlinkObj(p)
        } else if (this.type === 'edit') {
          let p = this.$store.getters['poem/onEdit']
          console.log(p)
          this.poem = unlinkObj(p)
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
        this.$refs.poem.resetFields()
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