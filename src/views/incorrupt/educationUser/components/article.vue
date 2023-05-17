<template>
	<div class="content">
		<div class="content-nav"><span class="go-back-text" @click="goBack()">{{obj.categoryName}}</span><i class="el-icon-caret-right"></i>{{obj.educationName}}</div>
		<div class="content-body">
			<div class="title">{{obj.educationName}}</div>
			<!-- <div v-show="obj.flag == 0" class="title-dep">{{obj.deptName}}</div> -->
			<div v-show="obj.releaseTime" class="title-dep">发布时间：{{obj.releaseTime}}</div>
			<div class="title-dep">
				<span v-show="obj.name">{{obj.name}}；</span>
				<span v-show="obj.deptName">{{obj.deptName}}</span>
			</div>
			<div class="title-dep" style="float:right;margin-top: -10px;">已阅读：{{obj.readNum ? obj.readNum : 0}}</div>
			<el-divider></el-divider>
			<div style="min-height: 300px;">
				<div v-if="article.educationType == '0' && article.files.length" class="article" v-html="article.files[0].value"></div>
				<div v-else-if="article.educationType == '1' && article.files.length" class="article">
					<div class="img-info">
						<el-image class="img-item" v-for="(url, index) in article.files" :key="index" :src="url.value" fit="cover" lazy></el-image>
					</div>
				</div>
				<div v-else-if="article.educationType == '2' && article.files.length" id="vue-core-video-player-box" class="example-player">
					<!-- <vue-core-video-player :autoplay="false" :src="article.files[0].value"></vue-core-video-player> -->
					<video-player class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true"
					 customEventName="customstatechangedeventname" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)"
					 @statechanged="playerStateChanged($event)">
					</video-player>
				</div>
				<div v-else-if="article.educationType == '3' && article.files.length" class="article" v-html="article.files[0].value"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getArticleObj
	} from 'api/incorrupt/education/index';
	export default {
		data() {
			return {
				obj: {},
				article: {
					files: []
				},
				playerOptions: {
					// videojs options
					muted: true,
					language: 'en',
					playbackRates: [0.5, 1.0, 1.5, 2.0],
					aspectRatio: '16:9',
					sources: [{
						// type: "video/mp4",
						src: undefined

					}],
					notSupportedMessage: '此视频暂无法播放，请稍后再试',
					preload: 'auto',
					controlBar: {
						timeDivider: true,
						durationDisplay: true,
						remainingTimeDisplay: false,
						fullscreenToggle: true //全屏按钮
					}
					// poster: "/static/images/author.jpg",
				}
			}
		},

		computed: {
			player() {
				return this.$refs.videoPlayer.player
			}
		},

		methods: {
			init(val) {
				this.obj = val;
				if (this.obj.educationInfoId) {
					this.$nextTick(() => {
						getArticleObj(this.obj.educationInfoId)
							.then(response => {
								this.article = response.data;
								this.playerOptions.sources[0].src = this.article.files.length ? this.article.files[0].value : undefined;
							});
					})
				}
			},

			// 模拟返回
			goBack() {
				this.$emit("refreshData");
			},

			// listen event
			onPlayerPlay(player) {
			},
			onPlayerPause(player) {
			},
			// ...player event

			// or listen state event
			playerStateChanged(playerCurrentState) {
			},

			// player is ready
			playerReadied(player) {
				// you can use it to do something...
				// player.[methods]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {

		.content-nav {
			margin: 15px auto;
			font-size: 14px;
			color: #666666;

			.go-back-text:hover {
				cursor: pointer;
				color: #888888;
			}

			.el-icon-caret-right {
				margin-left: 10px;
			}
		}

		.content-body {
			width: 100%;
			background-color: #FFFFFF;
			padding: 20px;

			.title {
				text-align: center;
				font-size: 25px;
				color: #b90000;
				font-weight: bold;
			}

			.title-dep {
				text-align: center;
				font-size: 13px;
				line-height: 20px;
				color: #8c8c8c;
				margin-top: 10px;
				margin-bottom: -10px;
			}

			.article {
				padding: 10px 40px;
				font-size: 15px;

				.img-info {
					width: 60%;
					margin: 0 auto;

					.img-item {
						width: 100%;
					}
				}
			}

			.example-player {
				max-width: 780px;
				margin: 0 auto;
				position: relative;
				// height: 420px;
				background-color: #000000;
				font-weight: normal;

				// .video-player-box >>> .vjs-big-play-button {
				// 	display: none !important;
				// 	// font-size: 3em;
				// 	// line-height: 1.5em;
				// 	// height: 1.63332em;
				// 	// width: 3em;
				// 	// display: block;
				// 	// position: absolute;
				// 	// top: 50px;
				// 	// left: 50px;
				// 	// padding: 0;
				// 	// cursor: pointer;
				// 	// opacity: 1;
				// 	// border: 0.06666em solid #fff;
				// 	// background-color: #2B333F;
				// 	// background-color: rgba(43, 51, 63, 0.7);
				// 	// border-radius: 0.3em;
				// 	// transition: all 0.4s;
				// }
			}

			// .example-player>>>.vjs-big-play-button {
			// 	top: 50px !important;
			// 	left: 50%;
			// }
		}
	}
</style>
