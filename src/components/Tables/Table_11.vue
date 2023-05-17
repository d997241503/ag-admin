<template>
	<div class="content">
		<div class="title">改进领导干部工作作风的规定执行情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="122" class="label table-border-bottom-right">党组织</td>
					<td colspan="2" class="label table-border-bottom-right">{{dataObj.field0001}}</td>
					<td class="label table-border-bottom-right">时间范围</td>
					<td colspan="2" class="label table-border-bottom table-row-right">
						{{dataObj.field0002 | filterTime}}
						{{dataObj.field0002 ? '至' : ''}}<br>{{dataObj.field0003 | filterTime}}
					</td>
				</tr>
				<tr height="53">
					<td rowspan="2" colspan="2" class="label table-border-bottom-right">落实相关</td>
					<td colspan="4" class="label table-border-bottom table-row-right">
						中层干部执行规定情况（粘贴OA截图）
					</td>
				</tr>
				<tr height="53">
					<td width="135" class="table-border-bottom-right">
						<span class="file-info"
							v-if="dataObj.field0004Array && dataObj.field0004Array.length">{{dataObj.field0004Array[0].fileName}}</span>
					</td>
					<td width="135" class="table-border-bottom-right">
						<span class="file-info"
							v-if="dataObj.field0004Array && dataObj.field0004Array.length > 1">{{dataObj.field0004Array[1].fileName}}</span></td>
					<td width="135" class="table-border-bottom-right">
						<span class="file-info"
							v-if="dataObj.field0004Array && dataObj.field0004Array.length > 2">{{dataObj.field0004Array[2].fileName}}</span></td>
					<td width="135" class="table-border-bottom table-row-right">
						<span class="file-info"
							v-if="dataObj.field0004Array && dataObj.field0004Array.length > 3">{{dataObj.field0004Array[3].fileName}}</span></td>
				</tr>
				<tr height="110" v-for="(item,index) in list" :key="index">
					<td colspan="2" class="label table-border-bottom-right">{{item.label}}</td>
					<td class="table-border-bottom-right">
						<span class="file-info"
							v-if="dataObj[item.key] && dataObj[item.key].length">{{dataObj[item.key][0].fileName}}</span>
					</td>
					<td class="table-border-bottom-right">
						<span class="file-info"
							v-if="dataObj[item.key] && dataObj[item.key].length > 1">{{dataObj[item.key][1].fileName}}</span>
					</td>
					<td class="table-border-bottom-right">
						<span class="file-info"
							v-if="dataObj[item.key] && dataObj[item.key].length > 2">{{dataObj[item.key][2].fileName}}</span>
					</td>
					<td class="table-border-bottom table-row-right">
						<span class="file-info"
							v-if="dataObj[item.key] && dataObj[item.key].length > 3">{{dataObj[item.key][3].fileName}}</span>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer">
			注：括号内的附件材料需要相关OA截图提供；6月、11月中旬报告。
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
				// 	"field0001": "党组织",
				// 	"field0002": "2021-08-22 15:00:00",
				// 	"field0003": "2021-09-22 15:00:00",
				// 	"field0004Array": [
				// 		"xxxx"
				// 	],
				// 	"field0005": "中层干部执行规定情况",
				// 	"field0006Array": [
				// 		"xxxx"
				// 	],
				// 	"field0007": "落实好校园日常",
				// 	"field0008Array": [
				// 		"xxxx"
				// 	],
				// 	"field0009": "落实好院领导",
				// 	"field0010Array": [
				// 		"xxxx"
				// 	],
				// 	"field0011": "做好专题",
				// 	"field0012Array": [
				// 		"xxxx"
				// 	],
				// 	"field0013": "听评课良性工作",
				// 	"field0014Array": [
				// 		"xxxx"
				// 	],
				// 	"field0015": "其他关于深入基层"
				// },
				list: [{
					label: '1.落实好校园日常巡查制度（标准：至少2次/周、1小时/次）',
					key: 'field0006Array'
				}, {
					label: '2.落实好院领导接待日工作（标准：至少1次/学期）',
					key: 'field0008Array'
				}, {
					label: '3.做好专题调研工作（标准：针对群众民主生活会提出的问题）',
					key: 'field0010Array'
				}, {
					label: '4.听、评课良性工作机制（标准;1次/开学第一周，至少4次/学期、二级学院领导至少8次/学期）',
					key: 'field0012Array'
				}, {
					label: '5.其他关于深入基层联系群众的规定（标准：二级学院院长、总支书记、就业服务中心主任每年回访学生顶岗实习或就业企业不少于 10 家。）',
					key: 'field0014Array'
				}]
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

			.label {
				line-height: 30px;
				padding: 10px 5px;
			}

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
