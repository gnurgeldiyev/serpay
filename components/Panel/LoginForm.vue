<template>
    <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="email" label="Email">
            <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="password" label="Password">
            <el-input v-model="form.password" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item>
            <el-button style="width: 100%; margin-top: 8px" type="primary" @click="submitForm"> Login </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            rules: {
                email: [
                    { required: true, message: 'Please enter a email', trigger: 'blur' },
                    {
                        type: 'email',
                        message: 'Please enter a valid email',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: 'Please enter a password',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    const data = {
                        email: this.form.email,
                        password: this.form.password,
                    }
                    const result = await this.$store.dispatch('editor/login', data)
                    if (!result.status) {
                        this.$refs.form.resetFields()
                        this.$message({
                            message: 'Incorrect email or password.',
                            type: 'error',
                        })
                        return false
                    }
                    this.$refs.form.resetFields()
                    this.$message({
                        message: 'Logged in.',
                        type: 'success',
                    })
                    this.$router.push('/@serpay')
                } else {
                    return false
                }
            })
        },
    },
}
</script>

<style scoped></style>
