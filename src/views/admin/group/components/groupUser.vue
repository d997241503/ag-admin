<template>
<div>
  <el-form label-width="120px">
    <el-form-item :label="associations[0].value+'：'" class="box-form">
      <!-- <el-select style="width: 100%;" v-model="leaders" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteLeaderMethod" :loading="loading">
        <el-option v-for="item in lItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select> -->
      <el-button @click="personnelFistHandle('组长')" type="text"
        class="but-css">
        批量选择人员
        <span>(已选{{leaders.length ? leaders.length : 0}}人)</span>
      </el-button>
      <el-select class="input-item elinput" v-model="leadersName" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
        @remove-tag="leadersRemoveTag" placeholder="" @clear="leadersClear">
      </el-select>
    </el-form-item>
    <el-form-item :label="associations[1].value+'：'" class="box-form">
      <!-- <el-select style="width: 100%;" v-model="members" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMemberMethod" :loading="loading">
        <el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select> -->
      <el-button @click="personnelFistHandle('成员')" type="text"
        class="but-css">
        批量选择人员
        <span>(已选{{members.length ? members.length : 0}}人)</span>
      </el-button>
      <el-select class="input-item elinput" v-model="membersName" clearable multiple @focus="closeIt1" ref="selectIt1" style="width:100%;"
        @remove-tag="membersRemoveTag" placeholder="" @clear="membersClear">
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
  <!-- 弹窗 选择人员 -->
  <fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
  </fuhsiSelectPersonnel>
  </div>
</template>

<script>
import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
import {
  page
} from 'api/admin/user/index';
import {
  getUsers,
  modifyUsers
} from 'api/admin/group/index';
import { mapGetters } from 'vuex';
import {
  getByType
} from 'api/admin/dict/index';
export default {
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      lItems: [],
      mItems: [],
      leaders: [],
      leadersName: [],
      members: [],
      membersName: [],
      list: [],
      loading: false,
      groupManager_btn_userManager: false,
      name: '',
      type: '',
      associations: [
        { value: '组长' },
        { value: '成员' }
      ],
      personnelFistVisible:false,
      checkedData:[],
    }
  },
  created() {
    // this.initUsers();
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
  },
  components: {
    fuhsiSelectPersonnel
  },
  watch : {
    checkedData: {
      handler(newVal, oldVal) {
        // if(newVal && newVal.resultList && newVal.resultList.length) {
        // 	for(let i=0;i<newVal.resultList.length;i++){
        // 	}
        // }
        if(newVal.label == '组长') this.leaders = newVal.resultList;
        if(newVal.label == '成员') this.members = newVal.resultList;
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    leadersClear() {
      this.leaders = [];
    },
    membersClear() {
      this.members = [];
    },
    leadersRemoveTag(val){
      for(let i = 0; i < this.leaders.length; i++) {
        if(this.leaders[i].name == val) {
          this.leaders.splice(i,1)
        }
      }
    },
    membersRemoveTag(val){
      for(let i = 0; i < this.members.length; i++) {
        if(this.members[i].name == val) {
          this.members.splice(i,1)
        }
      }
    },
    // 隐藏下拉框
    closeIt() {
      this.$refs.selectIt.blur();
    },
    closeIt1() {
      this.$refs.selectIt1.blur();
    },
    // 批量选择人员
    personnelFistHandle(label) {
      this.personnelFistVisible = true;
      this.$nextTick(() => {
        this.$refs.personnelFist.label = label;
        this.leaders = JSON.parse(JSON.stringify(this.leaders).replace(/id/g,"userId"));
        this.members = JSON.parse(JSON.stringify(this.members).replace(/id/g,"userId"));
        if(label == '组长') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.leaders));
        if(label == '成员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.members));
        this.$refs.personnelFist.init();
      })
    },
    // 获取字典
    getDataDicts(type) {
      if (!type) return
      let val = null
      val = getByType({
          type: type
        })
        .then(res => {
          if (res && res.code === 0) {
            return res.data;
          } else {
            this.$notify({
              title: '失败',
              message: '获取数据字典失败',
              type: 'success',
              duration: 2000
            });
          }
        });
      return Promise.resolve(val)
    },
    remoteMemberMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        page({
          name: query
        }).then(response => {
          this.mItems = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.mItems = [];
      }
    },
    remoteLeaderMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        page({
          name: query
        }).then(response => {
          this.lItems = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.lItems = [];
      }
    },
    onSubmit() {
      const vals = {};
      if (this.members.length > 0) vals.members = this.members.map(item => { return item.userId }).join();;
      if (this.leaders.length > 0) vals.leaders = this.leaders.map(item => { return item.userId }).join();;
      modifyUsers(this.groupId, vals).then(() => {
        this.$emit('closeUserDialog');
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initUsers(name,code) {
      if(name) this.name = name;
      if(code == 'dept') {
         // 获取监督联席会成员单位关联用户
        this.getDataDicts("associationSupervise").then((res) => {
          this.associations = res
        });
      } else if(code == 'role') {
         // 获取系统角色关联用户
        this.getDataDicts("associationRole").then((res) => {
          this.associations = res
        });
      } else if(code == 'jjjcs') {
         // 获取纪检监察室关联用户
        this.getDataDicts("associationIns").then((res) => {
          this.associations = res
        });
      } else {
        this.associations = [
          { value: '组长' },
          { value: '成员' }
        ]
      }
      getUsers(this.groupId).then(response => {
        // this.lItems = response.data.leaders;
        // this.mItems = response.data.members;
        // const mems = [], leas = [];
        // for (let i = 0; i < response.data.members.length; i++) {
        //   mems.push(response.data.members[i].id);
        // }
        // for (let i = 0; i < response.data.leaders.length; i++) {
        //   leas.push(response.data.leaders[i].id);
        // }
        // this.members = mems;
        // this.leaders = leas;
        this.leaders = response.data.leaders;
        this.members = response.data.members;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
	.box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 105px;
			margin-top: 4px;
		}
		/deep/ .el-select__tags span span .el-select__tags-text{
			margin-left: 0px;
			margin-top: 0px;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			position:fixed;
			z-index:9999;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
	}
	.elinput{
		/deep/ .el-input__inner{
			text-indent: 100px;
		}
		/deep/ .el-icon-arrow-up:before {
			content: '';
		}
		/deep/ .el-select__input{
			text-indent: 100px;
		}
		/deep/ .el-select__tags {
			span:first-child{
				margin-top: 0px;
			}
		}
	}
	.input-item {
		width: 90%;
		
		li {
		    line-height: normal;
		    padding: 7px;
		
		    .name {
		      text-overflow: ellipsis;
		      overflow: hidden;
		    }
		    .addr {
		      font-size: 12px;
		      color: #b4b4b4;
			  
		    }
		
		    .highlighted .addr {
		      color: #ddd;
			 
		    }
		  }
	}
</style>
