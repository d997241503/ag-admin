<template>
    <div class="select-dept box-form">
        <el-button @click="selectHandle()" type="text"
            class="but-css">
            {{btnText}}
            <span v-if="deptIds.length <= 100">({{deptIds.length}})</span>
            <span v-else>(100+)</span>
        </el-button>
        <el-input class="input-item elinput" ref="selectIt" readonly>
            <i slot="suffix" @click.stop="clear"
                class="el-icon-circle-close el-input__icon">
            </i>
        </el-input>
        <fuhsi-tree-check v-if="visible" ref="fuhsiTreeCheck" @refreshData="updateTreeData" :showDept="showDept">
		</fuhsi-tree-check>
    </div>
</template>

<script>
    import fuhsiTreeCheck from '@/components/fuhsi-tree-check';
  export default {
    name:'SelectDeptItem',
    components: {fuhsiTreeCheck},
    props: {
        btnText: {
            type: String,
            default: '选择子公司'
        },
        showDept: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: false,
            deptIds: []
        }
    },
    methods: {
        selectHandle() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.fuhsiTreeCheck.title = this.btnText
                this.$refs.fuhsiTreeCheck.init(this.deptIds);
            })
        },
        updateTreeData(data) {
            this.deptIds = data.nodes;
            this.$emit('check', data)
        },
        closeIt() {
            this.$refs.selectIt.blur();
        },
        clear() {
            this.deptIds = []
            if (this.$refs.fuhsiTreeCheck) this.$refs.fuhsiTreeCheck.clear()
            this.$emit('check', {nodes: [], checkedNodes: []})
        }
    }
  }
</script>

<style lang="scss" scoped>
    .box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 160px;
			margin-top: 4px;
		}
		/deep/ .el-select__tags span span .el-select__tags-text{
			margin-left: 0px;
			margin-top: 0px;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			// position:fixed;
			position: absolute;
			z-index: 999;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
	}
	.elinput{
		/deep/ .el-input__inner{
			text-indent: 100px;
		}
		/deep/ .el-icon-arrow-up:before {
			content: '';
		}
		/deep/ .el-select__input{
			text-indent: 100px;
		}
		/deep/ .el-select__tags {
			span:first-child{
				margin-top: 0px;
			}
		}
		/deep/ .el-tag.el-tag--info .el-tag__close {
			display: none;
		}
	}
	.input-item {
		width: 100%;
		
		li {
		    line-height: normal;
		    padding: 7px;
		
		    .name {
		      text-overflow: ellipsis;
		      overflow: hidden;
		    }
		    .addr {
		      font-size: 12px;
		      color: #b4b4b4;
			  
		    }
		
		    .highlighted .addr {
		      color: #ddd;
			 
		    }
		}
	}
</style>