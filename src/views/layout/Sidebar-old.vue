<template>
	<el-menu mode="vertical" background-color="#2D3A4B" text-color="#fff" active-text-color="#888" unique-opened
	 :default-active="$route.path" :default-openeds="openeds" :collapse="isCollapse" router>
		<sidebar-item :routes='menus'></sidebar-item>
	</el-menu>
</template>


<script>
	import {
		mapGetters
	} from 'vuex';
	import SidebarItem from './SidebarItem';
	export default {
		data() {
			return {
				openeds: ["1"]
			}
		},
		components: {
			SidebarItem,

		},
		computed: {
			...mapGetters([
				'sidebar',
				'permissionMenus'
			]),
			isCollapse() {
				return !this.sidebar.opened
			},
			menus() {
				if(this.permissionMenus) {
					let code = "";
					// 解决新建页面不显示侧边栏问题
					if (this.$route.meta && this.$route.meta.parentName) {
						code = this.$route.meta.parentName;
						var nav = JSON.parse(localStorage.getItem(code));
						return [this.permissionMenus[nav.index].children[nav.childIndex]];
					} else {
						let index = this.$route.path.lastIndexOf('/');
						code = this.$route.path.substring(index + 1, this.$route.path.length);
						var nav = JSON.parse(localStorage.getItem(code));
						return [this.permissionMenus[nav.index].children[nav.childIndex]];
					}
				}

			}
		},
		created() {}
	}
</script>
