<template>
	<el-dialog :title="`${type == 'dept' ? '部门' : '用户'}权限`" :visible.sync="visible" width="900px" :close-on-click-modal="false"
		:close-on-press-escape="false" :before-close="handleClose">
		<div class="fuhsi-dialog-body">
			<el-tabs v-model="activeName">
				<el-tab-pane label="权限配置" name="first">
					<el-form size="mini" :inline="true">
						<el-form-item :label="$t('keyword')">
							<el-input v-model="filterMenuText" suffix-icon="el-icon-search" clearable></el-input>
						</el-form-item>
					</el-form>
					<div class="row-header_">
						<div class="column-first">菜单名称</div>
						<div class="column-second">类型</div>
					</div>
					<el-tree class="filter-tree roll-containers_" :data="menuList" show-checkbox
						:props="{ label: 'name', children: 'children' }" :filter-node-method="filterNode"
						:highlight-current="true" node-key="id" ref="menuListTree">
						<div class="custom-tree-node" slot-scope="{ node, data }">
							<div class="column-first"
								:class="{'tree-text-0': node.data.type === 0,'tree-text-1': node.data.type === 1,}">
								{{ node.label }}
							</div>
							<div class="column-second">
								<el-tag v-if="node.data.type === 0" size="small">{{ $t('menu.type0') }}</el-tag>
								<el-tag v-else size="small" type="info">{{ $t('menu.type1') }}</el-tag>
							</div>
						</div>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="管辖党组织范围" name="second">
					<el-form size="mini" :inline="true">
						<el-form-item :label="$t('keyword')">
							<el-input v-model="filterPartyText" suffix-icon="el-icon-search" clearable></el-input>
						</el-form-item>
					</el-form>
					<el-tree class="filter-tree roll-containers_" :data="partyList"
						:default-expanded-keys="expandedKeys" show-checkbox :check-strictly="false"
						:props="{ label: 'name', children: 'children' }" :filter-node-method="filterNode"
						:highlight-current="true" node-key="id" ref="partyListTree">
						<div class="show-one-line" slot-scope="{ node, data }">{{ node.label }}</div>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="管辖行政组织范围" name="third">
					<el-form size="mini" :inline="true">
						<el-form-item :label="$t('keyword')">
							<el-input v-model="filterDeptText" suffix-icon="el-icon-search" clearable></el-input>
						</el-form-item>
					</el-form>
					<el-tree class="filter-tree roll-containers_" :data="deptList"
						:default-expanded-keys="expandedKeysDept" show-checkbox :check-strictly="false"
						:props="{ label: 'name', children: 'children' }" :filter-node-method="filterNodeDept"
						:highlight-current="true" node-key="id" ref="deptListTree">
						<div class="show-one-line" slot-scope="{ node, data }">{{ node.label }}</div>
					</el-tree>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="dialog-footer" align="center">
			<el-button @click="handleClose()" size="small">{{ $t('cancel') }}</el-button>
			<el-button type="primary" @click="commitHandle()" size="small">{{ $t('confirm') }}</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import debounce from 'lodash/debounce';
	export default {
		data() {
			return {
				visible: false,
				type: 'dept', // dept:部门 user:用户
				apiUrl: '',
				activeName: 'first',
				filterMenuText: '',
				filterPartyText: '',
				filterDeptText: '',
				expandedKeys: null,
				expandedKeysDept: null,
				menuList: [],
				partyList: [],
				deptList: [],
				dataForm: {
					deptId: undefined,
					menuIds: [],
					partyResources: [],
					deptResources: []
				}
			}
		},

		watch: {
			filterMenuText(val) {
				this.$refs.menuListTree.filter(val);
			},
			filterPartyText(val) {
				this.$refs.partyListTree.filter(val);
			},
			filterDeptText(val) {
				this.$refs.deptListTree.filter(val);
			},
		},

		methods: {
			init(id, type) {
				this.type = type;
				if (this.type == 'dept') {
					this.dataForm.deptId = id;
					this.apiUrl = '/sys/deptPermission/update';
				} else this.apiUrl = `/sys/userPermission/updateUserAuth/${id}`;
				this.expandedKeys = null;
				if (this.$refs.partyListTree) {
					this.$refs.partyListTree.setCurrentKey(null);
				}
				if (this.$refs.deptListTree) {
					this.$refs.deptListTree.setCurrentKey(null);
				}
				Promise.all([
					this.getMenuList(),
					this.getPartyList(),
					this.getDeptList()
				]).then(() => {
					this.visible = true;
					if (id) {
						this.getInfo(id);
					}
				})
			},

			filterNode(value, data) {
				if (!value) return true
				return data.name.indexOf(value) !== -1
			},

			filterNodeDept(value, data) {
				if (!value) return true
				return data.name.indexOf(value) !== -1
			},

			// 获取菜单
			getMenuList() {
				return this.$http.get('/sys/menu/authList').then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.menuList = res.data;
				}).catch(() => {})
			},

			// 获取党组织
			getPartyList() {
				return this.$http.get(`/sys/dept/treeList/1`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.partyList = res.data;
				}).catch(() => {})
			},

			// 获取行政组织
			getDeptList() {
				return this.$http.get(`/sys/dept/treeList/0`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.deptList = res.data;
				}).catch(() => {})
			},

			// 获取详情
			getInfo(id) {
				this.$http.get(`/sys/${this.type == 'dept' ? 'deptPermission/info' : 'userPermission/authInfo'}/${id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.$nextTick(() => {
						this.dataForm = res.data;
						this.dataForm.menuIds.forEach(item => this.$refs.menuListTree.setChecked(item,
							true));
						if (this.partyList && this.partyList.length) {
							this.expandedKeys = this.dataForm.partyResources && this.dataForm
								.partyResources.length ? this.dataForm
								.partyResources : [this.partyList[0].id];
							this.$refs.partyListTree.setCheckedKeys(this.dataForm.partyResources);
						}
						if (this.deptList && this.deptList.length) {
							this.expandedKeysDept = this.dataForm.deptResources && this.dataForm
								.deptResources.length ? this.dataForm
								.deptResources : [this.deptList[0].id];
							this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptResources);
						}
					})
				}).catch(() => {})
			},

			// 提交数据
			commitHandle: debounce(function(data) {
				this.dataForm.menuIds = [
					...this.$refs.menuListTree.getHalfCheckedKeys(),
					...this.$refs.menuListTree.getCheckedKeys()
				]
				this.dataForm.partyResources = this.$refs.partyListTree.getCheckedKeys();
				this.dataForm.deptResources = this.$refs.deptListTree.getCheckedKeys();
				this.$http.put(
					this.apiUrl, this.dataForm).then(
					({
						data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 500,
							onClose: () => {
								this.handleClose();
							}
						})
					}).catch(() => {})
			}, 1000, {
				'leading': true,
				'trailing': false
			}),

			handleClose(done) {
				this.filterMenuText = "";
				this.filterPartyText = "";
				this.filterDeptText = "";
				this.activeName = "first";
				this.dataForm.deptId = undefined;
				this.$refs.menuListTree.setCheckedKeys([]);
				if (done) done();
				this.visible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		width: 220px;
		margin-bottom: 10px;
	}

	.fuhsi-dialog-body {
		min-height: 440px;

		.row-header_ {
			border: 0.0625rem solid #EBEEF5;
			background-color: #F5F7FA;
			height: 36px;
			width: 100%;
			display: flex;
			text-align: center;
			line-height: 36px;
			font-size: 16px;
			font-weight: bold;

			.column-first {
				flex: 1;
			}

			.column-second {
				width: 160px;
				border-left: 0.0625rem solid #EBEEF5;
			}
		}

		.roll-containers_ {
			max-height: 300px;
			padding: 10px;
			overflow: auto;

			.custom-tree-node {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 8px;

				.column-first {
					flex: 1;
				}

				.column-second {
					width: 120px;
					text-align: center;
				}

				.tree-text-0 {
					font-size: 17px;
					color: #333;
				}

				.tree-text-1 {
					font-size: 16px;
					color: #777;
				}
			}

			::v-deep .el-tree-node__content {
				height: 33px !important;
			}
		}
	}

	.num-text {
		font-weight: bold;
	}
</style>
