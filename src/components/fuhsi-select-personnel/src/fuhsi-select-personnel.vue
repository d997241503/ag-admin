<template>
	<el-dialog :title="`选择${title}`" :visible.sync="visible" width="900px" :close-on-click-modal="false"
		:close-on-press-escape="false" :before-close="handleClose" append-to-body :fullscreen="isFullscreen">
        <template slot="title">
            <div class="dialog-header-wrapper">
                <span class="el-dialog__title">{{`选择${title}`}}</span>
                <img class="icon" src="~@/assets/icons/fullscreen.png" @click="isFullscreen = !isFullscreen" alt="">
            </div>
        </template>
		<div :class="['fuhsi-dialog-body', isFullscreen ? 'full-screen' : '']">
			<div class="tree-content">
				<!-- 部门 -->
				<el-input :placeholder="placeholder" size="small" v-model="filterText" clearable>
				</el-input>
				<!-- {{dataList}} -->
				<div class="selector-tree-content" v-loading="!treeVisible">
					<!-- <el-tree style="tree-info" class="mar-top tree-roll-containers" :data="dataList" :props="defaultProps" node-key="id"
					 :default-expand-all="allNodeVisible" :expand-on-click-node="false" @node-click="handlePartyBranch">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<span v-bind:class="{'el-icon-s-custom': node.level == 1, 'el-icon-user': node.level == 2, 'el-icon-user-solid': node.level > 2}">&nbsp;<span
								style="font-family: 'font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;">{{ node.label }}</span>&nbsp;&nbsp;</span>
						</span>
					</el-tree> -->
					<el-tree v-if="treeVisible" ref="tree" class="roll-containers" :empty-text="emptyText"
						:data="dataList" :props="defaultProps" :show-checkbox="showCheckbox" node-key="id"
						:default-checked-keys="[]" :highlight-current="!showCheckbox" :expand-on-click-node="false"
						:current-node-key="currentNodeKey" :filter-node-method="filterNode"
						:default-expanded-keys="expandedKeysID" @node-click="deptHandleNodeClick"
						@check-change="handleCheckChange" @check="handleCheck">
						<div class="show-one-line"
							:class="{'tree-title': node.level == '1' ,'dept-text': !node.data.isPerson,'user-text': node.data.isPerson,}"
							slot-scope="{ node, data }">{{ node.label }}</div>
					</el-tree>
				</div>
				<!-- 人员 -->
				<el-input :placeholder="placeholderUser" size="small" v-model="userFilterText" clearable style="margin-top: 20px;" @input="getUserDataList" :readonly="!deptId">
				</el-input>
				<div class="selector-tree-content" v-loading="!treeVisible">
					<!-- <el-tree v-if="treeVisible" ref="userTree" class="roll-containers" :empty-text="emptyText"
						:data="userDataList" :props="defaultProps" :show-checkbox="showCheckbox" :node-key="nodeKey"
						:default-checked-keys="checkedKeys" :highlight-current="!showCheckbox"
						:current-node-key="currentNodeKey" :filter-node-method="filterNode"
						:default-expanded-keys="expandedKeys" @node-click="userHandleNodeClick"
						@check-change="handleCheckChange" @check="handleCheck">
						<div class="show-one-line"
							:class="{'tree-title': node.level == '1' ,'dept-text': !node.data.isPerson,'user-text': node.data.isPerson,}"
							slot-scope="{ node, data }">{{ node.label }}</div>
					</el-tree> -->
					<el-table class="roll-containers" :data="userDataList" v-loading="listLoading"  @row-click="userHandleNodeClick"  
					border highlight-current-row style="width: 100%;font-size: 15px;" node-key="userId"
					size="mini">
						<el-table-column align="center" type="index" label="序号" width="60">
						</el-table-column>
						<el-table-column align="center" label="姓名">
							<template slot-scope="scope">
								<span>{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="职务">
							<template slot-scope="scope">
								<span>{{scope.row.position}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="部门">
							<template slot-scope="scope">
								<span>{{scope.row.organizationName}}</span>
							</template>
						</el-table-column> -->
						<!-- <el-table-column fixed="right" align="center" label="操作" width="100">
							<template slot-scope="scope">
								<el-button size="small" @click="selectedHandle(scope.row)">选择</el-button>
							</template>
						</el-table-column> -->
					</el-table>
				</div>
			</div>
			<div class="data-content">
				<div class="data-header">
					<div v-if="choiceSingle" class="left">可选择1人</div>
					<div v-else class="left">已选：{{resultList ? resultList.length : 0}}人</div>
					<div class="right">
						<el-button class="btn" type="text" @click="clearDataHandle()">清空</el-button>
					</div>
				</div>
				<!-- 已选择人员搜索 -->
				<el-input placeholder="请输入姓名搜索" size="small" v-model="useredText" clearable @input="useredDataList" :readonly="!resultList.length"></el-input>
				<div class="selector-tree-content result">
					<div class="result-wrap">
						<!-- <div class="cell" v-for="item in resultList" :key="item[nodeKey]">
							<div class="cell-content" :title="item[defaultProps.label]">
								{{ item[defaultProps.label] }}
							</div>
							<i class="el-icon-close" @click="removeResult(item)"></i>
						</div> -->
						<div v-if="!useredText">
							<div class="cell" v-for="(item,index) in resultList" :key="index">
								<div class="cell-content" :title="item.deptName === item.orgName ? item.orgName : `${item.name} - ${item.deptName} - ${item.orgName}`">
									<span v-if="!item.deptName && !item.orgName">{{item.name}}</span>
									<span v-if="item.deptName === item.orgName">{{ item.deptName }}</span>
									<span v-else>{{ item.name }} - {{ item.deptName }} - {{ item.orgName }}</span>
								</div>
								<i class="el-icon-close" @click="removeResult(item)"></i>
							</div>
							<!-- 暂无数据 -->
							<div class="el-tree__empty-block" v-if="resultList && !resultList.length">
								<span class="el-tree__empty-text">{{ emptyText }}</span>
							</div>
						</div>
						<div v-else>
							<div class="cell" v-for="(item,index) in searchData" :key="index">
								<div class="cell-content" :title="item.deptName === item.orgName ? item.orgName : `${item.name} - ${item.deptName} - ${item.orgName}`">
									<span v-if="!item.deptName && !item.orgName">{{item.name}}</span>
									<span v-if="item.deptName === item.orgName">{{ item.deptName }}</span>
									<span v-else>{{ item.name }} - {{ item.deptName }} - {{ item.orgName }}</span>
								</div>
								<i class="el-icon-close" @click="removeResult(item)"></i>
							</div>
							<!-- 暂无数据 -->
							<div class="el-tree__empty-block" v-if="searchData && !searchData.length">
								<span class="el-tree__empty-text">{{ emptyText }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="dialog-footer" align="center">
			<el-button @click="handleClose()" size="small">取消</el-button>
			<el-button type="primary" @click="submitData()" size="small">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		matchingTreeData
	} from '@/utils';
	import {
		getTree,
		getUser
	} from 'api/admin/department/index';
	export default {
		name: 'fuhsiSelectPersonnel',
		data() {
			return {
				listLoading: false,
				visible: false,
				treeVisible: true,
				showId: undefined, // 当前显示的党支部/部门
				disabledList: [], // 禁选人员
				resultList: [],
				oldResultList: [],
				showPersonnelName: '',
				parentNodes: [],
				expandedKeys: null,
				dataList: [],
				userDataList: [],
				filterText: '',
				keyStr: 'MEMBER',
				deptId: undefined,
				userFilterText: '',
				label: '',
				isFullscreen: false,
				personIndex: undefined,
				useredText: '',
				searchData: [],
				expandedKeysID: []
			}
		},

		props: {
			// 默认勾选的节点的数组
			defaultChecked: Array,
			// 提示信息
			title: {
				type: String,
				default: '人员'
			},
			// 搜索框提示语
			placeholder: {
				type: String,
				default: '请输入部门搜索'
			},
			placeholderUser: {
				type: String,
				default: '请输入姓名搜索'
			},
			emptyText: {
				type: String,
				default: '暂无数据'
			},
			nodeKey: {
				type: String,
				default: 'idStr'
			},
			// 人员Id
			baseId: {
				type: String,
				default: 'id'
			},
			// 组织人员类型 party：党组织；dept:部门
			userType: {
				type: String,
				default: 'party'
			},
			// 多选 true ,单选 false
			showCheckbox: {
				type: Boolean,
				default: false
			},
			// 人员选择是否单选
			choiceSingle: {
				type: Boolean,
				default: false
			},
			// 默认选中
			defaultSelected: {
				type: String,
				default: ''
			},
			defaultProps: {
				type: Object,
				default: () => {
					return {
						children: 'children',
						label: 'departmentFullName'
					}
				}
			}
		},
		watch: {
			defaultChecked: {
				handler(newVal, oldVal) {
					// this.resultList = JSON.parse(JSON.stringify(newVal || '[]'));
					// this.oldResultList = JSON.parse(JSON.stringify(newVal || '[]'));
				},
				immediate: true
			},
			filterText(val) {
				this.$refs.tree.filter(val);
			},
			// userFilterText(val) {
			// 	this.$refs.userTree.filter(val);
			// }
		},
		computed: {
			// // 【多选模式】 默认勾选的节点的 key 的数组
			// checkedKeys() {
			// 	return this.resultList.map(value => this.keyStr + value[this.baseId])
			// },
			// 【单选模式】默认选中的节点的 key
			currentNodeKey() {
				let _tmp = ''
				if (!this.showCheckbox && this.resultList && this.resultList.length) {
					_tmp = this.keyStr + this.resultList[0][this.baseId]
				}
				return _tmp
			}
		},
		methods: {
			// 初始化
			init() {
				this.userDataList = [];
				this.expandedKeys = [];
				Promise.all([
					this.getDataList()
				]).then(() => {
					this.parentNodes = this.filterParent(this.dataList);
					this.visible = true;
					this.$nextTick(() => {
						this.$refs.tree.setCurrentKey(null);
						this.dataList.forEach(item => {
							this.expandedKeys.push(item[this.nodeKey]);
						})
					})
				})
			},

			// 获取树数据
			getDataList() {
				// 获取部门树
				getTree()
					.then(res => {
						if (res && res.code === 0) {
							// this.treeData = res.data ? res.data : [];
							if (this.showId) {
								let treeData = res.data;
								// 筛选指定树节点
								this.dataList = matchingTreeData(this.nodeKey, this.showId, treeData) || [];
							} else
								this.dataList = res.data;
								if(this.defaultSelected) {
									this.$nextTick(() => {
										this.$refs.tree.setCurrentKey(this.defaultSelected);
										this.$nextTick(() => {
											// 获取当前节点
											let currentNode = this.$refs.tree.getNode(this.defaultSelected);
											// 获取父节点 id
											let parentId = currentNode.data.parentId;
											let node = this.$refs.tree.getNode(parentId);
											this.expandedKeysID = this.getDescendantIds(node);
										})
										this.deptId = this.defaultSelected;
										this.getUserDataList();
									})
								}
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
						}
					});
				// // 党组织类型/部门类型
				// let key = this.userType == 'dept' ? 'DEPT_USERS' : 'PARTY_USERS'; // 缓存数据主键
				// if (this.showId) {
				// 	let treeData = JSON.parse(sessionStorage.getItem(key));
				// 	// 筛选指定树节点
				// 	this.dataList = matchingTreeData(this.nodeKey, this.showId, treeData) || [];
				// } else
				// 	this.dataList = JSON.parse(sessionStorage.getItem(key));
			},

			getDescendantIds(node) {
				let descendants = [];
				if (node.data !== undefined && node.data.children !== undefined && node.data.children.length > 0) {
					node.data.children.forEach(child => {
						descendants.push(child.id);
						this.getDescendantIds(child);
					});
				}
				return descendants;
			},

			// 获取部门人员
			getUserDataList() {
				this.listLoading = true;
				getUser(this.deptId,{ name: this.userFilterText })
					.then(res => {
						if (res && res.status === 200) {
							// this.treeData = res.data ? res.data : [];
							// if (this.showId) {
							// 	let treeData = res.data;
							// 	// 筛选指定树节点
							// 	this.userDataList = matchingTreeData(this.nodeKey, this.showId, treeData) || [];
							// } else
								this.userDataList = res.data;
								this.listLoading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取人员失败",
								type: 'error',
								duration: 2000
							});
							this.listLoading = false;
						}
					});
			},

			// 获取所有父节点,并设置禁用项
			filterParent(data, list = []) {
				const ListKey = this.defaultProps['children']
				data.forEach(value => {
					if (value.isPerson && this.disabledList.length && this.disabledList.find(item => item[this
								.baseId] ==
							value[this.baseId])) this.$set(value, "disabled", true);
					if ((!value[ListKey] || !value[ListKey].length) && !value.isPerson) this.$set(
						value, "disabled", true);
					if (value[ListKey] && value[ListKey].length && !value.isPerson) {
						this.filterParent(value[ListKey], list);
						list.push(value);
					}
				})
				return list
			},

			// 获取所有的子元素的key
			// filterChildrenKeys(childrens, list = []) {
			//   const ListKey = this.defaultProps['children']
			//   childrens.forEach(value => {
			//     if (value[ListKey] && value[ListKey].length) this.filterChildrenKeys(value[ListKey], list)
			//     list.push(value[this.nodeKey])
			//   })
			//   return list
			// },

			// 删除选中的数据
			removeResult(item) {
				// 【单选】清除当前选中状态
				// if (!this.showCheckbox) this.$refs.tree.setCurrentKey()
				// 删除子菜单
				// this.resultList = this.resultList.filter(val => val[this.userId] !== item[this.userId])
				this.resultList = this.resultList.filter(val => val.userId !== item.userId)
				this.searchData = this.searchData.filter(val => val.userId !== item.userId)
				// for(let i = this.resultList)
				// 设置某个节点的勾选状态
				// this.$refs.tree.setChecked(this.keyStr + item[this.baseId], false, true)
			},

			// 点击获取部门当前菜单(单选会触发当前前方法)
			deptHandleNodeClick(data) {
				this.deptId = data.id;
				this.getUserDataList();
				// if (!this.showCheckbox) {
				// 	this.resultList = []
				// 	if(data.isPerson) this.resultList.push(data)
				// }
			},

			// 点击获取人员当前菜单(单选会触发当前前方法)
			userHandleNodeClick(data) {
				// if (!this.showCheckbox) {
				// 	this.resultList = []
				// 	if(data.isPerson) this.resultList.push(data)
				// }
				// this.resultList = []
				// console.log("this.resultList",this.resultList)
				if(!this.resultList) this.resultList = [];
				if(this.choiceSingle) {
					if(this.resultList && this.resultList.length) {
						this.resultList[0] = data;
						this.$forceUpdate();
					} else {
						this.resultList.push(data)
					}
				} else if (!this.unique(data)) {
					this.resultList.push(data)
					// console.log("this.resultList",this.resultList)
				} else this.$message.info('请勿重复添加');
			},

			// 查重
			unique(data) {
				let ary = [];
				ary = this.resultList.filter(item => {
					return item.userId == data.userId
				})
				return ary.length ? true : false
			},

			// 节点选中状态发生变化时的回调
			handleCheckChange(data, checked, indeterminate) {
				// console.log('handleCheckChange:', data, checked, indeterminate);
			},

			// 当复选框被点击的时候触发
			handleCheck(current, data) {
				// 保存树节点外的人员数据
				let outsideData = [];
				// 筛选所选人员数据
				this.parentNodes.forEach(value => {
					data.checkedNodes = data.checkedNodes.filter(menu => menu[this.nodeKey] !== value[this
						.nodeKey] && menu.isPerson)
				})
				// 筛选树节点外的人员数据
				this.resultList.forEach(item => {
					if (!(matchingTreeData(this.nodeKey, this.keyStr + item[this.baseId], this.dataList, true) || []).length)
						outsideData.push(item)
				})
				this.resultList = [...outsideData, ...data.checkedNodes];
			},

			// 树节点进行筛选时执行的方法
			filterNode(value, data) {
				if (!value) return true
				return data[this.defaultProps.label].indexOf(value) !== -1
			},

			// 已选择人员搜索
			useredDataList() {
				if(this.useredText){
					const key = this.useredText; // 查询表单中的输入
					const vm = this;
					this.searchData = []; //清空查询数组-防止多次查询记录一直被push在最后
					this.resultList.forEach(function (item) {
						if (item.name.indexOf(key) > -1) {
							vm.searchData.push(item);
						}
					});
				}
			},

			// 提交
			submitData() {
				// if (!this.resultList.length) return this.$message.warning('请选择选择' + this.title);
				let hintStr = `确定选择以上${this.title}?`;
				if (!this.resultList.length) hintStr = `当前未选择${this.title}，是否继续?`;
				this.$confirm(hintStr, "提示", {
					confirmButtonText: '确 定',
					cancelButtonText: '取 消',
					type: 'warning'
				}).then(() => {
					let resultListData = {
						resultList: this.resultList,
						label: this.label,
						personIndex: this.personIndex
					}
					this.$emit('update:defaultChecked', resultListData);
					this.$emit('refreshData');
					this.filterText = "";
					this.userFilterText = "";
					this.useredText = "";
					this.resultList = [];
					this.searchData = [];
					this.userDataList = [];
					this.visible = false;
				}).catch(() => {})
			},

			// 清空选中数据
			clearDataHandle() {
				this.useredText = '';
				this.resultList = [];
				this.searchData = [];
				this.userDataList = [];
				// this.treeVisible = false;
				// setTimeout(() => {
				// 	this.treeVisible = true;
				// 	this.getDataList()
				// }, 1)
			},

			handleClose(done) {
				this.filterText = "";
				this.userFilterText = "";
				this.useredText = "";
				this.resultList = this.oldResultList;
				this.searchData = [];
				if (done) done();
				this.visible = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fuhsi-dialog-body {
		min-height: 500px;
		border: 0.0625rem solid #efefee;
		margin: 0 20px;
		border-radius: 5px;
		display: flex;

        &.full-screen {
            .roll-containers {
                height: 295px !important;
                max-height: 295px !important;
            }
            .result-wrap {
                height: 630px !important;
            }
        }

		.tree-content {
			width: 50%;
			padding: 20px 20px 20px 20px;

			.selector-tree-content {
				margin-top: 5px;

				.roll-containers {
					height: 200px;
					max-height: 200px;
    				overflow: auto;

					/* 只展示一行 */
					.show-one-line {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					/deep/ tbody tr:hover>td { 
						cursor: pointer;
					}	
				}

				.tree-title {
					font-size: 15px !important;
					font-weight: bold;
				}

				.dept-text {
					font-size: 15px;
					color: #222;
				}

				.user-text {
					font-size: 13px;
					font-weight: bold;
					color: #888;
				}
			}
		}

		.data-content {
			width: 50%;
			padding: 20px 10px 20px 20px;
			border-left: 0.0625rem solid #efefee;

			.data-header {
				display: flex;

				.left {
					text-align: left;
					width: 50%;
					font-size: 15px;
					font-weight: bold;
				}

				.right {
					text-align: right;
					width: 50%;

					.btn {
						font-size: 15px;
						margin-top: -15px;
					}
				}
			}

			.selector-tree-content {

				.result-wrap {
					height: 100%;
					overflow: auto;
					height: 455px;

					.cell {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 10px;
						color: #333;
						line-height: 32px;
						border-radius: 5px;
						font-size: 15px;

						&-content {
							overflow: hidden; //隐藏文字
							text-overflow: ellipsis; //显示...
							white-space: nowrap; //不换行
						}

						.el-icon-close {
							padding: 2px;
							color: #000000;
							font-size: 18px;
							cursor: pointer;
							border-radius: 5px;
						}

						.el-icon-close:hover {
							background-color: #e8e8e7;
						}
					}

					.cell:hover {
						background-color: #F5F7FA;
					}

					.empty-block {
						position: relative;
						min-height: 60px;
						text-align: center;
						width: 100%;
						height: 100%;
						color: #909399;
						font-size: 14px;

						.empty-text {}
					}
				}

			}
		}
	}

	.num-text {
		font-weight: bold;
	}

	.dialog-footer {
		border-top: 0.0625rem solid #F2F2F2;
		padding: 20px;
		margin-top: 20px;
		
		button {
			height: 36px;
			padding: 0 30px;
			font-size: 15px;
		}
	}

    .dialog-header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
            width: 22px;
            margin-right: 30px;
            cursor: pointer;
        }
    }
</style>
