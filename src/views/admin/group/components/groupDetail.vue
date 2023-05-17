<template>
<el-row>
  <el-col :span="24">
    <el-button-group>
      <el-button type="primary" v-if="groupManager_btn_add" @click="addOrUpdateHandle('add')">
        <icon-svg icon-class="add"></icon-svg>添加</el-button>
      <el-button type="primary" v-if="groupManager_btn_edit && form.id" @click="addOrUpdateHandle('update')">
        <icon-svg icon-class="edit"></icon-svg>编辑</el-button>
      <el-button type="primary" v-if="groupManager_btn_del" @click="handleDelete">
        <icon-svg icon-class="delete"></icon-svg>删除</el-button>
      <el-button type="primary" v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
        <icon-svg icon-class="quanxian1"></icon-svg>权限分配</el-button>
      <el-button type="primary" v-if="groupManager_btn_userManager" @click="handlerUser">
        <icon-svg icon-class="27"></icon-svg>关联用户</el-button>
      <el-button type="primary" v-if="groupManager_btn_authority" @click="handlerDept">
        <icon-svg icon-class="27"></icon-svg>关联资源</el-button>
    </el-button-group>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all> </el-tree>
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
      <el-form-item v-if="depType !== '1'" label="名称">
        <el-input v-model="form.name" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item v-if="depType == '1'" label="上级名称">
        <el-input v-model="form.parentName" placeholder="" readonly :disabled="formEdit">
        </el-input>
      </el-form-item>
      <el-form-item v-if="depType == '1'" label="部门">
        <el-input v-model="form.name" placeholder="" readonly :disabled="formEdit">
          <!-- <el-popover v-model="depTreeVisible" slot="append" placement="left-start" trigger="click">
            <el-tree :data="depTreeData" :props="depDefaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
              </span>
            </el-tree>
            <el-button slot="reference" icon="el-icon-thumb" :disabled="formEdit">选择</el-button>
          </el-popover> -->
        </el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" v-if="groupManager_btn_edit" @click="update">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" v-if="groupManager_btn_add" @click="create">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible">
    <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
  </el-dialog>
  <el-dialog :title="dialogDeptName" :visible.sync="dialogDeptVisible">
    <group-dept :groupId="currentId" @closeDeptDialog="closeDeptDialog" ref="groupDept"></group-dept>
  </el-dialog>
  <el-dialog :title="dialogAuthorityName" :visible.sync="dialogAuthorityVisible">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>
  <!-- <el-dialog :visible.sync="addOrUpdateVisible"> -->
    <add-or-update ref="groupAddOrUpdate" @refreshDataList="getList"></add-or-update>
  <!-- </el-dialog> -->
</el-row>
</template>

