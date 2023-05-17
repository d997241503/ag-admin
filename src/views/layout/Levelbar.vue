<template>
	<el-breadcrumb class="app-levelbar goback-info" separator="/">
		<el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
			<span v-if='isText(item, index)' class="no-redirect">{{item.name | trimStr}}</span>
			<router-link v-else :to="item.redirect||item.path" class="is-redirect">{{item.name | trimStr}}</router-link>
		</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
	export default {
		created() {
			this.getBreadcrumb()
		},
		data() {
			return {
				levelList: null
			}
		},
		filters: {
			trimStr(val) {
				return val.trim();
			}
		},
		methods: {
			isText(item, index) {
                return item.redirect === "noredirect" || index == this.levelList.length-1 || item?.meta?.isSubmenu
            },
			getBreadcrumb() {
				let matched = this.$route.matched.filter(item => item.name);
				const first = matched[0];
				if (first && (first.name !== '首页' || first.path !== '')) {
					matched = [{
						name: '首页',
						path: '/'
					}].concat(matched)
				}
				this.levelList = matched;	
				const second = this.levelList[1];
				if (second && (second.name == '首页')) {
					this.levelList = this.levelList.splice(0,1)
				}		
				// this.$nextTick(() => {
				// 	for(let i = 0; i < this.levelList.length; i++) {
				// 		if(this.levelList[i].name == '管理后台' && this.levelList[i-1].name == '廉政系统') {
				// 			this.levelList.splice(i-1,1)
				// 		}
				// 	}
				// })
			}
		},
		watch: {
			$route() {
				this.getBreadcrumb();
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.app-levelbar.el-breadcrumb {
		display: inline-block;
		font-size: 14px;
		line-height: 50px;
		margin-left: 10px;

		.no-redirect {
			color: #97a8be;
			cursor: text;
		}

		.is-redirect {
			color: #97a8be;
			cursor: pointer;
		}

		.is-redirect:hover {
			color: #bc0000;
		}
		
		>>> .el-breadcrumb__item:last-child .el-breadcrumb__inner a {
			color: #97a8be;
		}
	}
</style>
