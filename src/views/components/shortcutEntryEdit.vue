<template>
	<el-dialog :visible.sync="visible" width="280px" :modal="false">
		<div class="roll-containers-dialog">
			<el-collapse v-model="activeNames">
				<el-collapse-item v-for="(item, index) in permissionMenus" :key="index" :name="index">
					<template slot="title">
						<span class="title">{{item.title}}</span>
					</template>
					<div v-for="(child, childIndex) in item.children" :key="childIndex" class="menu-item">
						<div class="menu-item-img">
							<!-- <img src="~@/assets/img/iconfont.png" alt="图标"></img> -->
							<img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img>
						</div>
						<div class="menu-item-text">{{child.title}}</div>
						<div class="check-info" @click="handleChange(index,childIndex,child.id)">
							<div class="check-status" :ref="`sort${index}_${childIndex}`">
							</div>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="submitData()" size="mini" :loading="loading">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		page,
		addObj,
		delObj
	} from 'api/admin/quickEntry/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				visible: false,
				loading: false,
				activeNames: [0],
				menus: [],
				maxNum: 8,
				sortNum: 1,
				checkDatas: [],
			}
		},
		props: {
			quickEntryList: {
				type: Array
			}
		},
		computed: {
			...mapGetters([
				'permissionMenus',
				'navIndex',
				'userId'
			])
		},
		methods: {
			init() {
				this.visible = true;
				this.checkDatas = [];
				this.sortNum = 1;
				this.initAuthoritys()
			},

			// // 获取快捷入口数据
			// getDataList() {
			// 	let obj = {
			// 		userId: this.userId
			// 	};
			// 	page(obj)
			// 		.then(res => {
			// 			if (res && res.code === 0) {
			// 				this.quickEntryList = res.data ? res.data : [];
			// 				this.initAuthoritys();
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: '初始化快捷入口失败',
			// 					type: 'error',
			// 					duration: 2000
			// 				});
			// 			}
			// 		})
			// },

			// 初始化选中的菜单并排序
			initAuthoritys() {
				for (let i = 0; i < this.permissionMenus.length; i++) {
					if (this.permissionMenus[i].children.length) {
						let child = this.permissionMenus[i].children;
						for (var j = 0; j < child.length; j++) {
							let ii = i;
							let jj = j;
							this.updateCheckStyle(ii, jj, false);
							this.$nextTick(() => {
								this.$refs[`sort${ii}_${jj}`][0].innerText = '';
							})
							let index = this.quickEntryList.findIndex(item => item.menuId === child[j].id);
							if (index > -1) {
								this.checkDatasPush(i, j, child[j].id, this.quickEntryList[index].sort);
							}
						}
					}
				}
			},

			// 提交
			submitData() {
				this.loading = true;
				if (this.checkDatas.length > 0) {
					addObj(this.checkDatas)
						.then(() => {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.$emit('refreshDataList');
								this.loading = false;
								this.visible = false;
							}, 2000)
						})
				} else {
					let obj = {
						userId: this.userId
					};
					delObj(obj)
						.then(() => {
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.$emit('refreshDataList');
								this.loading = false;
								this.visible = false;
							}, 2000)
						})
				}
			},

			// 选择菜单并排序
			handleChange(index, childIndex, id) {
				if (!this.$refs[`sort${index}_${childIndex}`][0].innerText) {
					if (this.sortNum > this.maxNum) {
						this.$notify({
							title: '失败',
							message: '快捷入口最多添加8个',
							type: 'error',
							duration: 2000
						});
						return
					};
					this.checkDatasPush(index, childIndex, id, null);
				} else {
					if (this.sortNum > 1) this.sortNum--;
					let num = parseInt(this.$refs[`sort${index}_${childIndex}`][0].innerText);
					this.updateCheckStyle(index, childIndex, false);
					this.$nextTick(() => {
						this.$refs[`sort${index}_${childIndex}`][0].innerText = '';
					})
					let aryIndex = this.checkDatas.findIndex(item => item.menuId === id);
					this.checkDatas.splice(aryIndex, 1);
					for (var i = 0; i < this.checkDatas.length; i++) {
						if (this.checkDatas[i].sort > num) {
							this.checkDatas[i].sort--;
							// ``中取不到i
							let j = i;
							this.$nextTick(() => {
								this.$refs[`sort${this.checkDatas[j].index}_${this.checkDatas[j].childIndex}`][0].innerText = this.checkDatas[
									j].sort;
							});
						}
					}
				};
			},

			// checkDatas数组添加数据
			checkDatasPush(index, childIndex, id, sortNum_) {
				let obj = {
					sort: 0,
					index: 0,
					childIndex: 0,
					menuId: id,
					userId: this.userId
				};
				this.$nextTick(() => {
					// 获取到对应dom，并赋值当前排序
					this.$refs[`sort${index}_${childIndex}`][0].innerText = sortNum_ ? sortNum_ : this.sortNum;
					// 添加style
					this.updateCheckStyle(index, childIndex, true);
					obj.sort = sortNum_ ? sortNum_ : this.sortNum;
					obj.index = index;
					obj.childIndex = childIndex;
					// 将数据保存到对象数组
					this.checkDatas.push(obj);
					// 排序标识自增
					this.sortNum++;
				})
			},

			// 修改排序样式
			updateCheckStyle(index, childIndex, status) {
				this.$nextTick(() => {
					if (status) {
						this.$refs[`sort${index}_${childIndex}`][0].style.color = '#bc0000';
						this.$refs[`sort${index}_${childIndex}`][0].style.borderColor = '#bc0000';
					} else {
						this.$refs[`sort${index}_${childIndex}`][0].style.color = '';
						this.$refs[`sort${index}_${childIndex}`][0].style.borderColor = '';
					}
				})
			},
		}
	}
</script>

<style scoped>
	/* 滚动容器 */
	.roll-containers-dialog {
		max-height: 380px;
		overflow: auto;
	}

	.title {
		font-size: 15px;
	}

	.menu-item {
		display: flex;
		height: 50px;
		font-size: 13px;
	}

	.menu-item-img {
		width: 50px;
		margin-left: 10px;
	}

	.menu-item-img img {
		margin-top: 12px;
		width: 25px;
		height: 25px
	}

	.menu-item-text {
		flex: 1;
		line-height: 50px;
		color: #555555;
	}

	.check-info {
		width: 30px;
		margin-right: 10px;
	}

	.check-status {
		width: 20px;
		height: 20px;
		line-height: 20px;
		margin-top: 15px;
		color: #BFBFBF;
		border: 0.0625rem solid #BFBFBF;
		border-radius: 50%;
		text-align: center;
	}

	.check-status:hover {
		color: #bc0000;
		border: 0.0625rem solid #bc0000;
		cursor: pointer;
	}

	.check-status:active {
		/* background-color: #ECF5FF; */
	}

	.checking-status {}

	.dialog-footer button {
		width: 70px;
		background-color: #2FB5FE;
	}
</style>
