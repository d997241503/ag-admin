<template>
    <div class="select-dept" v-loading="treeLoading">
        <el-popover class="seldept-item" v-model="popoverVisibel" trigger="click" ref="deptListPopover">
            <el-tree style="min-width: 350px;" ref="tree" :props="defaultProps" :data="treeData"
                :default-expanded-keys="[index]" node-key="id" :expand-on-click-node="true" class="roll-containers" :show-checkbox="multiple" @check="handleCheck">
                    <span class="custom-tree-node" slot-scope="{ node, data }" @click="multiple ? null : handleCheckChange(data)">
                        <span
                            v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
                        </span>
                    </span>
                </el-tree>
        </el-popover>
       <el-input :value="name" v-popover:deptListPopover placeholder="请选择单位" readonly>
            <i v-if="name" slot="suffix" @click.stop="handleDelete()"
                class="el-icon-circle-close el-input__icon">
            </i>
        </el-input>
    </div>
</template>

<script>
    import {
		getTree
	} from 'api/admin/department/index';
  export default {
    name:'SelectDeptItem',
    data() {
        return {
            popoverVisibel: false,
            index: 0,
            defaultProps: {
                children: 'children',
                label: 'departmentFullName'
            },
            deptName: '',
            checkedNodes: [],
            treeData: [],
            treeLoading: true
        }
    },
    props: {
        value: null,
        multiple: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.getTreeInfo()
    },
    methods: {
        getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.treeLoading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.treeLoading = false;
						}
					});
			},
        // 单选
        handleCheckChange(data) {
            this.deptId = data.id;
            this.deptName = data.departmentFullName;
            this.popoverVisibel = false;
            this.$emit('change', {id: data.id, name: data.departmentFullName})
        },
        // 多选
        handleCheck(current, data) {
            this.checkedNodes = data.checkedNodes
            this.deptId = this.checkedNodes.map(item => item.id)
            this.$emit('change', checkedNodes)
        },
        handleDelete() {
            this.popoverVisibel = false;
            this.deptId = this.multiple ? [] : undefined
            this.deptName = ''
            if (this.multiple) {
                this.checkedNodes = []
                this.$refs.tree.setCheckedKeys([]);
                this.$refs.tree.setCurrentKey(null);
            }
            this.$emit('change', {})
        },
    },
    computed: {
        deptId: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        name() {
            return this.multiple
                ? this.checkedNodes.map(item => {
                    return item.departmentFullName
                }).join('、')
                : this.deptName
        }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>