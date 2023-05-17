<template>
	<div class="content">
		<div class="title">开展群众反映等突出问题调研和解决情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td colspan="2" class="label table-border-bottom-right">党组织（部门）</td>
					<td width="165" class="label table-border-bottom-right">{{dataObj.field0001}}</td>
					<td width="84" class="label table-border-bottom-right">时间</td>
					<td width="151" class="label table-border-bottom-right">{{dataObj.field0002}}</td>
					<td width="84" class="label table-border-bottom-right">地点</td>
					<td width="145" class="label table-border-bottom table-row-right">{{dataObj.field0003}}</td>
				</tr>
				<tr height="60">
					<td width="112" class="label table-border-bottom-right">主题</td>
					<td colspan="6" class="value table-border-bottom table-row-right">{{dataObj.field0004}}</td>
				</tr>
				<tr height="297">
					<td class="label table-border-bottom-right" style="line-height: 40px;">主</br>要</br>问</br>题</td>
					<td colspan="6" style="position: relative;" class="table-border-bottom table-row-right">
						<div class="value">{{dataObj.field0006}}</div>
						<div class="file-info" v-if="dataObj.field0005Array && dataObj.field0005Array.length" v-for="(item, index) in dataObj.field0005Array">{{item}}</div>
					</td>
				</tr>
				<tr height="297">
					<td class="label table-border-bottom-right" style="line-height: 40px;">采</br>取</br>措</br>施</td>
					<td colspan="6" style="position: relative;" class="table-border-bottom table-row-right">
						<div class="value">{{dataObj.field0008}}</div>
						<div class="file-info" v-if="dataObj.field0007Array && dataObj.field0007Array.length" v-for="(item, index) in dataObj.field0007Array">{{item}}</div>
					</td>
				</tr>
				<tr height="297">
					<td class="label table-border-bottom-right" style="line-height: 40px;">解</br>决</br>结</br>果</td>
					<td colspan="6" style="position: relative;" class="table-border-bottom table-row-right">
						<div class="value">{{dataObj.field0010}}</div>
						<div class="file-info" v-if="dataObj.field0009Array && dataObj.field0009Array.length" v-for="(item, index) in dataObj.field0009Array">{{item}}</div>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer">
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
				// 	"field0001": "党组织",
				// 	"field0002": "2022-02-22",
				// 	"field0003": "地点",
				// 	"field0004": "主题",
				// 	"field0006": "主要问题",
				// 	"field0005Array": [
				// 		"主要问题附件.xlx"
				// 	],
				// 	"field0008": "采取措施",
				// 	"field0007Array": [
				// 		"采取措施附件.xlx"
				// 	],
				// 	"field0010": "解决结果",
				// 	"field0009Array": [
				// 		"解决结果附件.xlx"
				// 	]
				// }
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

			.value-text {
				display: flex;
				flex-wrap: wrap;
				height: 93px;
				line-height: 93px;
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
