<template>
	<div class="content">
		<div class="title">开展廉政家访活动情况报告</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="140" class="label table-border-bottom-right">党组织</td>
					<td colspan="2" class="label table-border-bottom-right">
						<div style="width: 340px;word-wrap:break-word">{{dataObj.field0001}}</div>
					</td>
					<td colspan="2" class="label table-border-bottom-right">家访人员</td>
					<td width="168" class="label table-border-bottom table-row-right">{{dataObj.field0002}}</td>
				</tr>
				<tr height="60">
					<td class="label table-border-bottom-right">家访时间</td>
					<td width="230" class="label table-border-bottom-right">
						<div style="width: 215px;word-wrap:break-word">{{dataObj.field0003}}</div>
					</td>
					<td colspan="2" class="label table-border-bottom-right">受访对象家属</td>
					<td colspan="2" class="label table-border-bottom table-row-right">
						<div style="width: 240px;word-wrap:break-word">{{dataObj.field0004}}</div>
					</td>
				</tr>
				<tr height="700">
					<td class="label table-border-bottom-right" style="line-height: 40px;">家</br>访</br>情</br>况</td>
					<td colspan="5" style="position: relative;" class="table-border-bottom table-row-right">
						<div class="hint-text value">
							<span>（谈话内容按照“五访”要求访配偶、访父母、访子女、访邻居、访居住社区，即家常、家情、家风、干部家属的思想、家庭、生活状况、遵守家庭美德、社会道德情况；粘贴家访图片、相关记录、新闻报道等。）</span>
						</div>
						<div class="value" style="padding: 130px 0 10px 0;">{{dataObj.field0006}}</div>
						<div class="value file-info" v-if="dataObj.field0005Array && dataObj.field0005Array.length" v-for="(item, index) in dataObj.field0005Array">{{item.fileName}}</div>
					</td>
				</tr>
				<tr height="212">
					<td class="label table-border-bottom-right" style="line-height: 40px;">意</br>见</br>建</br>议</td>
					<td colspan="5" style="position: relative;" class="value table-border-bottom table-row-right">
						<div>{{dataObj.field0008}}</div>
						<div class="value file-info" v-if="dataObj.field0007Array && dataObj.field0007Array.length" v-for="(item, index) in dataObj.field0007Array">{{item.fileName}}</div>
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
				// 	"field0002": "张珊",
				// 	"field0003": "2021-05-23",
				// 	"field0004": "李仕",
				// 	"field0006": "家访情况",
				// 	"field0005Array": [
				// 		"家访情况附件.xlx"
				// 	],
				// 	"field0008": "意见建议",
				// 	"field0007Array": [
				// 		"意见建议附件.xlx"
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
				position: absolute;
				text-align: justify;
				line-height: 30px;
				top: 8px;
				left:0px;
			}
		}
	}
</style>
