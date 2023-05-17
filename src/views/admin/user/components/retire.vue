<template>
	<div>
		<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-width="100px">
			<div class="cut-line">
				新增干部退休信息
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
					<el-form-item label="离退休状态" prop="politicalOutlook">
						<div  style="padding-left: 15px;color: #606266;">
							<el-select @change="elSelectChange" v-model="form.politicalOutlook" clearable placeholder="请选择状态" style="width: 100%;">
								<el-option v-for="item in politicalOutlooks" :key="item.id" :label="item.value" :value="item.id">
								</el-option>
							</el-select>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="离退休日期" prop="birthday">
						<div  style="padding-left: 15px;color: #606266;">
							<el-date-picker style="width: 100%;" value-format='yyyy-MM-dd' v-model="form.birthday" type="date" placeholder="请选择出生日期">
							</el-date-picker>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col>
					<el-form-item label="备注">
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
	</div>
</template>

<script>
	import {userGetstate,stateMSave } from 'api/admin/user/index'
	export default {
		name: 'userRetire',
		props:['retireData'],
		data() {
			return {
				loading:false,
				dataList:{},
				fileList:[],
				politicalOutlooks:[],
				upLimit:0,
				url:`/api/upload/uploads/uploadIncorrputFile?token=${this.$store.getters.token}`,
				form: {
					birthday:'',
					politicalOutlook:'',
					description:'',
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
							message: '请选择状态',
							trigger: 'change'
						}
					],
			},
			}
		},
		created() {
			this.dataList=this.retireData[0]
			this.init(this.retireData[0].id)
		},
		methods: {
			init(id) {
				userGetstate({type:'state'}).then(res=>{
					if(res.code==0){
						this.politicalOutlooks=res.data
					}
				})
			},
			elSelectChange(e){
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
							departmentId:this.dataList.departmentId,
							times2:this.form.birthday,
							text:this.form.description,
							stateId:this.form.politicalOutlook,
							enclosure1:this.form.fileList[0].enclosure,
							enclosure2:this.form.fileList[1].enclosure,
							enclosure3:this.form.fileList[2].enclosure,
							enclosure4:this.form.fileList[3].enclosure,
							enclosure5:this.form.fileList[4].enclosure,
						}
						stateMSave(form).then(res=>{
							if(res.code==0){
								this.$message.success('操作成功')
								this.cancel()
							}
						})
						
					} else {
						return false;
					}
				});
			},
			fileChange(e){
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
						if (file.url == this.form.fileList[i]) {
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
