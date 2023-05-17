<template>
	<div>
		<div class="goback-info" :style="scrollerHeight">
			<!-- <el-row class="head-info">
				<el-col :span="12">
					<div class="logo-info">
						<img src="~@/assets/img/cf_logo.png" alt="">
					</div>
					<div class="title-text-wisdom">
						<span>智慧纪检系统</span>
					</div>
				</el-col>
				<el-col :span="12" class="user-info">
					{{name}}  &nbsp;&nbsp;	|  &nbsp;&nbsp;	<span class="user-backstage-info" @click="sysManageHandle()">管理后台></span>
				</el-col>
			</el-row> -->
			<!-- <baseQuickEntry></baseQuickEntry> -->
			<!-- <div class="cut-line"></div> -->
			<!-- <div class="nav-content-index" v-for="(item, index) in permissionMenus" :key="index">
				<template>
					<div class="nav-left" :ref="`permissionMenusNav_${index}`"
						:style="{'line-height': itemScrollerHeight(index)}">{{item.title}}</div>
				</template>
				<div class="nav-right">
					<div class="route-item" :class="{'item-handle': child.flag == '1'}" v-for="(child, childIndex) in item.children" :key="childIndex">
						<div @click="routeHandle(child,index,childIndex)">
							<div class="img-info" style="margin-top: -10px;">
								<img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img>
							</div>
							<div class="mar-auto">{{child.title}}</div>
						</div>
					</div>
				</div>
			</div> -->
			<!-- 弹窗, 修改密码 -->
			<!-- <updatePassword v-if="updatePassowrdVisible" ref="updatePassowrd"></updatePassword> -->

            <div class="page-info">
				<div class="page-info-content">
					<div>
						<el-row :gutter="20">
                            <el-col :span="24">
                                <TaskCards/>
                            </el-col>
							<!-- <el-col :span="24">
                                <TaskCenter class="card-container"/>
							</el-col> -->
							<!-- <el-col :span="12">
								<div class="grid-content bg-purple new-article">
									<div class="page-title-info-top">
										<div class="page-title">
											<span>
												<i class="el-icon-s-comment"></i>
												<span class="page-title-text">最新文章</span>
											</span>
										</div>
									</div>
									<div class="page-ul">
										<div class="page-ul-over">
										<ul class="clearfix" v-for = "(site,index) in notice" :key="index">
											<li class="topUp-col" @click="noticeHandle(site)">
												<span class="content-dot">●</span>
												<span class="content-text">{{site.educationName}}</span>
												<span class="content-text-right">{{site.releaseTime}}</span>
											</li>
										</ul>
										<div v-show="!notice.length">
											<el-empty :image-size="50">
											</el-empty>
										</div>
										</div>
									</div>
								</div>
							</el-col> -->
						</el-row>
					</div>
					<div class="page-card">
						<el-row :gutter="20">
							<el-col :span="8">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-menu"></i>
												<span class="page-title-text">监督准备档案</span>
												<!-- <img class="img-router" src="~@/assets/img/sy-folderOpen.png" />监督准备档案 -->
											</span>
										</div>
                    					<span v-if="integrityArchives_btn_inspection" class="underline-link" @click="$router.push({path: '/filesPerOverview'})">档案全貌</span>
									</div>
									<div class="page-ul-route">
										<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.filesPrepare" :key="childIndex">
											<!-- <div class="nav-content" v-if="item.title == '基础配置管理'"> -->
												<!-- <div class="route-item" :class="{'item-handle': child.flag == '1'}" v-for="(child, childIndex) in item.children" :key="childIndex"> -->
													<div @click="routeHandle(child,prepareFilesIndex,childIndex)">
														<div class="img-info">
															<div v-if="child.title == '单位风险点排查'" style="width: 70px" class="img-info-title">
																<div>{{child.title}}</div>
															</div>
															<div v-else class="img-info-title">
																<div>{{child.title}}</div>
															</div>
															<div v-if="child.title == '个人档案'" class="img-info-icon"><img style="width: 40px;height: 40px;" :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
															<div v-else class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
															<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
														</div>
														<!-- <div class="mar-auto">{{child.title}}</div> -->
													</div>
												<!-- </div> -->
											<!-- </div> -->
										</div>
									<!-- <div class="no-data" v-show="!prepareFiles.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-star-on"></i>
												<span class="page-title-text">监督联席会</span></span>
										</div>
									</div>
									<div class="page-ul-route-meeting">
										<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.meetingJoint" :key="childIndex">
											<div @click="routeHandle(child,meetingIndex,childIndex)">
												<div class="img-info">
													<div style="width: 100px;text-align: left;" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
													<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
												</div>
												<!-- <div class="mar-auto">{{child.title}}</div> -->
											</div>
										</div>
										<!-- <div class="no-data" v-show="!meeting.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-s-help"></i>
												<span class="page-title-text">监督实施档案</span></span>
										</div>
									</div>
									<div class="page-ul-route-implementation">
										<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.filesImplementation" :key="childIndex">
											<div @click="routeHandle(child,implementationIndex,childIndex)">
												<div class="img-info">
													<div class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
													<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
												</div>
												<!-- <div class="mar-auto">{{child.title}}</div> -->
											</div>
										</div>
										<!-- <div class="no-data" v-show="!implementation.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="page-card">
						<el-row :gutter="20">
							<el-col :span="4">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-s-unfold"></i>
												<span class="page-title-text">内部巡查</span></span>
										</div>
									</div>
									<div class="page-ul-route-bottom-patrol">
										<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.patrolInternal" :key="childIndex">
											<div @click="routeHandle(child,patrolIndex,childIndex)">
												<div class="img-info">
													<div class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
													<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
												</div>
												<!-- <div class="mar-auto">{{child.title}}</div> -->
											</div>
										</div>
										<!-- <div class="no-data" v-show="!patrol.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-s-check"></i>
												<span class="page-title-text">执纪审查</span></span>
										</div>
									</div>
									<div class="page-ul-route-bottom-examination">
										<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.reviewDiscipline" :key="childIndex">
											<div @click="routeHandle(child,clueIndex,childIndex)">
												<div class="img-info">
													<div style="width: 70px" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
													<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
												</div>
												<!-- <div class="mar-auto">{{child.title}}</div> -->
											</div>
										</div>
										<!-- <div class="no-data" v-show="!clue.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-s-flag"></i>
												<span class="page-title-text">廉政宣教</span></span>
										</div>
									</div>
									<div class="page-ul-route-bottom-education">
										<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.educationIncorruptible" :key="childIndex">
											<div @click="routeHandle(child,educationIndex,childIndex)">
												<div class="img-info">
													<div style="width: 100px;text-align: left;" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
													<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
												</div>
												<!-- <div class="mar-auto">{{child.title}}</div> -->
											</div>
										</div>
										<!-- <div class="no-data" v-show="!education.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple">
									<div class="page-title-info">
										<div class="page-title">
											<span>
												<!-- <img class="img-router" src="~@/assets/img/icon_router.png" /> -->
												<i class="el-icon-s-opportunity"></i>
												<span class="page-title-text">监督执纪数据中心</span></span></span>
										</div>
									</div>
									<div class="page-ul-route-bottom-right">
									<div class="page-nav-content" :class="child.auth ? 'handle' : 'gray'" v-for="(child, childIndex) in menusCard.dataDisciplinary" :key="childIndex">
											<div @click="routeHandle(child,disciplinaryIndex,childIndex)">
												<div class="img-info">
													<div class="img-info-icon"><img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img></div>
													<div v-if="child.title == '监督准备数据'" style="color: #3b88ff" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div v-else-if="child.title == '监督实施数据'" style="color: #fd7311" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div v-else-if="child.title == '执纪审查数据'" style="color: #08c18c" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<div v-else-if="child.title == '监督联席会数据'" style="color: #752fdd" class="img-info-title">
														<div>{{child.title}}</div>
													</div>
													<!-- <img :class="{'img-disabled': child.flag == '0'}" :src="child.pictureUrl" alt="图标"></img> -->
												</div>
												<!-- <div class="mar-auto">{{child.title}}</div> -->
											</div>
										</div>
										<!-- <div class="no-data" v-show="!disciplinary.length">
											<el-empty :image-size="50">
											</el-empty>
										</div> -->
									</div>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
            </div>
		</div>
		<!-- <div class="footer">湖南嘉创信息科技发展有限公司 &nbsp;&nbsp; Copyright &copy; 1997-2022 by 湘南嘉创信息科技发展有限公司 all rights reserved</div>	 -->
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		isURL
	} from '@/utils/validate';
	// import {
	// 	getIndexnotice,
	// 	getIndextodo
	// } from 'api/dashboard/index';
	import panThumb from 'components/PanThumb';
	// import pieChart from './pieChart';
	// import barChart from './barChart';
	// import lineChart from './lineChart';
	import countTo from 'vue-count-to';
	import todoList from 'components/TodoList';
	// import baseQuickEntry from '../../components/baseQuickEntry';
	// import updatePassword from '../../components/updatePassword';
	// import Footer from '../../components/Footer';
	import {
		logout
	} from 'api/admin/user/index'
    import TaskCenter from '../components/TaskCenter.vue'
    import TaskCards from '../components/TaskCards.vue'
	export default {
		name: 'dashboard-editor',
		components: {
			panThumb,
			countTo,
			// pieChart,
			// lineChart,
			// barChart,
			todoList,
			// baseQuickEntry,
			// updatePassword,
			// Footer,
            TaskCenter,
            TaskCards
		},
		data() {
            this.staticMenus = {
                filesPrepare: [
                    { title: '个人档案', code: 'filesPer/index', pictureUrl: require('@/assets/img/dashboard/dangan.png'), path: '/filesPrepare/filesPer/index' },
                    { title: '单位信息档案', code: 'informationCom/index', pictureUrl: require('@/assets/img/dashboard/danwei.png'), path: '/filesPrepare/informationCom/index' },
                    { title: '单位风险点排查', code: 'screeningComCom/index', pictureUrl: require('@/assets/img/dashboard/danweifengxian.png'), path: '/filesPrepare/screeningComCom/index' }
                ],
                meetingJoint: [
                    { title: '监督联席会', code: 'meeting', pictureUrl: require('@/assets/img/dashboard/lianxihui.png'), path: '/filesImplementation/meeting' },
                ],
                filesImplementation: [
                    { title: '三重一大', code: 'large', pictureUrl: require('@/assets/img/dashboard/sanzhong.png'), path: '/filesImplementation/large' },
                    { title: '专项监督', code: 'special', pictureUrl: require('@/assets/img/dashboard/zhuanxiang.png'), path: '/filesImplementation/special' },
                    { title: '选人用人监督', code: 'employ', pictureUrl: require('@/assets/img/dashboard/xuanren.png'), path: '/filesImplementation/employ' },
                    { title: '廉政谈话', code: 'talkInc', pictureUrl: require('@/assets/img/dashboard/tanhua.png'), path: '/filesImplementation/talkInc' },
                    { title: '两个责任落实', code: 'responsibility', pictureUrl: require('@/assets/img/dashboard/zeren.png'), path: '/filesImplementation/responsibility' }
                ],
                patrolInternal: [
                    { title: '内部巡查', code: 'patrolInternal', pictureUrl: require('@/assets/img/dashboard/neibu.png'), path: '/filesImplementation/patrolInternal' }
                ],
                reviewDiscipline: [
                    { title: '执纪审查', code: 'reviewDiscipline', pictureUrl: require('@/assets/img/dashboard/xiansuo.png'), path: '/reviewDiscipline/clue' }
                ],
                educationIncorruptible: [
                    { title: '廉政宣教', pictureUrl: require('@/assets/img/dashboard/xuanjiao.png'), path: '/educationUser' }
                ],
                dataDisciplinary: [
                    { title: '监督准备数据', code: 'prepareFiles', pictureUrl: require('@/assets/img/dashboard/zhunbei.png'), path: '/dataDisciplinary/prepareFiles' },
                    { title: '监督实施数据', code: 'prepareFiles', pictureUrl: require('@/assets/img/dashboard/shishishuju.png'), path: '/dataDisciplinary/implementationFiles' },
                    { title: '执纪审查数据', code: 'prepareFiles', pictureUrl: require('@/assets/img/dashboard/zhiji.png'), path: '/dataDisciplinary/reviewData' },
                    { title: '监督联席会数据', code: 'prepareFiles', pictureUrl: require('@/assets/img/dashboard/lianxihuishuju.png'), path: '/dataDisciplinary/conferenceData' }
                ],
            }
			return {
				statisticsData: {
					article_count: 1024,
					comment_count: 102400,
					latest_article: [],
					month_article_count: 28,
					pageviews_count: 1024
				},
				updatePassowrdVisible: false,
				isMounted: false,
				scrollerHeightTemp: '',
                siteRecharge: [],
				notice: [],
				prepareFiles: [], // 监督准备档案
				prepareFilesIndex: undefined,
				implementation: [], // 监督实施档案
				implementationIndex: undefined,
				patrol: [], // 内部巡查
				patrolIndex: undefined,
				education: [], // 廉政宣教
				educationIndex: undefined,
				meeting: [], // 监督联席会
				meetingIndex: undefined,
				clue: [], // 线索及案件管理
				clueIndex: undefined,
				disciplinary: [], // 监督执纪数据中心
				disciplinaryIndex: undefined,
				integrityArchives_btn_inspection: false,
			}
		},
		computed: {
			...mapGetters([
				'name',
				'avatar',
				'roles',
				'sidebar',
				'permissionMenus',
				'updatepasswordflag',
				'elements',
                'menus'
			]),
			scrollerHeight() {
				if (!this.isMounted) return;
				var height = this.scrollerHeightTemp - 190;
				return {
					'minHeight': height + 'px'
				}
			},
			itemScrollerHeight() {
				return (val) => {
					if (!this.isMounted) return;
					return (this.$refs[`permissionMenusNav_${val}`][0].scrollHeight) + 'px';
				}
			},
            menusCard() {
                const {menus, staticMenus} = this
                Object.values(staticMenus).flat().forEach(menu => {
                    menu.auth = menu.code ? menus[menu.code] : true
                })
                return staticMenus
            }
		},
		mounted() {
			this.isMounted = true;
			this.resetDocumentClientHeight();
			if (this.updatepasswordflag === '0') this.$notify({
				title: '提示',
				message: '您的密码为初始密码，请尽快进行修改！',
				type: 'warning',
				duration: 0
			});
		},
		created() {
			this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
			sessionStorage.removeItem("navkeep");
			sessionStorage.removeItem("navkeeptitle");
			// this.$store.state.user.isBackstage = false;
			if(sessionStorage.getItem('todooperateid') && sessionStorage.getItem('todooperatename')) {
				// if(sessionStorage.getItem('todooperateid') && sessionStorage.getItem('todooperatename')) {
					this.$router.push({
						path: "/processInstance/detail",
						query: {
							id: sessionStorage.getItem('todooperateid'),
							name: sessionStorage.getItem('todooperatename')
						}
					});
				// }
			}
			// this.getList();
			// this.getListtodo();
		},
		methods: {
			// // 获取右侧列表
			// getList() {
			// 	// this.listLoading = true;
			// 	getIndexnotice(this.listQuery)
			// 		.then(response => {
			// 			if (response && response.status === 200) {
			// 				// for(let i = 0; i < 7; i++) {
			// 				// 	this.notice.push(response.data[i])
			// 				// }
			// 				if(response.data && response.data.length) this.notice = response.data;
			// 			} else {
			// 			}
			// 			// this.listLoading = false;
			// 		}).catch(() => {
			// 			// this.listLoading = false;
			// 		})
			// },
			noticeHandle(val) {
				if (val.educationType == '3') {
					window.open(val.files[0].value, '_blank');
				} else {
					this.$router.push({
						path: '/educationUser',
						query: {
							val: val
						}
					});
				}
			},
			// // 获取左侧列表
			// getListtodo() {
			// 	// this.listLoading = true;
			// 	getIndextodo(this.listQuery)
			// 		.then(response => {
			// 			if (response && response.status === 200) {
			// 				// for(let i = 0; i < 7; i++) {
			// 				// 	this.siteRecharge.push(response.data[i])
			// 				// }
			// 				if(response.data && response.data.length) this.siteRecharge = response.data;
			// 			} else {
			// 			}
			// 			// this.listLoading = false;
			// 		}).catch(() => {
			// 			// this.listLoading = false;
			// 		})
			// },
			siteRechargeHandle(val) {
				if (val.type == '1') {
					this.$router.push({
						path: "/processInstance/detail",
						query: {
							id: val.id,
							name: val.title
						}
					});
				}
				if (val.type == '2') {
					this.$router.push({
						path: "/filesPrepare/filesPer/index/taskMy"
					});
				}
				if (val.type == '3') {
					this.$router.push({
						path: "/responsibility"
					});
				}
			},
			// 重置窗口可视高度
			resetDocumentClientHeight() {
				this.scrollerHeightTemp = document.documentElement['clientHeight'];
				window.onresize = () => {
					this.scrollerHeightTemp = document.documentElement['clientHeight'];
				}
			},
			// // 修改密码
			// updatePasswordHandle() {
			// 	this.updatePassowrdVisible = true;
			// 	this.$nextTick(() => {
			// 		this.$refs.updatePassowrd.init();
			// 	})
			// },
			// 路由跳转
			routeHandle(val, index, childIndex) {
				if(!val.auth) return
				let routeUrl = this.$router.resolve({
                    path: val.path
                });
                window.open(routeUrl.href, '_blank');
			},
			logout() {
				this.$confirm(`确定进行[退出]操作?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$store.dispatch('FedLogOut')
						.then(() => {
							location.reload(); // 为了重新实例化vue-router对象 避免bug
							// window.location.href = 'https://yth2.nicity.cn/#/portal/index';
							// window.location.href = 'https://yth.csudgroup.com/#/portal/index';
						});
					// logout({
					// 	authKey: this.$store.state.user.authkey
					// }).then(res => {
					// 	if (res.status == 200) {
					// 		this.$store.dispatch('FedLogOut')
					// 			.then(() => {
					// 				window.location.href = this.$baseURL.LoutURL
					// 				location.reload(); // 为了重新实例化vue-router对象 避免bug
					// 			});

					// 	}
					// })
				}).catch(() => {

				})
			},

			// 进入管理后台
			sysManageHandle() {
				this.$router.push({
					path: '/backstage'
				})
			},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.goback-info {
		min-width: 1240px;
		background-color: #e6e6e6;
		// margin-left: 95px;
	}
	.head-info {
		width: 100%;
		height: 80px;
		min-width: 830px;
        background-color: #022775;

		.logo-info {
			margin-left: 10px;
			text-align: center;
			float: left;
			margin-top: 10px;

			img {
				height: 54px;
			}
		}

		.title-text {
			float: left;
			height: 20px;
			line-height: 20px;
			margin-top: 20px;
			margin-left: 10px;
			font-family: HuXiaoBoKuHei;
			font-size: 20px;
			font-weight: normal;
			font-stretch: normal;
			font-weight: 600;
			 color: #ffffff;

			span:nth-child(3) {
				font-size: 12px;
			}
		}

		.title-text-wisdom {
			float: left;
			height: 80px;
			line-height: 80px;
			// margin-top: 25px;
			// margin-left: 30px;
			font-family: HuXiaoBoKuHei;
			font-size: 19px;
			font-weight: normal;
			font-stretch: normal;
			font-weight: 600;
			color: #ffffff;
		}

		.user-info {
			text-align: right;
			padding-right: 57px;
			height: 16px;
			margin-top: 28px;
			font-family: AdobeHeitiStd-Regular;
			font-size: 16px;
			font-weight: bold;
			font-stretch: normal;
			line-height: 16px;
			letter-spacing: 1px;
			color: #ffffff;

			.el-dropdown-link {
				cursor: pointer;
			}

			.user-backstage-info {
				cursor: pointer;
			}
		}
	}

	// .cut-line {
	// 	box-shadow: 0px -10px 20px 5px rgba(56, 63, 98, 0.17);
	// }


	.page-info {
		// height: calc(100vh - 80px);
		// padding: 15px;
		background-color: #e6e6e6;
		// overflow: auto;

		.page-info-content {
			padding: 20px;
		}

        // .page-col {
        //     background-color: #ffffff;
        // }

        .el-row {
            margin-bottom: 20px;
            &:last-child {
            margin-bottom: 0;
            }
        }

        .bg-purple {
            background-color: #ffffff;
        }

        .grid-content {
            // border-radius: 4px;
            min-height: 36px;
            padding: 0px 20px;

            .page-title-info-top {
                height: 50px;
				font-size: 16px;
				// font-weight: bold;
                border-bottom: solid 1px #c8c8c8;

                .page-title {
                    width: fit-content;
                    height: 50px;
                    line-height: 50px;
                    color: rgb(188, 0, 0);
                    border-bottom: solid 2px rgb(188, 0, 0);

					.page-title-text {
						color: black;
					}

					i {
						margin-right: 6px;
					}

					.page-title-number {
						// color: rgb(156, 11, 11);
						color: #444;
					}

					.img {
						width: 15px;
    					height: 20px;
    					margin-top: -3px;
						margin-left: 2px;
						margin-right: 3px;
					}

					.img-router {
						width: 12px;
						height: 12px;
						margin-top: -3px;
						margin-left: 2px;
						margin-right: 7px;
					}
                }
            }

			.page-title-info {
                height: 50px;
				font-size: 15px;
				// font-weight: bold;
                border-bottom: solid 1px #c8c8c8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .page-title {
                    height: 50px;
                    line-height: 50px;
                   	color: rgb(188, 0, 0);
                    border-bottom: solid 2px rgb(188, 0, 0);
					// padding: 20px 0px 0px 10px;
					font-size: 16px;

					.page-title-text {
						color: black;
					}

					i {
						margin-right: 6px;
					}

					.page-title-number {
						// color: rgb(156, 11, 11);
						color: #444;
					}

					.img {
						width: 15px;
    					height: 20px;
    					margin-top: -3px;
						margin-left: 2px;
						margin-right: 3px;
					}

					.img-router {
						width: 12px;
						height: 12px;
						margin-top: -3px;
						margin-left: 2px;
						margin-right: 7px;
					}
                }
            }

            .page-ul {
                padding: 20px 0px 20px 10px;
				margin-left: -10px;
                flex: 1;
				// height: 230px;
				// height: calc(100vh - 692px);
				// min-height: 100px;
				// max-height: 500px;
				// // overflow-y: auto;

				.page-ul-over {
					// height: calc(100vh - 692px);
					// min-height: 100px;
					// max-height: 500px;
					// overflow-y: auto;
					// padding-right: 10px;
                    overflow: auto;
				}

				.topUp-col {
					display: flex;
					font-size: 15px;

					.content-dot {
						// display: inline-block;
						// content: '●';
						width: 4px;
						height: 4px;
						line-height: 3px;
						// background-color: black;
						border-radius: 50%;
						margin-top: 6px;
						margin-right: 10px;
					}

					.content-text {
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.content-text-right {
						float: right;
						width: 170px;
						text-align: right;
                        margin-right: 10px;
					}
				}

				// .content-dot:hover {
                //     background-color: #619fe5;
                //     cursor: pointer;
				// }

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 90px;
                    &.handle {
                        cursor: pointer;
                    }

					.mar-auto {
						font-size: 15px;
					}
				}
			}

			>>> ul {
				padding-left: 12px;
			}
			
			.page-ul-route {
                padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: auto;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 50px;
					width: 100%;
                    &.handle {
                        cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #f0f6ff;
						margin-right: 10px;
						padding: 0px 15px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #3b88ff;

							div:first-child {
								// height: 20px;
    							// margin-top: 20%;
							}
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 50px;
								height: 50px;
								margin-top: 45px;
								transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}

					// .nav-content {
					// 	text-align: center;

					// 	.route-item {
					// 		cursor: pointer;

					// 		.mar-auto {
					// 			font-size: 15px;
					// 		}
					// 	}
					// }
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}

				&::-webkit-scrollbar {
					height: 4px;
					display: block;
				}
				&::-webkit-scrollbar-track {
					background: rgb(239, 239, 239);
				}
				&::-webkit-scrollbar-thumb {
					background: #dadada;
					border-radius: 2px;
				}

				&::-webkit-scrollbar-thumb:hover {
					background: #c3c3c3;
				}
            }

			.page-ul-route-meeting {
				padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 50px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #edfaf7;
						margin-right: 10px;
						padding: 0px 35px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #08c18c;

							div:first-child {
								// height: 20px;
    							// margin-top: 20%;
							}
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 40px;
								height: 40px;
								margin-top: 45px;
								transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}
			}

			.page-ul-route-implementation {
				 padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: auto;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 50px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #f4effc;
						margin-right: 10px;
						padding: 0px 15px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #752fdd;

							div:first-child {
								// height: 20px;
    							// margin-top: 20%;
							}
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 45px;
								height: 45px;
								margin-top: 45px;
								transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}

				&::-webkit-scrollbar {
					height: 4px;
					display: block;
				}
				&::-webkit-scrollbar-track {
					background: rgb(239, 239, 239);
				}
				&::-webkit-scrollbar-thumb {
					background: #dadada;
					border-radius: 2px;
				}

				&::-webkit-scrollbar-thumb:hover {
					background: #c3c3c3;
				}

				// &.expend {
				// 	height: calc(100% - 70px);
				// }
			}
			
			.page-ul-route-bottom {
                padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 60px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #f0f6ff;
						margin-right: 10px;
						padding: 0px 15px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #3b88ff;
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 45px;
								height: 45px;
								margin-top: 20px;
								// transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}

					// .nav-content {
					// 	text-align: center;

					// 	.route-item {
					// 		cursor: pointer;

					// 		.mar-auto {
					// 			font-size: 15px;
					// 		}
					// 	}
					// }
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}
            }

			.page-ul-route-bottom-patrol {
				padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 60px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #edfaf7;
						margin-right: 10px;
						padding: 0px 35px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #08c18c;
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 45px;
								height: 45px;
								margin-top: 20px;
								// transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}
			}

			.page-ul-route-bottom-examination {
				padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 60px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #fff4ee;
						margin-right: 10px;
						padding: 0px 35px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #fd7311;
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 45px;
								height: 45px;
								margin-top: 20px;
								// transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}
			}

			.page-ul-route-bottom-education {
				padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 60px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #f0f6ff;
						margin-right: 10px;
						padding: 0px 35px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {
							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #3b88ff;
						}

						.img-info-icon {

							flex: 1;
    						text-align: right;

							img {
								width: 45px;
								height: 45px;
								margin-top: 20px;
								// transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}
			}

			.page-ul-route-bottom-right {
                padding: 20px 10px 26px 10px;
				margin-left: -10px;
				display: flex;
				margin-right: -20px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: auto;

                .topUp-col:hover {
                    color: rgb(188, 0, 0);
                    cursor: pointer;
				}
				
				.page-nav-content {
					margin: 0 auto;
					line-height: 60px;
					width: 100%;
                    &.handle {
					    cursor: pointer;
                    }

					.img-info {
						display: flex;
						text-align: center;
						background-color: #f8f8f8;
						margin-right: 10px;
						padding: 0px 25px;
						height: 90px;
						border-radius: 4px;

						.img-info-title {

							font-size: 14px;
							width: 60px;
							line-height: 20px;
							// height: 40px;
							// margin-top: 25px;
							/* white-space: normal; */
							/* transform: translateY(-50%); */
							text-align: center;
							white-space: normal;
							height: fit-content;
							position: relative;
							top: 50%;
							transform: translateY(-50%);
							color: #3b88ff;
							
						}

						.img-info-icon {

							flex: 1;
    						text-align: left;

							img {
								width: 45px;
								height: 45px;
								margin-top: 20px;
								// transform: translateY(-50%);
							}

						}
					}					

					.mar-auto {
						font-size: 15px;
						text-align: center;
						line-height: 50px;
						margin-bottom: -10px;
					}

					// .nav-content {
					// 	text-align: center;

					// 	.route-item {
					// 		cursor: pointer;

					// 		.mar-auto {
					// 			font-size: 15px;
					// 		}
					// 	}
					// }
				}

				.no-data {
					// position: absolute;
					height: 130px;
					width: 100px;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					margin: auto;
					text-align: center;

					/deep/ .el-empty__image {
						margin: 0 auto;
					}

				}

				&::-webkit-scrollbar {
					height: 4px;
					display: block;
				}
				&::-webkit-scrollbar-track {
					background: rgb(239, 239, 239);
				}
				&::-webkit-scrollbar-thumb {
					background: #dadada;
					border-radius: 2px;
				}

				&::-webkit-scrollbar-thumb:hover {
					background: #c3c3c3;
				}
            }
        }

        .page-card {
            margin-top: 15px;
        }
    }

	.footer {
		width: 100%;
		height: 40px;
		line-height: 40px;
		background-color: #222222;
		color: #ffffff;
		font-size: 14px;
		text-align: center;
		/* box-shadow: 0 10px 10px #e3e2e8;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none; */
	}
  .card-container {
    padding: 20px;
    background-color: #fff;
    height: 100%;
  }
  .new-article {
    height: 100%;
    display: flex;
    flex-direction: column;
    .page-ul {
        height: calc(100% - 50px);
    }
    .page-ul-over {
        height: 100%;
    }
  }
</style>
