<template>
	<el-row :gutter="10">
		<el-col :span="24">
			<el-button type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
		</el-col>
		<el-col :span="8" style='margin-top:10px;'>
			<el-form size="mini" :inline="true">
				<el-form-item label="关键字">
					<el-input v-model="filterText" suffix-icon="el-icon-search" clearable></el-input>
				</el-form-item>
			</el-form>
			<el-tree class="filter-tree" check-strictly :data="treeData" show-checkbox
				node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree"
				@node-click="getNodeData" default-expand-all>
			</el-tree>
		</el-col>
		<el-col :span="16" style='margin-top:15px;'>
			<el-table ref="elementTable" :data="list" border fit highlight-current-row @selection-change="selectionChange"
				@select-all="handleSelectAllChange" @select="handleSelectionChange" max-height="550px" row-key="id"
				style="width: 100%">
				<el-table-column v-if="groupManager_element" :reserve-selection="true" type="selection" width="55"> </el-table-column>
				<el-table-column min-width="200px" align="center" label="资源编码"><template slot-scope="scope">
						<span>
							{{scope.row.code}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="150px" align="center" label="资源类型"><template slot-scope="scope">
						<span>
							{{scope.row.type}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="200px" align="center" label="资源名称"><template slot-scope="scope">
						<span>
							{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column width="200px" align="center" label="资源地址"><template slot-scope="scope">
						<span>
							{{scope.row.uri}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="资源请求类型"><template slot-scope="scope">
						<span>
							{{scope.row.method}}</span>
					</template>
				</el-table-column> -->
			</el-table>
		</el-col>

	</el-row>

</template>
<script>
	import {
		fetchTree
	} from 'api/admin/menu/index';
	import {
		page
	} from 'api/admin/element/index';
	import {
		editElementAuthority,
		removeElementAuthority,
		addElementAuthority,
		getElementAuthority,
		modifyMenuAuthority,
		getMenuAuthority
	} from 'api/admin/group/index';
	import {
		getUserMenu,
		editUserMenu,
		getUserElement,
		editUserElement
	} from 'api/admin/user/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		// name: 'menu',
		props: {
			userId: {
				default: '1'
			}
		},
		data() {
			return {
				filterText: '',
				list: null,
				total: null,
				listQuery: {
					name: undefined,
					page: 1,
					limit: 999
				},
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				groupManager_menu: false,
				groupManager_element: false,
				idsSelected: []
			}
		},
		watch: {
			filterText(val) {
				this.$refs.menuTree.filter(val);
			}
		},
		created() {
			this.getList();
			this.groupManager_menu = this.elements['groupManager:menu'];
			this.groupManager_element = this.elements['groupManager:element'];
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		methods: {
			getUserElementList() {
				getUserElement(this.userId).then(data => {
					if(data.data && data.data.length) this.idsSelected = data.data;
					else this.idsSelected = [];
					this.list = [];
					const obj = {};
					// for (let i = 0; i < this.list.length; i++) {
					// 	obj[this.list[i].id] = this.list[i];
					// }
					const toggle = {};
					for (let i = 0; i < data.data.length; i++) {
						const id = data.data[i]
						if (obj[id] !== undefined && toggle[id] === undefined) {
							this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
							toggle[id] = true;
						}
					}
				});
			},
			getList() {
				fetchTree(this.listQuery).then(data => {
					this.treeData = data;
					this.initAuthoritys();
				});
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			getNodeData(data) {
				// if(this.listQuery.menuId === data.id) return;
				this.listQuery.menuId = data.id;
				page(this.listQuery).then(response => {
					this.list = response.data.rows;
					getUserElement(this.userId).then(data => {
						this.$nextTick(() => {
							this.$refs.elementTable.clearSelection();
						},100)
						const obj = {};
						for (let i = 0; i < this.list.length; i++) {
							obj[this.list[i].id] = this.list[i];
						}
						const toggle = {};
						for (let i = 0; i < data.data.length; i++) {
							// this.idsSelected.push(data.data[i])
							const id = data.data[i]
							if (obj[id] !== undefined && toggle[id] === undefined) {
								this.$nextTick(() => {
									this.$refs.elementTable.toggleRowSelection(obj[data.data[i]],true);
									toggle[id] = true;
								},500)
							}
						}
					});
				});
				this.currentId = data.id;
				this.showElement = true;
			},
			getTreeNodeKey(node) {
				return node.id;
			},
			handleSelectAllChange(val) {
				if(val.length == 0) {
					for(let i = 0; i < this.list.length; i++) {
						if(this.unique(this.list[i].id)) {
							this.idsSelected.splice(this.idsSelected.indexOf(this.list[i].id), 1)
						}
					}
				} else {
					for(let i = 0; i < val.length; i++) {
						if(!this.unique(val[i].id)) {
							this.idsSelected.push(val[i].id)
						}
					}
				}
				// var ids = val.map(item => {
				// 	return item.id
				// })
				// editUserElement(this.userId, ids);
			},
			handleSelectionChange(val, row) {
				if(this.unique(row.id)) {
					this.idsSelected.splice(this.idsSelected.indexOf(row.id), 1)
				} else {
					this.idsSelected.push(row.id)
				}
				// editUserElement(this.userId, [row.id]);
			},
			// 查重
			unique(id) {
				let ary = [];
				ary = this.idsSelected.filter(item => {
					return item == id
				})
				return ary.length ? true : false
			},
			selectionChange(val) {
				// this.idsSelected = val.map(item => {
				// 	return item.id
				// })
			},
			update() {
				// this.$emit('closeAuthorityDialog');
				const nodes = this.$refs.menuTree.getCheckedNodes();
				const ids = nodes.map(item => {
					return item.id
				});
				editUserElement(this.userId, this.idsSelected);
				editUserMenu(this.userId, ids).then(() => {
					this.$notify({
						title: '成功',
						message: '操作成功',
						type: 'success',
						duration: 2000
					});
				});
			},
			initAuthoritys() {
				getUserMenu(this.userId).then(data => {
					const result = data.data || [];
					this.$refs.menuTree.setCheckedKeys(result);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.filter-tree {
		margin-top: 10px;
		height: 500px;
		overflow: auto;
	}
</style>
