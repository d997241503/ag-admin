<template>
	<div class="quick-content">
		<div class="item-left"></div>
		<div class="item-center" v-for="(item, index) in quickEntryList" :key="index">
			<div class="item-info" :class="{'item-handle': item.flag == '1'}">
				<div @click="routeHandle(item)">
					<div class="mar-top img-info">
						<img :class="{'img-disabled': item.flag == '0'}" :src="item.pictureUrl" alt="图标"></img>
					</div>
					<div class="mar-auto">{{item.menuTitle}}</div>
				</div>
			</div>
			<div class="halving-line" v-show="index < quickEntryList.length - 1">&nbsp;</div>
		</div>
		<div class="more-info">
			<div class="img-icon">
				<el-button type="text" class="more-btn" @click="moreHandle()">
					<i class="el-icon-loading" v-if="loding"></i>
					<i class="el-icon-more" v-else></i>
				</el-button>
			</div>
		</div>
		<shortcutEntryEdit style="position: absolute;left: auto !important; right: 50px !important;" v-if="shortcutEntryEditVisible"
		 ref="shortcutEntryEdit" :quickEntryList="quickEntryList" @refreshDataList="getDataList"></shortcutEntryEdit>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		isURL
	} from '@/utils/validate';
	import {
		page
	} from 'api/admin/quickEntry/index';
	import shortcutEntryEdit from './shortcutEntryEdit';
	export default {
		data() {
			return {
				shortcutEntryEditVisible: false,
				quickEntryList: [],
				menus: [],
				loding: false
			}
		},
		components: {
			shortcutEntryEdit
		},
		computed: {
			...mapGetters([
				'userId',
				'permissionMenus'
			])
		},
		mounted() {
			this.getDataList();
		},
		methods: {
			moreHandle() {
				this.shortcutEntryEditVisible = true;
				this.$nextTick(() => {
					this.$refs.shortcutEntryEdit.init();
				})
			},
			routeHandle(val) {
				if(val.flag == '0') return
				if (isURL(val.href)) {
					window.open(val.href, '_blank');
				} else {
					for (let i = 0; i < this.permissionMenus.length; i++) {
						for (let j = 0; j < this.permissionMenus[i].children.length; j++) {
							if (this.permissionMenus[i].children[j].id == val.menuId) {
								try {
									let obj = {
										index: i,
										childIndex: j
									};
									localStorage.setItem(this.permissionMenus[i].children[j].code, JSON.stringify(obj));
									let routeUrl = this.$router.resolve({
										path: '/' + this.permissionMenus[i].code + '/' + this.permissionMenus[i].children[j].code
									});
									window.open(routeUrl.href, '_blank');
								} catch (e) {
									//TODO handle the exception
								}
							}
						}
					}
					// let routeUrl = this.$router.resolve({
					// 	path: '/' + val.code + '/' + val.code
					// });
					// window.open(routeUrl.href, '_blank');
				}
			},
			// 获取快捷入口数据
			getDataList() {
				this.quickEntryList = [];
				this.loding = true;
				page({
						userId: this.userId
					})
					.then(res => {
						if (res && res.code === 0) {
							setTimeout(() => {
								this.quickEntryList = res.data ? res.data : [];
								this.loding = false;
							}, 500);
						} else {
							this.$notify({
								title: '失败',
								message: '初始化快捷入口失败',
								type: 'error',
								duration: 2000
							});
							this.loding = false;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '初始化快捷入口失败',
							type: 'error',
							duration: 2000
						});
						this.loding = false;
					})
			},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.img-icon {
		transform: rotate(90deg);
		transform-origin: 50% 30%;

		-ms-transform: rotate(90deg);
		/* IE 9 */
		-ms-transform-origin: 50% 30%;
		/* IE 9 */

		-webkit-transform: rotate(90deg);
		/* Safari 和 Chrome */
		-webkit-transform-origin: 50% 30%;
		/* Safari 和 Chrome */

		-moz-transform: rotate(90deg);
		/* Firefox */
		-moz-transform-origin: 50% 30%;
		/* Firefox */

		-o-transform: rotate(90deg);
		/* Opera */
		-o-transform-origin: 50% 30%;
		/* Opera */
	}
</style>
