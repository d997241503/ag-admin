<template>
	<div class="content">
		<div class="title">落实“三重一大”事项执行情况监督情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="50">
					<td class="label table-border-bottom-right">党组织</td>
					<td class="label table-border-bottom-right">{{dataObj.field0001}}</td>
					<td colspan="2" class="label table-border-bottom-right">监督事项名称</td>
					<td width="200" class="label table-border-bottom table-row-right">{{dataObj.field0002}}</td>
				</tr>
				<tr height="50">
					<td width="180" class="label table-border-bottom-right">牵头责任单位</td>
					<td colspan="4" class="value table-border-bottom table-row-right">{{dataObj.field0003}}</td>
				</tr>
				<tr height="50">
					<td class="label table-border-bottom-right">工作负责人</td>
					<td width="182" class="label table-border-bottom-right">{{dataObj.field0004}}</td>
					<td width="132" class="label table-border-bottom-right">督查时间</td>
					<td colspan="2" class="label table-border-bottom table-row-right">{{dataObj.field0005 | filterTime}}</td>
				</tr>
				<tr height="286">
					<td class="label table-border-bottom-right" style="line-height: 40px;">监督事项概要</td>
					<td colspan="4" style="position: relative;" class="value table-border-bottom table-row-right">
						<div class="hint-text" style="text-align: left;">（简要说明监督检查事项的内容）</div>
						<div style="text-info">{{dataObj.field0007}}</div>
						<div class="file-info" v-if="dataObj.field0006Array && dataObj.field0006Array.length" v-for="(item, index) in dataObj.field0006Array">{{item.fileName}}</div>
					</td>
				</tr>
				<tr height="381">
					<td class="label table-border-bottom-right" style="line-height: 40px;">监督检查情况</td>
					<td colspan="4" class="table-border-bottom table-row-right">
						<div class="value-box value">
							<div class="text-info-1">
								<el-checkbox disabled v-model="dataObj.field0008 == '1' ? checked1 : checked2"><span class="info-title">发现的问题：</span></el-checkbox>
								<span>{{dataObj.field0011}}</span>
							</div>
							<div class="text-info-1">
								<el-checkbox disabled v-model="dataObj.field0009 == '1' ? checked1 : checked2"><span class="info-title">整改的意见：</span></el-checkbox>
								<span>{{dataObj.field0012}}</span>
							</div>
							<div class="text-info-1">
								<el-checkbox disabled v-model="dataObj.field0010 == '1' ? checked1 : checked2"><span class="info-title">其它</span></el-checkbox>
								<span>{{dataObj.field0013}}</span>
							</div>
							<div class="text-info-2">监督检查人：{{dataObj.field0014Str}}</div>
							<div class="text-info-3">
								<span>{{dataObj.field0015 | filterDate}}</span>
								<!-- <div class="text-value"></div>
								<div class="text-label">年</div>
								<div class="text-value"></div>
								<div class="text-label">月</div>
								<div class="text-value"></div>
								<div class="text-label">日</div> -->
							</div>
						</div>
					</td>
				</tr>
				<tr height="242">
					<td class="label table-border-bottom-right" style="line-height: 40px;">备注</td>
					<td colspan="4" style="position: relative;" class="table-border-bottom table-row-right">
						<div class="hint-text" style="text-align: left;">（其他需说明的情况，包括发现的严重问题材料、整改情况等）</div>
						<div class="file-info" v-if="dataObj.field0016Array && dataObj.field0016Array.length" v-for="(item, index) in dataObj.field0016Array">{{item.fileName}}</div>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer">
			注：如申报事项较多，可自行设计统计表，纪检监察室不定期抽查。
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
			// 	dataObj: {
			// 		"field0001": "党组织",
			// 		"field0002": "监督事项名称",
			// 		"field0003": "牵头责任单位",
			// 		"field0004": "工作负责人",
			// 		"field0005": "2021-05-08 09:23:00",
			// 		"field0007": "监督事项概要",
			// 		"field0006Array": [
			// 			"监督事项概要附件"
			// 		],
			// 		"field0008": "发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题发现的问题",
			// 		"field0009": "0",
			// 		"field0010": "0",
			// 		"field0014Str": "张珊",
			// 		"field0015": "2022-03-01 18:00:00",
			// 		"field0016Array": [
			// 			"备注附件"
			// 		],
			// 		"field0017": "其它情况"
			// 	},
				checked1: true,
				checked2: false,
			}
		},
		props: {
			dataObj: {
				type: Object,
				default: {}
			}
		},
		watch: {
			dataObj(newVal, oldVal) {
				this.dataObj = newVal;
			}
		},
		filters: {
			filterTime(time) {
				return time && time.length > 16 ? time.substr(0, 16) : time
			},
			filterDate(date) {
				return date && date.length > 10 ? date.substr(0, 10) : date
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@import '../../styles/tables.scss';
	@import '../../styles/tables-variables.scss';

	.content {
		font-size: $table-font-size-m;

		.table {

			.value-box {
				padding-left: 20px;

				.text-info-1 {
					margin-top: 10px;
					height: 90px;

					.info-title {
						font-size: $table-font-size-m;
					}
				}

				.text-info-2 {
					width: 200px;
					height: 50px;
					margin: 0 auto;
				}

				.text-info-3 {
					width: 100%;
					height: 40px;
					text-align: right;
					padding-right: 80px;
					// width: 300px;
					// float: right;
					// display: flex;

					// .text-label {
					// 	width: 20px;
					// }

					// .text-value {
					// 	width: 65px;
					// }
				}
			}

			.hint-text {
				width: 100%;
				height: 30px;
				position: absolute;
				text-align: center;
				top: 8px;
				left: 5px;
			}
		}
	}
</style>
