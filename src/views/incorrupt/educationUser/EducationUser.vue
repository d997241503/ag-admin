<template>
	<div class="content">
		<div class="content-banner">
			<span>
				<img src="~@/assets/img/party-logo.png" alt="" />廉政教育</span>
		</div>
		<div class="content-nav goback-info">
			<div class="content-nav-auto">
				<div class="content-nav-item" :style="'width: ' + 100 / (sortManagementListAfter && sortManagementListAfter.length) + '%;'"
			 	 v-for="(item,index) in sortManagementListAfter" :key="index" @click="handleNav(item, index + 1)">
					<span class="content-nav-item-text" :ref="`navItem${index + 1}`">{{item.name}}</span>
				</div>
			</div>
		</div>
		<div v-show="contentVisible" :class="[domVal == 1 ? 'body-color-blue' : 'body-color-white']">
			<!-- 首页 -->
			<div v-if="domVal == 1 && sortManagementListBefore.length > 1">
				<div v-for="(item,index) in sortManagementListBefore" :key="index" v-if="index<2" class="content-body" :class="[domVal == 1 ? 'body-color-blue' : '']" style="display: grid;">
					<div style="width: 100%;" v-if="item.type == '0' && sortManagementListBefore[index]">
						<Nav ref="nav" :navObj="sortManagementListBefore[index]" @refreshData="handleMenu" :color="sortManagementListBefore[index].name" :class="[domVal == 1 ? 'body-color-blue-domVal' : '']" style="width: 85%;"></Nav>
						<span class="content-more" @click="handleNav(item, index + 2)">查看更多>></span>
					</div>
					<div v-if="item.type == '0'" class="divider-info-color"><el-divider class="el-divider"></el-divider></div>
					<div class="right-info" v-if="item.type == '0' && indexList[index]">
						<List ref="list1" :indexList="indexList[index]" :isIndex="true" @refreshData="handleArticle"></List>
					</div>
				</div>
			</div>
			<div class="content-middle"></div>
			<div v-if="domVal == 1 && sortManagementListBefore.length > 2" style="width: 100%;background-color: #FFFFFF;">
				<div v-for="(item,index) in sortManagementListBefore" :key="index" v-if="index>1" class="content-body" style="display: grid;">
					<div style="width: 100%;" v-if="item.type == '0' && sortManagementListBefore[index]">
						<!-- <Nav ref="nav" :navObj="sortManagementListBefore[index]" @refreshData="handleMenu" style="width: 85%;"></Nav> -->
						<el-divider class="el-divider-greater"><div class="divider-info-text">{{sortManagementListBefore[index].name}}</div></el-divider>
						<span class="content-more-greater" @click="handleNav(item, index + 2)">查看更多>></span>
					</div>
					<!-- <div v-if="item.type == '0'" class="divider-info-color"><el-divider></el-divider></div> -->
					<div class="right-info" v-if="item.type == '0' && indexList[index]">
						<List ref="list1" :indexList="indexList[index]" :isIndex="true" :isGreater="true" @refreshData="handleArticle"></List>
					</div>
				</div>
			</div>
			<div v-if="domVal == 1" class="content-foot">
				<span>友情链接:</span>
				<span @click="click('https://wsdx.ccps.gov.cn/')">网络党校</span>
				<span @click="click('https://www.12371.cn/')">中国共产党网</span>
				<span @click="click('https://www.xuexi.cn/')">学习强国</span>
				<span @click="click('http://www.hxw.gov.cn/')">红星云</span>
				<span @click="click('http://www.sxfj.gov.cn/')">三湘风纪网</span>
			</div>
			<!-- 其他 -->
			<div v-show="domVal !== 1" class="content-body">
				<div v-if="navObj.children && navObj.children.length" style="width: 32%;min-width: 350px;">
					<Nav ref="nav" :navObj="navObj" @refreshData="handleMenu"></Nav>
				</div>
				<!-- <div class="divider-info"><el-divider class="el-divider"></el-divider></div> -->
				<div class="right-info">
					<List ref="list" :isIndex="false" @refreshData="handleArticle"></List>
				</div>
			</div>
		</div>
		<div class="article-body">
			<Article ref="article" @refreshData="exitArticle" v-if="articleVisible"></Article>
		</div>
	</div>
