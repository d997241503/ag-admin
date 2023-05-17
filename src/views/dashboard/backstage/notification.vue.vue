<template>
	<div class="app-container calendar-list-container nav-content">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" 
            @close="handleClose" :collapse="isCollapse" @select="handleSelectMenu">
            <el-submenu index="1" v-for="(item,index) in permissionMenus" :key="index">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">{{item.title}}</span>
                </template>
                <el-menu-item-group>
                    <!-- <span slot="title">分组一</span> -->
                     <!-- @click="gotoRouteHandle(children)" -->
                    <el-menu-item index="1-1" v-for="(children,indexs) in item.children" :key="indexs">{{children.title}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
            </el-menu-item>
        </el-menu>
        <div>
            <router-view></router-view>
        </div>
	</div>
</template>

<script>
    import {
		mapGetters
    } from 'vuex';
    // import MainContent from './main-content'
    export default {
        name: "index",
        data() {
            return {
                isCollapse: true
            };
        },
        components: {
			// MainContent
		},
        computed: {
			...mapGetters([
				'permissionMenus'
			])
		},
        created() {
        },
        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
            gotoRouteHandle(val, index) {
                // let routeUrl = this.$router.resolve({
                //     path: '/' + this.permissionMenus[index].code + '/' + val.code
                // });
                this.$router.push({
					path: '/solidificationPut/add'
				})
            },

            handleSelectMenu(item) {
                this.$router.push({
					path: 'employ'
				})
            },
        }
    };
</script>

<style lang="scss" scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>