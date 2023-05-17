<template>
<!-- <div> -->
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;margin-top: 150px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <!-- $route.path -->
     <!-- background-color="#fff" text-color="#000000" active-text-color="#fff" -->
    <el-menu class="el-menu-vertical" style="margin-top: 70px;z-index: 1021;" mode="vertical" unique-opened :default-active="activeMenu" :collapse="isCollapse">
      <sidebar-item :routes='permissionMenus'></sidebar-item>
    </el-menu>
<!-- </div> -->
</template>


<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'permission_routers',
        'permissionMenus',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      activeMenu() {
        const route = this.$route
        const { meta, path} = route
        if(meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      }
    },
    // data() {
    //   return {
    //     isCollapse: true
    //   };
    // },
    created() {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-menu-vertical {

    >>> .el-menu-item { 
      // color: #777F8F !important;
      background-color: #f8f8f8 !important;
    } 
    >>> .el-menu-item:focus {
      // width: 90%;
      color: #fff !important;
      background-color: #d31811 !important;
      // border-top-right-radius: 5px !important;
      // border-bottom-right-radius: 5px !important;
    }
    >>> .el-menu-item.is-active { 
      // width: 90%;
      color: #fff !important;
      background-color: #d31811 !important;
      // border-top-right-radius: 5px !important;
      // border-bottom-right-radius: 5px !important;
    }
    >>> .el-menu-item:hover { 
      color: #000000 !important;
      background-color: #f8e5e5 !important;
    }
    >>> .el-submenu__title:hover { 
      color: #000000 !important;
      background-color: #f8e5e5 !important;
      height: 60px;
    }
    >>> .el-submenu__title { 
      height: 60px;
    }
     //菜单关闭
    >>> .el-submenu>.el-submenu__title .el-submenu__icon-arrow{
        -webkit-transform: rotateZ(-90deg); 
        -ms-transform: rotate(-90deg);
        transform: rotateZ(-90deg); 
    }
    //菜单展开
    >>> .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
        -webkit-transform: rotateZ(0deg); 
        -ms-transform: rotate(0deg);
        transform: rotateZ(0deg); 
    }
  }
  .el-menu {
		    height: 100%;
	}
  	.el-menu:not(.el-menu--collapse) {
        width: 230px;
    }
</style>
