<template>
	<div>
		<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-width="100px">
			<div class="cut-line">
				干部调用
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-col :span="11">
					<el-form-item label="机构名称">
						<div  style="padding-left: 15px;color: #606266;">{{dataList.departmentName}}</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="干部姓名名称">
						<div  style="padding-left: 15px;color: #606266;">{{dataList.name}}</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="调动本部门" prop="politicalOutlook">
						<div  style="padding-left: 15px;color: #606266;">
							<el-select @clear='clear' @focus="elSelectChange" v-model="politicalOutlook" clearable placeholder="请选择部门" style="width: 100%;">
							</el-select>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="调动休日期" prop="birthday">
						<div  style="padding-left: 15px;color: #606266;">
							<el-date-picker style="width: 100%;" value-format='yyyy-MM-dd' v-model="form.birthday" type="date" placeholder="请选择出生日期">
							</el-date-picker>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="调动单位" prop="work">
						<div  style="padding-left: 15px;color: #606266;">
							<el-input v-model="form.work"  maxlength="10" resize="none" show-word-limit placeholder="请输入2-10字符"></el-input>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col>
					<el-form-item label="备注" >
						<div  style="padding-left: 15px;color: #606266;">
							<el-input v-model="form.description" type="textarea" maxlength="100" resize="none" show-word-limit placeholder="请输入备注说明"></el-input>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="上传附件">
						<div  style="padding-left: 15px;color: #606266;">
							<el-upload :limit='5' class="upload-demo" :action="url" ref="upload"
								:before-remove="beforeRemove" :on-success='fileChange' 
								 :file-list="fileList">
								<el-button size="small" type="primary" class="no-print">点击上传</el-button>
							</el-upload>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer" align="right">
			<el-button @click="cancel('form')">取 消</el-button>
			<el-button  type="primary" @click="create('form')" :loading="loading">提 交</el-button>
		</div>
		<treedialog ref="treedialog" @refreshData='initData'></treedialog>
	</div>
</template>

<script>
	import {transferSave } from 'api/admin/user/index'
	import treedialog from './treeDialog'
	export default {
		name: 'Transfertire',
		props:['transferData'],
		components:{
			treedialog
		},
		data() {
			return {
				loading:false,
				dataList:{},
				fileList:[],
				upLimit:0,
				url:`/api/upload/uploads/uploadIncorrputFile?token=${this.$store.getters.token}`,
				politicalOutlook:'',
				form: {
					birthday:'',
					politicalOutlook:'',
					description:'',
					work:'',
					fileList:[
						{
							enclosure:''
						},
						{
							enclosure:''
						},
						{
							enclosure:''
						},
						{
							enclosure:''
						},
						{
							enclosure:''
						}
					]
				},
				rules: {
					birthday: [{
							required: true,
							message: '请选择调动日期',
							trigger: 'blur'
						}
					],
					politicalOutlook: [{
							required: true,
							message: '请选择部门',
							trigger: 'change'
						}
					],
					work: [{
							required: true,
							message: '请输入调动单位',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '长度在 2 到 10 个字符',
							trigger: 'blur'
						}
					]
			},
			}
		},
		created() {
			this.dataList=this.transferData[0]
		},
		methods: {
			clear(){
				this.form.politicalOutlook=''
				this.politicalOutlook=''
			},
			initData(e){
				this.form.politicalOutlook=e.id
				this.politicalOutlook=e.departmentName
			},
			init(id) {
			},
			elSelectChange(e){
				this.$refs.treedialog.init()
			},
			// 取消
			cancel(formName) {
				this.$emit("refreshData");
			},
			// 提交
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						let form={
							userId:this.dataList.id,
							departmentId:this.form.politicalOutlook,
							times2:this.form.birthday,
							text:this.form.work,
							enclosure1:this.form.fileList[0].enclosure,
							enclosure2:this.form.fileList[1].enclosure,
							enclosure3:this.form.fileList[2].enclosure,
							enclosure4:this.form.fileList[3].enclosure,
							enclosure5:this.form.fileList[4].enclosure,
						}
						transferSave(form).then(res=>{
							if(res.code==0){
								this.$message.success('调用成功')
									this.cancel()
							}
						})
					} else {
						return false;
					}
				});
			},
			fileChange(e){
				// this.form.fileList.push(e.file)
				this.form.fileList[this.upLimit].enclosure=e.file
				this.upLimit++
			},
			async beforeRemove(file, fileList) {
				await this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					for (let i = 0; i < this.form.fileList.length; i++) {
						if (file.url == this.form.fileList[i].enclosure) {
							this.form.fileList.splice(i, 1)
						}
					}
					return true
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
					reject(false);
				});
			}
		}
	}
</script>

<style scoped>
	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}

	.cut-line {
		font-size: 18px;
		font-weight: 600;
		border-left: 5px solid #bc0000;
		padding-left: 20px;
	}
</style>