</template>

<script>
	import {
		page,
		indexList
	} from 'api/incorrupt/education/index';
	import Nav from './components/nav';
	import List from './components/list';
	import Article from './components/article';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				contentVisible: true, // 列表内容
				articleVisible: false, // 文章主体
				navObj: {
					children: []
				},
				domVal: 1,
				status: true, //当前是否为一级类别
				name: '',
				indexList: [],
				sortManagementListAfter: [],
				sortManagementListBefore: []
			}
		},
		computed: { ...mapGetters([
				'sortManagementList'
			])
		},
		components: {
			Nav,
			List,
			Article
		},
		created() {
			if(this.sortManagementList) {
				this.navObj = this.sortManagementList && this.sortManagementList[0];
				for(let i = 0; i < this.sortManagementList.length; i++) {
					this.sortManagementListBefore.push(this.sortManagementList[i])
					this.sortManagementListAfter.push(this.sortManagementList[i])
				}
				// this.sortManagementListBefore = this.sortManagementList;
				// this.sortManagementListAfter = this.sortManagementList;
			}
			this.sortManagementListAfter.unshift({categoryId: undefined,children: [],count: 1,flag: "1",name: "首页",parentId: 0,sort: 0,type: "0",url: null});
			this.getindexListList();
			this.$nextTick(() => {
				this.checkedStatus(this.domVal);
			})
			if(this.$route.query.val) this.handleArticle(this.$route.query.val);
		},

		// mounted() {
		// 	// 初始化列表数据
		// 	this.status = true;
		// 	this.$nextTick(() => {
		// 		this.$refs.list.init(this.navObj, this.status);
		// 		this.checkedStatus(this.domVal);
		// 	})
		// },

		methods: {
			// 跳转
			click(url) {
				window.open(url)
			},
			// 获取首页数据列表
			getindexListList() {
				indexList()
					.then(response => {
						if (response && response.status === 200) {
							this.indexList = response.data;
						} else {
							this.total = 0;
						}
					}).catch(() => {})
			},

			// 点击导航
			handleNav(val, index) {
				this.name = val.name
				if (this.domVal && index != this.domVal) this.cancelStatus(this.domVal);
				this.checkedStatus(index);
				this.domVal = index;
				this.exitArticle();
				// 判断一级类别是否为链接类型
				if (val.type === '1') {
					// 跳转链接
					window.open(val.url, '_blank');
				} else {
					this.$nextTick(() => {
						this.navObj = val;
						if (this.navObj.children.length) {
							// 初始化当前选中样式
							this.$nextTick(() => {
								this.$refs.nav.init();
							})
						}
						this.status = true;
						if(this.domVal !== 1) this.$refs.list.init(this.navObj, this.status, 1);

					})
				}
			},

			// 点击左侧菜单响应
			handleMenu(val) {
				this.status = false;
				this.$refs.list.init(val, this.status);
			},

			// 关闭内容区，打开文章详情
			openArticle() {
				this.contentVisible = false;
				this.articleVisible = true;
			},

			// 打开主内容区，关闭文章详情
			exitArticle() {
				this.contentVisible = true;
				this.articleVisible = false;
			},

			// 选中
			checkedStatus(index) {
				// if(this.$refs[`navItem${index}`] && this.$refs[`navItem${index}`][0]) this.$refs[`navItem${index}`][0].style.color = '#FFFF99';
				if(this.$refs[`navItem${index}`] && this.$refs[`navItem${index}`][0]) this.$refs[`navItem${index}`][0].style.borderBottom = 'solid 2px red';
				for(let i = 0; i < this.sortManagementListAfter.length; i++) {
					if(i+1 !== index) {
						this.$refs[`navItem${i+1}`][0].style.borderBottom = 'none';
					}
				}
			},

			// 取消选中
			cancelStatus(index) {
				this.$refs[`navItem${index}`][0].style.color = '#FFFFFF';
			},

			// 点击列表文章响应
			handleArticle(val) {
				this.openArticle();
				this.$nextTick(() => {
					this.$refs.article.init(val);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-left: -20px;

		.content-banner {
			height: 240px;
			background: url(~@/assets/img/banner.png) no-repeat;
			background-size: 100% 100%;

			span {
				position: absolute;
   	 			margin-top: 100px;
				margin-left: 15%;
				font-size: 40px;
				// color: #FFFFFF;
				font-weight: bold;
				background-image: linear-gradient(to bottom, #FFFFFF, #93a3b8);
				-webkit-background-clip: text;
        		color: transparent;

				img {
					width: 70px;
					height: 70px;
					margin-right: 35px;
				}
			}
		}

		.content-nav {
			height: 60px;
			line-height: 60px;
			background-color: #052785;
			color: #FFFFFF;
			font-size: 18px;
			font-weight: normal;

			.content-nav-auto {
				display: flex;
				width: 80%;
				margin: 0 auto;

				.content-nav-item {
					float: left;
					text-align: center;
				}

				.content-nav-item:hover {
					// border-bottom: solid 2px red;
					// color: #FFFF99 !important;
					cursor: pointer;
				}

				.content-nav-item-text {
					display: inline-block;
					height: 60px;
					line-height: 60px;
				}

				.content-nav-item-text :hover {
					// border-bottom: solid 2px red;
					// color: #FFFF99 !important;
					cursor: pointer;
				}
			}

		}

		.content-body {
			display: flex;
			width: 80%;
			margin: 0 auto;
			background-color: #FFFFFF;

			.right-info {
				width: 100%;
			}

			.list-item {
				height: 20px;
				line-height: 20px;
				margin-bottom: 20px;
				font-size: 14px;
				color: #FFFFFF;
			}

			.item-icon {
				color: #777777;
				font-size: 18px;
			}

			.item-info {
				padding-left: 10px;
			}

			.item-info:hover {
				cursor: pointer;
				color: #555555;
			}

			.item-text {
				color: #777777;
			}

			.divider-info-text {
				font-size: 18px;
    			height: 35px;
				line-height: 35px;
				width: 110px;
				min-width: 110px;
				text-align: center;
				background-color: #0b3b9d;
				color: #FFFFFF;
				letter-spacing: 2px;
				font-weight: bold;
				align-items: center;
				justify-content: center;
				font-style: italic;
			}
		}

		.article-body {
			width: 85%;
			margin: 0 auto;
		}

		.divider-info {
			margin-top: -55px !important;
			margin-left: 30px;
			margin-right: 30px;
			// width: 85%;
			// margin: 0 auto;

			.el-divider {
				background-color: #204993;
			}
		}

		.el-divider-greater {
			background-color: #0f3c8b;
		}

		.body-color-blue {
			background-color: #032876;
		}

		.body-color-blue-domVal {
			background-color: #032876;
		}

		.body-color-white {
			background-color: #FFFFFF;
		}

		.divider-info-color {
			margin-top: -55px !important;
			margin-left: 30px;
			// margin-right: 30px;

			.el-divider {
				background-color: #FFFFFF;
			}
		}

		.content-more {
			width: 100px;
    		text-align: right;
			position: relative;
			margin-top: 35px;
			margin-bottom: 20px;
			// margin-right: 35px;
			// float: right;
			font-size: 17px;
			color: #ffffff;
			float: right;
		}

		.content-more:hover {
			pointer-events: auto;
			cursor: pointer;
		}

		.content-more-greater {
			width: 100px;
    		text-align: right;
			position: relative;
			margin-top: -55px;
			margin-bottom: 20px;
			// margin-right: 35px;
			// float: right;
			font-size: 17px;
			color: #5b79b0;
			float: right;
		}
		
		.content-more-greater:hover {
			pointer-events: auto;
			cursor: pointer;
		}

		.content-middle {
			height: 50px;
			margin-top: 30px;
			background-color: #FFFFFF;
		}

		.content-foot {
			height: 50px;
			color: #FFFFFF;
			font-size: 15px;
			background-color: #1745a2;

			span {
				margin-left: 30px;
				line-height: 50px;
			}

			span:nth-child(1) {
				margin-left: 50px;
			}

			span:nth-child(1) ~ span:hover {
				pointer-events: auto;
				cursor: pointer;
			}

		}

	}
</style>
