<template>
	<div class="app-container calendar-list-container nav-content" @click="OptionCardClose">
		<div class="page-right">
			<div class="tree-info" ref="tree-info">
				<tree @refreshDataTree="treeHandle" ref="tree"></tree>
			</div>
			<div class="page-info-img" ref="pageInfo" style="flex: 1;margin-left: 20px;">
				<div style="font-size: 14px;padding: 20px 0px 0px 20px;">
					<span v-if="type == 'edit'">编辑</span>
					<span v-if="type == 'add'">添加下级</span>
				</div>
				<div v-if="form.id && isshow" style="padding: 50px 120px;">
					<div v-if="type == 'edit'">
						<el-input style="width: 100%;" v-model="form.name"></el-input>
						<div class="pagination-container" style="text-align: center;">
							<el-button type="primary" @click="cancel">取消</el-button>
							<el-button type="primary" @click="updataDataFormSubmit">保存</el-button>
						</div>
					</div>
					<div v-if="type == 'add'">
						<el-input style="width: 100%;" v-model="name"></el-input>
						<div class="pagination-container" style="text-align: center;">
							<el-button type="primary" @click="cancel">取消</el-button>
							<el-button type="primary" @click="addDataFormSubmit">保存</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		updataFormtype,
		addFormtype
	} from 'api/bpm/categoryMan';
	import {
		mapGetters
	} from 'vuex';
	import tree from "./components/folder";
	export default {
		name: "informationCom",
		data() {
			return {
				isReadonly: true,
				popoverVisibel: false,
				loading: true,
				listLoading: true,
				listQuery: {
					value: ''
				},
				archivesNum: '',
				deptName: '',
				form: {},
				fileArray1: [],
				value: '',
				baseParentId: undefined,
				formEdit: true,
				isshow: false,
				type: '',
				name: ''
			}
		},
		
		props: {
			tabPosition: {
				type: String
			}
		},
        
        watch: {
			tabPosition(newVal, oldVal) {
				this.tabPosition = newVal;
			},
		},

		components: {
			tree
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		created() {
		},
		methods: {
			// 点击部门刷新列表数据
			treeHandle(val,type) {
				this.form = {...val};
				if(type) {
					this.isshow = true;
					this.type = type;
				}
				if(type == 'add') {
					this.name = '';
				}
            },
            OptionCardClose(event) {
                var currentCli = document.getElementById("option-button-group");
                if (currentCli) {
                    if (!currentCli.contains(event.target)) { //点击到了id为option-button-group以外的区域，就隐藏菜单
                        this.$refs.tree.optionCardShow = false;
                    }
                }
			},
			
			cancel() {
				this.type = '';
				this.isshow = false;
				this.form = {};
			},

			// 保存 - 编辑
			updataDataFormSubmit() {
				// this.form.secondType = '1';
				updataFormtype(this.form)
				 .then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.$refs.tree.getTreeInfo();
								this.type = '';
								this.form.name = '';
								this.isshow = false;
								this.form = {};
							}, 1000)
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '失败',
							type: 'error',
							duration: 1000
						});
					})
			},

			// 保存 - 添加
			addDataFormSubmit() {
				this.form.name = this.name;
				this.form.parentId = this.form.id;
				this.form.id = '';
				addFormtype(this.form)
				 .then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.$refs.tree.getTreeInfo();
								this.type = '';
								this.name = '';
								this.isshow = false;
								this.form = {};
							}, 1000)
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '失败',
							type: 'error',
							duration: 1000
						});
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-info-img {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		// padding: 50px 120px;
        background-color: #FFFFFF;
        
        img {
            width: 100%;
            height: 100%;
        }

		.file-info {
			display: flex;

			.file-img {
				width: 30px;
				// margin-top: 5px;

				img {
					width: 25px;
					height: 25px
				}
			}

			.file-text {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: #555555;
				text-align: left;
				margin-left: 5px;
			}

			.file-download {
				width: 50px;
				text-align: center;
				color: #555555;
				text-decoration: underline;
				margin-right: 15px;
			}

			.file-download:hover {
				cursor: pointer;
				color: #888888;
			}
		}
	}

	.page-right {
		display: flex;
	}

	.tree-info {
		// position: absolute;
		width: 452px;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		height: calc(100vh - 200px);
	}
</style>