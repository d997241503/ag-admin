<template>
	<el-dialog :title="!form.id ? '添加' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible" @close="closeHandle">
		<el-form :model="form" :rules="dataRule" ref="form" @keyup.enter.native="formSubmit()" label-width="100px">
            <!-- <el-form-item v-if="depType !== '1'" label="名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item> -->
            <el-form-item v-if="depType == '1' && method == 'add'" label="上级名称">
                <el-input v-model="form.parentName" placeholder="点击右侧按钮选择上级名称" readonly @mouseenter.native="enter" @mouseleave.native="leave">
                     <span v-show="form.parentName" slot="suffix">
                        <i class="el-icon-circle-close" @click="clearDataByIcon" style="margin-right: 5px;margin-top: 15px;cursor: pointer;" />
                    </span>
                    <el-popover v-model="depTreeVisibleParent" slot="append" placement="left-start" trigger="click">
                        <el-tree :data="depTreeDataParent" :props="defaultPropsParent" node-key="id" @node-click="handlePartyBranchParent" class="roll-containers">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
                        </span>
                        </el-tree>
                        <el-button slot="reference" icon="el-icon-thumb">选择</el-button>
                    </el-popover>
                </el-input>
            </el-form-item>
            <el-form-item v-if="depType == '输入' && method == 'add'" label="上级名称">
                <el-input v-model="form.parentName" placeholder="请输入上级角色名称"></el-input>
            </el-form-item>
            <el-form-item v-if="depType == '1' && method == 'add'" label="部门">
                <el-input v-model="form.name" placeholder="点击右侧按钮选择部门" readonly>
                    <el-popover v-model="depTreeVisible" slot="append" placement="left-start" trigger="click">
                        <el-tree :data="depTreeData" :props="depDefaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
                        </span>
                        </el-tree>
                        <el-button slot="reference" icon="el-icon-thumb">选择</el-button>
                    </el-popover>
                </el-input>
            </el-form-item>
            <el-form-item v-if="depType == '输入' && method == 'add'" label="角色名称">
                <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item v-if="method == 'update'" label="上级名称">
                <el-input v-model="form.parentName" placeholder="" readonly :disabled="true">
                <!-- <el-popover v-model="depTreeVisibleParent" slot="append" placement="left-start" trigger="click">
                    <el-tree :data="depTreeData" :props="depDefaultProps" node-key="id" @node-click="handlePartyBranchParent" class="roll-containers">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
                    </span>
                    </el-tree>
                    <el-button slot="reference" icon="el-icon-thumb">选择</el-button>
                </el-popover> -->
                </el-input>
            </el-form-item>
            <el-form-item v-if="depType == '1' && method == 'update'" label="部门">
                <el-input v-model="form.name" placeholder="点击右侧按钮选择部门" readonly>
                <el-popover v-model="depTreeVisible" slot="append" placement="left-start" trigger="click">
                    <el-tree :data="depTreeData" :props="depDefaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
                    </span>
                    </el-tree>
                    <el-button slot="reference" icon="el-icon-thumb">选择</el-button>
                </el-popover>
                </el-input>
            </el-form-item>
            <el-form-item v-if="depType == '输入' && method == 'update'" label="角色名称">
                <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button v-if="form.id" type="primary" @click="update" :loading="loading">确定</el-button>
            <el-button v-else type="primary" @click="create" :loading="loading">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		addObj,
        putObj,
        fetchTree
	} from 'api/admin/group/index';
    import { mapGetters } from 'vuex';
    import {
    getTree
    } from 'api/admin/department/index';
	export default {
		data() {
			return {
				visible: false,
				loading: false,
				form: {
					code: undefined,
                    name: undefined,
                    description: undefined,
                    groupType: undefined,
                    deptName: undefined,
                    deptId: undefined,
                    parentId: '-1',
                    parentName: undefined
				},
				dataRule: {
				},
                depType: '',
                depTreeVisibleParent: false,
                depTreeDataParent: [],
                defaultPropsParent: {
                    children: 'children',
                    label: 'label'
                },
                depTreeVisible: false,
                depTreeData: [],
                depDefaultProps: {
                    children: 'children',
                    label: 'departmentFullName'
                },
                method: '',
                listQuery: {
                    groupType: undefined,
                    name: undefined
                },
                // iconShow: false
			}
		},
		created() {
		},
		computed: {
			...mapGetters([
				'userId'
			])
		},
		methods: {
            // 鼠标进入
            enter(){
                // if (this.form.parentName){
                //     this.iconShow = true;
                //     this.$forceUpdate()
                // }
            },
            // 鼠标移出
            leave(){
                // this.iconShow = false;
                // this.$forceUpdate()
            },
            // 点击输入框的×号，清空输入框中的内容
            clearDataByIcon(){
                this.form.parentName = '';
                this.form.parentId = '-1'
                // // 重置下拉树
                // this.$refs.deptSelect.resetTreeNode()
                this.$forceUpdate()
                // 期望点击×号时，popover弹框不要弹出，但是点击弹框外的地方会触发popover显隐反转，所以应该设为true，而不是false
                this.depTreeVisibleParent = true
            },
            getList() {
                fetchTree(this.listQuery).then(data => {
                    this.depTreeDataParent = data;
                });
            },
            // 获取部门树
            getTreeInfo() {
                getTree({
                    departmentAttribute: ''
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
                this.form.deptName = data.departmentFullName;
                this.form.name = data.departmentFullName;
                this.depTreeVisible = false;
            },
            // 选择上一级
            handlePartyBranchParent(data) {
                this.form.parentId = data.id;
                this.form.parentName = data.label;
                this.depTreeVisibleParent = false;
            },
			init() {
                this.visible = true
                this.getTreeInfo();
                this.getList();
            },
            
             update() {
                this.loading = true;
                putObj(this.form.id, this.form).then((res) => {
                    if (res && res.status === 200) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success',
                            duration: 2000
                        });
                        setTimeout(() => {
                            this.loading = false;
                            this.visible = false;
                            this.$emit("refreshDataList")
                        }, 1000)
                    } else {
                        this.$notify({
                            title: '失败',
                            message: res.msg,
                            type: 'error',
                            duration: 2000
                        });
                    }
                });
            },
            create() {
                this.loading = true;
                // if(!this.form.parentId) this.form.parentId = '-1';
                addObj(this.form).then((res) => {
                    if (res && res.status === 200) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success',
                            duration: 2000
                        });
                        setTimeout(() => {
                            this.loading = false;
                            this.visible = false;
                            this.$emit("refreshDataList")
                        }, 1000)
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
             },

             closeHandle() {
                this.form =  {
					code: undefined,
                    name: undefined,
                    description: undefined,
                    groupType: undefined,
                    deptName: undefined,
                    deptId: undefined,
                    parentId: '-1',
                    parentName: undefined
				}
             }
		}
	}
</script>

<style lang="scss" scoped>
</style>
