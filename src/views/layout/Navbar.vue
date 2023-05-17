<template>
	<div class="goback-info" style="position: fixed;top: 0;right: 0;left: 0;height: 120px;z-index: 1020;">
		<div class="header">
			<div style="width: 130px;text-align: right;margin-left: 50px;">
				<img style="height: 35px;" src="~@/assets/icons/header-logo.png" />
			</div>
			<!-- <div style="width: 150px;text-align: center;">
				<img src="~@/assets/icons/header-title-text.png" />
			</div> -->
			<div style="flex: 1;text-align: right;padding-right: 50px;">
				<el-dropdown class="avatar-container" trigger="click">
					<div class="avatar-wrapper" style="color: #FFFFFF;font-size: 14px;">
						你好，{{name}}
						<i class="el-icon-caret-bottom"></i>
					</div>
					<el-dropdown-menu class="user-dropdown" slot="dropdown">
						<router-link class='inlineBlock' to="/dashboard/index">
							<el-dropdown-item> 首页 </el-dropdown-item>
						</router-link>
						<el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<!-- <el-menu class="navbar" mode="horizontal" style="margin-left: 210px;"> -->
		<el-menu class="navbar" mode="horizontal" :style="[{'margin-left' : (sidebar.opened ? '230px':'36px')}]">
			<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
			<levelbar></levelbar>
			<!-- <tabs-view></tabs-view> -->
			<!-- <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
  <screenfull class='screenfull'></screenfull> -->
			<!-- <el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					{{name}}
					<i class="el-icon-caret-bottom"></i>
				</div>
				<el-dropdown-menu class="user-dropdown" slot="dropdown">
					<router-link class='inlineBlock' to="/">
						<el-dropdown-item> 首页 </el-dropdown-item>
					</router-link>
					<el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown> -->
			<div v-if="$route.matched[0] && $route.matched[1].name !== '首页' && !$store.state.user.isBack" class="go-back" @click="goBack()">
				<< 返回</div>
		</el-menu>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import Levelbar from './Levelbar';
	import TabsView from './TabsView';
	import Hamburger from 'components/Hamburger';
	import Screenfull from 'components/Screenfull';
	import ErrorLog from 'components/ErrLog';
	import errLogStore from 'store/errLog';
	export default {
		components: {
			Levelbar,
			TabsView,
			Hamburger,
			ErrorLog,
			Screenfull
		},
		data() {
			return {
				log: errLogStore.state.errLog
			}
		},
		computed: {
			...mapGetters([
				'sidebar',
				'name',
				'avatar'
			])
		},
		created() {
		},
		methods: {
			toggleSideBar() {
				this.$store.dispatch('ToggleSideBar')
			},
			logout() {
				this.$store.dispatch('FedLogOut')
			},
			goBack() {
        // 需要返回的路由设置parentName,没有设置name属性代表路由主页面，跳转两级
        let params = { path: '/' }
        const { matched } = this.$route
        const lastRoute = matched.at(-1)
        if (lastRoute.meta.parentName) {
          params.path = lastRoute.name
          ? matched.at(-2).path
          : matched.at(-3).path
        }
        this.$router.push(params)
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.header {
		height: 70px;
		// background-image: url(~@/assets/img/header-bg.png);
		background-color: #bc0000;
		// background-size: 100% 100%;
		// background-position: center;
		display: flex;
		align-items: center;
		// z-index: 1041;
		
		.avatar-container:hover {
			cursor: pointer;
		}
	}

	.navbar {
		height: 50px;
		line-height: 50px;
		border-radius: 0 !important;

		.hamburger-container {
			line-height: 58px;
			height: 50px;
			float: left;
			padding: 0 10px;
		}

		.errLog-container {
			display: inline-block;
			position: absolute;
			right: 150px;
		}

		.screenfull {
			position: absolute;
			right: 90px;
			top: 16px;
			color: red;
		}

		.avatar-container {
			height: 50px;
			display: inline-block;
			position: absolute;
			right: 180px;

			.avatar-wrapper {
				cursor: pointer;
				margin-top: 0px;
				position: relative;

				.user-avatar {
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

				.el-icon-caret-bottom {
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}

		.go-back {
			width: 100px;
			position: absolute;
			top: 0;
			right: 10px;
			text-align: center;
			color: #535458;
		}

		.go-back:hover {
			cursor: pointer;
			transform: scale(1.02);
		}
	}
</style>
