<template>
	<div class='menu-wrapper'>
		<template v-for="item in routes">
			<!-- <router-link v-if="item.children.length>0" :to="item.code+'/'+item.children[0].code">
			<el-menu-item :index="item.code+'/'+item.children[0].code" class='submenu-title-noDropdown'>
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span slot="title">{{item.children[0].title}}</span>
			</el-menu-item>
		</router-link> -->
			<el-submenu :index="item.title">
				<template slot="title">
					<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
					<span>{{item.title}}</span>
				</template>
				<template v-for="child in item.children">
					<sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
					<router-link v-else :to="'/'+item.code+'/'+child.code">
						<el-menu-item :index="'/'+item.code+'/'+child.code">
							<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
							<span>{{child.title}}</span>
						</el-menu-item>
					</router-link>
				</template>
			</el-submenu>
		</template>

	</div>
</template>

<script>
	export default {
		name: 'SidebarItem',
		props: {
			routes: {
				type: Array
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.img-router {
		width: 14px;
		height: 14px;
	}
	/*隐藏文字*/
	.el-menu--collapse  .el-submenu__title span{
		display: none;
	}
	/*隐藏 > */
	.el-menu--collapse  .el-submenu__title .el-submenu__icon-arrow{
		display: none;
	}
	.el-menu {
		height: 100%;
	}
  	.el-menu:not(.el-menu--collapse) {
        width: 200px;
    }
</style>
