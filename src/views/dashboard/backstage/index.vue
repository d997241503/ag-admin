<template>
  <!-- <el-row type="flex" justify="center" :gutter="8">
    <el-col :span="20">
      <el-col :span="4">
        <el-menu
          default-active="account"
          class="el-menu-vertical-demo"
          @select="handleSelectMenu"
        >
          <el-menu-item index="account">
            <i class="el-icon-s-data"></i>
            <span slot="title">基本信息</span>
          </el-menu-item>
          <el-menu-item index="notification">
            <i class="el-icon-monitor"></i>
            <span slot="title">通知</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view></router-view>
      </el-col>
    </el-col>
   
  </el-row> -->
  <div class="app-container calendar-list-container nav-content">
      <el-row type="flex" justify="center" :gutter="20">
        <!-- <el-col :span="20"> -->
        <el-col :span="4">
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group> -->
            <el-menu ref="menu" :default-active='activepath' class="el-menu-vertical-demo page-left" @select="handleSelectMenu" router>
                <el-submenu :index="item.code" v-for="(item,index) in permissionMenusBac" :key="index">
                    <template slot="title">
                        <i class="el-icon-folder"></i>
                        <!-- <img src="" /> -->
                        <span slot="title">{{item.title}}</span>
                    </template>
                    <el-menu-item-group>
                        <!-- <span slot="title">分组一</span> -->
                        <!-- @click="gotoRouteHandle(children)" -->
                        <el-menu-item v-if="children.code !== 'filesPer/index' && children.code !== 'informationCom/index' && children.code !== 'screeningComCom/index'" 
                         :index="children.code" v-for="(children,indexs) in item.children" :key="indexs" @click="getTitleHandle(children.title)">
                            <span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><i class="el-icon-document"></i>{{children.title}}</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>
        <el-col :span="20">
            <div class="page-right">
                <div class="page-right-title">
                    <span>{{title}}</span>
                </div>
            </div>
            <div class="page-right-content">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </el-col>
    <!-- </el-col> -->
   
  </el-row>
	</div>
</template>

<script>
    import {
		mapGetters
    } from 'vuex';
    export default {
        name: "Settings",
        data() {
            return {
                //导航栏
                activepath: '',
                isCollapse: false,
                title: '',
                permissionMenusBac: []
            };
        },
        computed: {
            ...mapGetters([
                'permissionMenus'
            ])
        },
        mounted() {
        },
        created() {
            // this.permissionMenusBac = this.permissionMenus;
            for(let i = 0; i < this.permissionMenus.length; i++) {
                if(this.permissionMenus[i].code == 'incorruptSys') {
                    this.permissionMenusBac.unshift({title: '', children: []})
                    this.permissionMenusBac[0].title = this.permissionMenus[i].title
                    if(this.permissionMenus[i].children) {
                         for(let j = 0; j < this.permissionMenus[i].children.length; j++) {
                             if(this.permissionMenus[i].children[j].code == 'clueEvent') {
                                 this.permissionMenusBac[0].children.push(this.permissionMenus[i].children[j])
                             }
                             if(this.permissionMenus[i].children[j].code == 'typeLarge') {
                                 this.permissionMenusBac[0].children.push(this.permissionMenus[i].children[j])
                             }
                            //  if(this.permissionMenus[i].children[j].code == 'meeting') {
                            //      this.permissionMenusBac[0].children.push(this.permissionMenus[i].children[j])
                            //  }
                             if(this.permissionMenus[i].children[j].code == 'categoryRes') {
                                 this.permissionMenusBac[0].children.push(this.permissionMenus[i].children[j])
                             }
                             if(this.permissionMenus[i].children[j].code == 'education') {
                                 this.permissionMenusBac[0].children.push(this.permissionMenus[i].children[j])
                             }
                         }
                    }
                } else {
                    if(this.permissionMenus[i].code !== 'authManager') {
                        this.permissionMenusBac.push(this.permissionMenus[i])
                    }
                }
            }
            this.$nextTick(() => {
                // this.$store.state.user.isBackstage = true;
                if(sessionStorage.getItem('todooperateid') && sessionStorage.getItem('todooperatename')) {
                    // if(sessionStorage.getItem('todooperateid') && sessionStorage.getItem('todooperatename')) {
                        this.$router.push({
                            path: "/backstage/processInstance/detail",
                            query: {
                                id: sessionStorage.getItem('todooperateid'),
                                name: sessionStorage.getItem('todooperatename')
                            }
                        });
                        this.title = sessionStorage.getItem('todooperatename');
                        sessionStorage.setItem('navkeeptitle',sessionStorage.getItem('todooperatename'));
                    // }
                } else {
                    if(sessionStorage.getItem('navkeep')){
                        this.activepath = sessionStorage.getItem('navkeep');
                    } else if(this.permissionMenusBac[0] && this.permissionMenusBac[0].children[0]) {
                        this.activepath = this.permissionMenusBac[0].children[0].code;
                        sessionStorage.setItem('navkeep',this.activepath);
                        this.handleSelectMenu(this.permissionMenusBac[0].children[0].code);
                    }
                    if(sessionStorage.getItem('navkeeptitle')) {
                        this.title = sessionStorage.getItem('navkeeptitle');
                    } else if(this.permissionMenusBac[0] && this.permissionMenusBac[0].children[0]) {
                        this.title = this.permissionMenusBac[0].children[0].title;
                        sessionStorage.setItem('navkeep',this.title);
                        // this.handleSelectMenu(this.permissionMenusBac[0].children[0].title);
                    }
                }
            })
            // if(this.permissionMenusBac[0] && this.permissionMenusBac[0].children[0]) {
            //     this.handleSelectMenu(this.permissionMenusBac[0].children[0].code);
            //     sessionStorage.setItem('navkeep',this.$refs.menu.activeIndex)
            // }
        },
        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
            handleSelectMenu(item) {
                sessionStorage.removeItem("todooperateid");
                sessionStorage.removeItem("todooperatename");
                sessionStorage.setItem('navkeep',item);
                let path = '/backstage/' + item;
                let _ts = this;
                _ts.$router.push({
                    path: path,
                });
            },

            getTitleHandle(title) {
                // this.title = title;
                sessionStorage.setItem('navkeeptitle',title);
            }
        },
    };
</script>

<style lang="scss" scoped>
    // .el-menu-vertical-demo:not(.el-menu--collapse) {
    //     width: 200px;
    //     min-height: 400px;
    // }

    .page-left {
        min-width: 200px;
    }

    .page-right {
        min-width: 1240px;
        border-bottom: solid 1px #c9c9c9;
        margin-bottom: 20px;
    }

    .page-right-title {
        width: 25%;
        height: 35px;
        line-height: 35px;
        margin: 0 auto;
        text-align: center;
        color: #ffffff;
        font-size: 17px;
        font-weight: bold;
        border-radius: 5px;
        background-color: #115082;
    }

    .page-right-content {
        min-width: 1240px;
        // width: calc(100% - 500px);
        background-color: #ffffff;
    }
</style>

