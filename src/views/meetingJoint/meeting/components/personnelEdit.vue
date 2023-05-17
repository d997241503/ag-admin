<template>
	<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
			<!-- <el-form-item label="巡查小组：" prop="teamName">
				<el-input v-model="dataForm.teamName" placeholder="请输入" style="width: 86%" maxlength="250"></el-input>
			</el-form-item> -->
			<el-form-item label="成员单位名称：" prop="groupLeader">
				<el-input v-model="dataForm.orgName" placeholder="点击右侧按钮选择单位" readonly style="width: 86%">
					<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
						<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
							</span>
						</el-tree>
						<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
					</el-popover>
				</el-input>
			</el-form-item>
			<el-form-item label="成员：" prop="deputyGroupLeader">
				<div v-if="dataForm.id" class="form-member">
					<el-select class="form-member-select-id" v-model="dataForm.item" placeholder="请选择成员" @change="change($event,0)">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item">
						</el-option>
					</el-select>
					<el-select class="form-member-post-id" v-model="dataForm.position" placeholder="请选择职务">
						<el-option
						v-for="item in jointMeetingPost"
						:key="item.code"
						:label="item.value"
						:value="item.code">
						</el-option>
					</el-select>
				</div>
				<div v-else class="form-member" v-for="(item, index) in basisPunishment" :key="index">
					<el-select class="form-member-select" v-model="basisPunishment[index].item" placeholder="请选择成员" @change="change($event,index)">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item">
						</el-option>
					</el-select>
					<el-select class="form-member-post" v-model="basisPunishment[index].position" placeholder="请选择职务">
						<el-option
						v-for="item in jointMeetingPost"
						:key="item.code"
						:label="item.value"
						:value="item.code">
						</el-option>
					</el-select>
					<div class="item-btn">
						<span class="btn-info" v-show="index == basisPunishment.length - 1"
							@click="itemAdd()"><i
								class="el-icon-circle-plus-outline"></i></span>
						<span class="btn-info" v-show="basisPunishment.length > 1"
							@click="itemDel(index)"><i
								class="el-icon-remove-outline"></i></span>
					</div>
				</div>
			</el-form-item>
			<!-- <el-form-item label="巡查小组组员：" prop="groupMember">
				<el-select v-model="dataForm.groupMember" multiple filterable remote placeholder="请输入关键词"
				 key="groupMember-type" :remote-method="remoteMemberMethod" :loading="loading" style="width: 86%">
					<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select>
			</el-form-item> -->
		</el-form>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		page
	} from 'api/admin/user/index';
	import {
		getUsers,
		modifyUsers
	} from 'api/admin/group/index';
	import {
		addMeetingmember,
		getMeetingmemberObj
	} from 'api/meeting/index';
	import { mapGetters } from 'vuex';
	import {
		getTree,
		getUser
	} from 'api/admin/department/index';
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
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				visible: false,
				lItems: [],
				mItems: [],
				loading: false,
				dataForm: {
					id: undefined,
					deptId: undefined,
					deptName: '',
					name: '',
					orgId: undefined,
					orgName: '',
					position: '',
					userId: undefined,
					item: undefined,
					// basisPunishment: [''],
				},
				basisPunishment: [
					{
						item: undefined,
						name: '',
						userId: undefined,
						position: ''
					}
				],
				options: [],
				types:  [{
					label: '单选',
					value: '1'
				}, {
					label: '多选',
					value: '2'
				}, {
					label: '填空',
					value: '4'
				}],
				dataRule: {
					// teamName: [{
					// 	required: true,
					// 	message: '巡查小组名不能为空',
					// 	trigger: 'blur'
					// }],
					// groupLeader: [{
					// 	required: true,
					// 	message: '请选择组长',
					// 	trigger: 'change'
					// }]
				},
				method: '',
				jointMeetingPost: []
			}
		},
		created() {
			this.getTreeInfo();
			// 获取联席会成员职务分类
			this.getDataDicts("jointMeetingPost").then((res) => {
				this.jointMeetingPost = res;
			});
		},
		computed: {
			...mapGetters([
				'userId'
			])
		},
		methods: {
			remoteLeaderMethod(query) {
				// if (query !== '') {
				// 	this.loading = true;
				// 	this.loading = false;
				// 	page({
				// 		name: query
				// 	}).then(response => {
				// 		this.mItems = response.data.rows;
				// 		this.total = response.data.total;
				// 		this.loading = false;
				// 	});
				// } else {
				// 	this.mItems = [];
				// }
			},
			remoteGroupLeaderMethod(query) {
				// if (query !== '') {
				// 	this.loading = true;
				// 	this.loading = false;
				// 	page({
				// 		name: query
				// 	}).then(response => {
				// 		this.mItems = response.data.rows;
				// 		this.total = response.data.total;
				// 		this.loading = false;
				// 	});
				// } else {
				// 	this.mItems = [];
				// }
			},
			remoteMemberMethod(query) {
				// if (query !== '') {
				// 	this.loading = true;
				// 	this.loading = false;
				// 	page({
				// 		name: query
				// 	}).then(response => {
				// 		this.mItems = response.data.rows;
				// 		this.total = response.data.total;
				// 		this.loading = false;
				// 	});
				// } else {
				// 	this.mItems = [];
				// }
			},
			groupLeaderChange(val) {
			},
			initUsers() {
				// getUsers(this.userId).then(response => {
				// 	this.lItems = response.data.leaders;
				// 	this.mItems = response.data.members;
				// });
			},
			init(id) {
				this.visible = true
				// this.dataForm.id = 1;
				if (id) {
					getMeetingmemberObj(id)
						.then(response => {
							this.getUserDataList(response.data.orgId);
							this.$nextTick(() => {
								this.dataForm = response.data;
								this.dataForm.item = {value: response.data.userId, label: response.data.name};
								// this.getUserDataList();
							})
						});
				} else {
					// this.dataForm.id = undefined;
					this.dataForm = {
						id: undefined,
						deptId: undefined,
						deptName: '',
						name: '',
						orgId: undefined,
						orgName: '',
						position: '',
						userId: undefined,
						item: undefined,
						// basisPunishment: [''],
					};
					this.basisPunishment = [
						{
							item: undefined,
							name: '',
							userId: undefined,
							position: ''
						}
					]
				}
				// this.mItems = [];
				// if(row) {
				// 	this.dataForm.id = row.id
				// 	this.dataForm.teamName = row.teamName
				// 	// this.lItems = row.groupLeader;
				// 	// this.mItems = row.deputyGroupLeader;
				// 	for(let i = 0; i < row.groupLeader.length; i++) {
				// 		this.mItems.push(row.groupLeader[i]);
				// 		// this.mItems[i].id = row.groupLeader[i].userId;
				// 	}
				// 	for(let j = 0; j < row.deputyGroupLeader.length; j++) {
				// 		this.mItems.push(row.deputyGroupLeader[j]);
				// 		// this.mItems[j].id = row.deputyGroupLeader[j].userId;
				// 	}
				// 	for(let k = 0; k < row.groupMember.length; k++) {
				// 		this.mItems.push(row.groupMember[k]);
				// 		// this.mItems[k].id = row.groupMember[k].userId;
				// 	}
				// 	for(let m = 0; m < this.mItems.length; m++) {
				// 		this.mItems[m].id = this.mItems[m].userId;
				// 	}
				// 	this.$nextTick(() => {
				// 		this.dataForm.groupLeader = row.groupLeader.map(item => { return item.userId })
				// 		this.dataForm.deputyGroupLeader = row.deputyGroupLeader.map(item => { return item.userId })
				// 		this.dataForm.groupMember = row.groupMember.map(item => { return item.userId })
				// 	})
				// }
				// this.visible = true
				// this.$nextTick(() => {
				// 	if(!this.dataForm.id) this.$refs['dataForm'].resetFields()
				// 	// if (this.dataForm.subjectId) {
				// 	// 	subjectDetail(this.dataForm.subjectId).then(data => {
				// 	// 		if (data && data.code === 0) {
				// 	// 			this.dataForm = data.subjectInfo
				// 	// 		}
				// 	// 	})
				// 	// }
				// })
			},

			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
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

			// 选择单位
			handlePartyBranch(data) {
				this.dataForm.orgId = data.id;
				this.dataForm.orgName = data.departmentFullName;
				this.getUserDataList();
				this.treeVisible = false;
			},

			// 获取单位人员
			getUserDataList(orgId) {
				getUser(orgId ? orgId : this.dataForm.orgId,{ name: '' })
					.then(res => {
						if (res && res.status === 200) {
							this.options = res.data.map(item => { return {value: item.userId, label: item.name} });
						} else {
							this.$notify({
								title: '失败',
								message: "获取人员失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},

			// 选择单位人员
			change(e,index) {
				this.basisPunishment[index].userId = e.value;
				this.basisPunishment[index].name = e.label;
			},

			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null;
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
				return Promise.resolve(val);
			},

			// 新增元素
			itemAdd() {
				this.basisPunishment.push({
						item: undefined,
						name: '',
						userId: undefined,
						position: ''
					});
			},

			// 删除元素
			itemDel(index) {
				this.basisPunishment.splice(index, 1);
			},
			
			// 表单提交
			dataFormSubmit() {
				if(this.basisPunishment[0].userId) {
					for(let i = 0; i < this.basisPunishment.length; i++) {
						this.dataForm.userId = this.basisPunishment[i].userId;
						this.dataForm.name = this.basisPunishment[i].name;
						if(!this.dataForm.position) this.dataForm.position = this.basisPunishment[i].position;
						this.dataForm.id ? this.method = 'put' : this.method = 'post'
						this.$refs['dataForm'].validate((valid) => {
							if (valid) {
								addMeetingmember(this.dataForm,this.method).then(data=> {
										if (data && data.status === 200) {
											this.$notify({
												message: '操作成功',
												type: 'success',
												duration: 1500,
												onClose: () => {
													this.visible = false
													this.$emit('refreshDataList')
												}
											})
										} else {
											this.$notify.error(data.msg)
										}
								})
							}
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-member {
		display: flex;
		margin-bottom: 10px;

		.form-member-select-id {
			width: 42%;
		}

		.form-member-post-id {
			width: 42%;
    		margin-left: 16px;
		}

		.form-member-select {
			width: 38%;
		}

		.form-member-post {
			width: 38%;
			margin-left: 20px;
		}

		.item-btn {
			// position: absolute;
			width: 5%;
    		min-width: 80px;
			// top: 11px;
			right: -25px;
			padding: 0 10px;

			.btn-info,
			.btn-info {
				font-size: 17px;
				margin-right: 10px;
			}

			.btn-info:hover {
				font-weight: bold;
				color: #000;
				cursor: pointer;
			}
		}
	}
</style>
