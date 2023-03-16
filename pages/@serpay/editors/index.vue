<template>
    <div>
        <div class="page_action">
            <div v-if="editor.role === 'admin'" class="page_action_item">
                <el-button icon="el-icon-circle-plus-outline" plain @click="openFormDialog"> Add New </el-button>
                <editor-form />
            </div>
        </div>
        <div class="page_body">
            <el-tabs value="active">
                <el-tab-pane label="Active" name="active">
                    <editor-list :data="editors" />
                    <editor-form :type="'edit'" />
                    <editor-password-reset-form />
                </el-tab-pane>
                <el-tab-pane label="Deactivated" name="deactive">
                    <editor-list :data="deactivatedEditors" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import EditorList from '@/components/Panel/EditorList'
import EditorForm from '@/components/Panel/EditorForm'
import EditorPasswordResetForm from '@/components/Panel/EditorPasswordResetForm'

export default {
    name: 'EditorsPage',
    components: {
        'editor-list': EditorList,
        'editor-form': EditorForm,
        'editor-password-reset-form': EditorPasswordResetForm,
    },
    layout: 'panel',
    middleware: 'onlyAdmin',
    computed: {
        editors() {
            return this.$store.getters['editor/getAll']
        },
        editor() {
            return this.$store.getters['editor/getOne']
        },
        deactivatedEditors() {
            return this.$store.getters['editor/getDeactivated']
        },
    },
    beforeCreate() {
        this.$store.dispatch('editor/fetchAll')
        this.$store.dispatch('editor/fetchDeactivated')
    },
    methods: {
        openFormDialog() {
            this.$store.dispatch('editor/addFormDialogVisibility', true)
        },
    },
}
</script>

<style scoped>
.page_body {
    margin-top: 24px;
}
</style>