<script>
import AddOrUpdate from './addOrEdit';
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj
} from 'api/admin/group/index';
import { mapGetters } from 'vuex';
import {
  getTree
} from 'api/admin/department/index';
export default {
  name: 'groupDetail',
  components: {
    'group-user': () => import('./groupUser'),
    'group-dept': () => import('./groupDept'),
    'group-authority': () => import('./groupAuthority'),
    AddOrUpdate
  },
  props: {
    type: {
      default: '1'
    },
    depType: {
      default: ''
    },
    name: {
      default: ''
    },
    code: {
      default: ''
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      addOrUpdateVisible: false,
      dialogUserVisible: false,
      dialogUserName: '关联用户',
	    dialogDeptVisible: false,
      dialogDeptName: '关联部门',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      listQuery: {
        groupType: this.type,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: false,
      groupManager_btn_del: false,
      groupManager_btn_add: false,
      groupManager_btn_userManager: false,
      groupManager_btn_resourceManager: false,
	    groupManager_btn_authority: false,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type,
        deptName: undefined,
        deptId: undefined
      },
      currentId: -1,
      depTreeVisible: false,
      depTreeData: [],
      depDefaultProps: {
        children: 'children',
        label: 'departmentFullName'
      },
      ownDepartment: false,
      parentId: undefined
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeInfo();
    this.groupManager_btn_edit = this.elements['groupManager:btn_edit'];
    this.groupManager_btn_del = this.elements['groupManager:btn_del'];
    this.groupManager_btn_add = this.elements['groupManager:btn_add'];
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
    this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager'];
    this.groupManager_btn_authority = this.elements['groupManager:btn_authority'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    // 获取部门树
    getTreeInfo() {
      getTree({
          departmentAttribute: '1'
        })
      .then(res => {
        if (res && res.code === 0) {
          this.depTreeData = res.data ? res.data : [];
        } else {
          this.$notify({
            title: '失败',
            message: "获取部门树失败",
            type: 'error',
            duration: 2000
          });
        }
      });
    },
    // 选择部门
    handlePartyBranch(data) {
      this.form.deptId = data.id;
      // this.form.deptName = data.departmentFullName;
      this.form.name = data.departmentFullName;
      this.depTreeVisible = false;
    },
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
      if(data.ownDepartment) this.ownDepartment = data.ownDepartment;
      else  this.ownDepartment = false;
      this.parentId = data.parentId;
    },
    // 添加 / 编辑
    addOrUpdateHandle(method) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
         if (this.$refs.groupAddOrUpdate !== undefined) {
            // if(this.depType = '1') {
              this.$refs.groupAddOrUpdate.form.groupType = this.type;
              if(method == 'add' && this.form.id) {
                // this.$refs.groupAddOrUpdate.form.deptId = this.form.deptId;
                // this.$refs.groupAddOrUpdate.form.name = this.form.name;
                // this.$refs.groupAddOrUpdate.form.deptName = this.form.deptName;
                this.$refs.groupAddOrUpdate.form.parentId = this.form.id;
                this.$refs.groupAddOrUpdate.form.parentName = this.form.name;
                this.$refs.groupAddOrUpdate.listQuery.groupType = this.type;
              }
              if(method == 'update' && this.form.id) {
                this.$refs.groupAddOrUpdate.form = this.form;
              }
            // }
            this.$refs.groupAddOrUpdate.method = method;
            // if(this.form.id) this.$refs.groupAddOrUpdate.form.parentId = this.form.id;
            // this.$refs.groupAddOrUpdate.form.deptId = this.form.deptId;
            this.$refs.groupAddOrUpdate.depType = this.depType;
            // if(method == 'update') this.$refs.groupAddOrUpdate.form = this.form;
            this.$refs.groupAddOrUpdate.init();
        }
      })
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then((res) => {
          if(res && res.status === 200) {
            this.getList();
            this.resetForm();
            this.onCancel();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          } else {
            this.$notify({
              title: '失败',
              message: res.msg,
              type: 'error',
              duration: 2000
            });
            this.loading = false;
          }
        });
      });
    },
    update() {
      putObj(this.form.id, this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    create() {
      addObj(this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = '';
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      };
    },
    handlerUser() {
      this.dialogUserVisible = true;
      this.$nextTick(() => {
         if (this.$refs.groupUser !== undefined) {
          this.$refs.groupUser.groupId = this.currentId;
          this.$refs.groupUser.initUsers(this.name,this.code);
        }
      })
    },
	handlerDept() {
      this.dialogDeptVisible = true;
      this.$nextTick(() => {
         if (this.$refs.groupDept !== undefined) {
            this.$refs.groupDept.groupId = this.currentId;
            this.$refs.groupDept.ownDepartment = this.ownDepartment;
            this.$refs.groupDept.parentId = this.parentId;
            this.$refs.groupDept.code = this.depType;
            this.$refs.groupDept.initDept();
          }
       })
    },
    handlerAuthority() {
      this.dialogAuthorityVisible = true;
      this.$nextTick(() => {
        this.$refs.groupAuthority.getElementList();
      })
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId;
        this.$refs.groupAuthority.initAuthoritys();
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeDeptDialog() {
      this.dialogDeptVisible = false;
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false;
    }
  }
}
</script>
