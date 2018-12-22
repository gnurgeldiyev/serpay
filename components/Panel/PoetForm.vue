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
        ref="poet" 
        :model="poet"
        :rules="rules"
        class="form">
        <h2 class="form_title">{{ title }}</h2>
        <el-form-item 
          prop="name"
          label="Full Name">
          <el-input 
            v-model="poet.name"
            :disabled="type === 'view'"
            placeholder="Full name of the poet" />
        </el-form-item>
        <el-form-item 
          prop="bio"
          label="Short Bio">
          <el-input
            v-model="poet.bio"
            :rows="4"
            :disabled="type === 'view'"
            type="textarea"
            placeholder="Short bio of the poet"/>
        </el-form-item>
        <el-form-item 
          prop="birth_data"
          label="Birth Date">
          <el-input 
            v-model.number="poet.birth_data"
            :disabled="type === 'view'"
            placeholder="Written year of the poem"
            @keypress.native="onlyNumbers"/>
        </el-form-item>
        <el-form-item 
          prop="wiki_link"
          label="Wikipedia Link">
          <el-input 
            v-model="poet.wiki_link"
            :disabled="type === 'view'"
            placeholder="Wikipedia page link of the poet"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            style="float:right;"
            type="primary" 
            @click="submitForm">Add Poet</el-button>
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
        default: 'Add a New Poet'
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
        poet: {
          name: '',
          birth_date: '',
          death_date: '',
          bio: '',
          wiki_link: '',
          avatar: ''
        },
        rules: {
          name: [
            { required: true, message: 'Please enter a full name', trigger: 'blur' },
            { min: 1, max: 100, message: 'Length should be max 100 characters', trigger: 'blur' }
          ],
          birth_date: [],
          death_data: [],
          bio: [],
          wiki_link: [],
          avatar: []
        }
      }
    },
    methods: {
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
              this.$store.dispatch('poet/viewFormDialogVisibility', false)
            } else if (this.type === 'edit') {
              this.$store.dispatch('poet/editFormDialogVisibility', false)
            } else {
              this.$store.dispatch('poet/addFormDialogVisibility', false)
            }
            this.$refs.poet.resetFields()
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
          this.$store.dispatch('poet/viewFormDialogVisibility', false)
        } else if (this.type === 'edit') {
          this.$store.dispatch('poet/editFormDialogVisibility', false)
        } else {
          this.$store.dispatch('poet/addFormDialogVisibility', false)
        }
        this.$refs.poet.resetFields()
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