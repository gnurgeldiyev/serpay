<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <div>
                <nuxt-link to="/@serpay" class="pheader_logo"> Serpaý </nuxt-link>
                <span v-if="editor">
                    {{ editor.role }}
                </span>
            </div>
        </el-col>
        <el-col :span="16">
            <ul class="pheader_menu">
                <li class="pheader_menu_item">
                    <nuxt-link to="/" target="_blank" title="Serpaý, Goşgular Çemeni"> serpay.penjire.com </nuxt-link>
                </li>
                <li class="pheader_menu_item">
                    <el-dropdown trigger="click">
                        <span class="el-icon-more icon" />
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <el-button type="text" @click="handleLogout(editor.id)"> Logout </el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </ul>
        </el-col>
    </el-row>
</template>

<script>
export default {
    computed: {
        editor() {
            return this.$store.getters['editor/getOne']
        },
    },
    methods: {
        async handleLogout(data) {
            const result = await this.$store.dispatch('editor/logout', data)
            if (!result.status) {
                this.$message({
                    message: 'An error occurred.',
                    type: 'error',
                })
            } else {
                this.$router.push('/')
                this.$message({
                    message: 'Logged out.',
                    type: 'success',
                })
            }
        },
    },
}
</script>

<style>
.pheader {
    padding: 16px 32px;
    -webkit-box-shadow: 0px 2px 10px 2px rgba(221, 221, 221, 0.5);
    -moz-box-shadow: 0px 2px 10px 2px rgba(221, 221, 221, 0.5);
    box-shadow: 0px 2px 10px 2px rgba(221, 221, 221, 0.5);
}
.pheader_logo {
    color: #000001;
    text-decoration: none;
    font-size: 2rem;
    line-height: 1;
    font-weight: 700;
    font-family: 'Inria Serif', Georgia, serif;
}
.pheader_menu {
    float: right;
    list-style: none;
    margin-top: 6px;
}
.pheader_menu_item {
    display: inline;
    margin: 0 20px;
}
.pheader_menu_item a {
    color: #656565;
    text-decoration: none;
    font-family: inherit;
    font-weight: 600;
}
.pheader_menu_item a:hover {
    cursor: pointer;
}
.pheader_menu_item .icon {
    font-size: 1.5em;
}
</style>
