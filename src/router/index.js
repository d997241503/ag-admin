import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

/* layout */
import Layout from '../views/layout/Layout';
import LayoutBlank from '../views/layout/LayoutBlank';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
	// {
	// 	path: '/',
	// 	// component: _import('largeTriple/large/index'),
	// 	component: _import('casesClues/clue/index'),
	// 	hidden: true
	// },
	{
		path: '/dashboard/index',
		component: _import('dashboard/index'),
		hidden: true
	},
	{
		path: '/backstage/index',
		component: _import('dashboard/backstage/index'),
		hidden: true
	},
	{
		path: '/login',
		component: _import('login/index'),
		hidden: true
	},
	{
		path: '/authredirect',
		component: _import('login/authredirect'),
		hidden: true
	},
	{
		path: '/404',
		component: _import('error/404'),
		hidden: true
	},
	{
		path: '/401',
		component: _import('error/401'),
		hidden: true
	},
	{
		path: '/ssologin',
		component: _import('dashboard/ssologin'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		// component: _import('dashboard/index'),
		redirect: '/dashboard',
		// name: '首页',
		icon: 'form',
		// hidden: true,
		noDropdown: true,
		children: [{
			path: 'dashboard',
			component: _import('dashboard/index'),
			name: '首页',
		}]
	},

	{ // 监督准备档案下沉页面
		path: '/filesPrepare_',
		component: Layout,
		name: '监督准备档案 ',
		hidden: true,
		icon: 'sy_folderOpen',
		authority: 'filesPrepare_',
		children: [
			]
	},

	{ // 监督实施档案下沉页面
		path: '/filesImplementation_',
		component: Layout,
		name: '监督实施档案 ',
		hidden: true,
		icon: 'setting',
		authority: 'filesImplementation_',
		children: [
			]
	},

	{ // 执纪审查中心下沉页面
		path: '/reviewDiscipline_',
		component: Layout,
		name: '执纪审查中心 ',
		hidden: true,
		icon: 'setting',
		authority: 'reviewDiscipline_',
		children: [
			]
	},

	{ // 廉政宣教下沉页面
		path: '/educationIncorruptible_',
		component: Layout,
		name: '廉政宣教 ',
		hidden: true,
		icon: 'setting',
		authority: 'educationIncorruptible_',
		children: [
			]
	},

	{ // 监督执纪数据中心下沉页面
		path: '/dataDisciplinary_',
		component: Layout,
		name: '监督执纪数据中心 ',
		hidden: true,
		icon: 'setting',
		authority: 'dataDisciplinary_',
		children: []
	},

	{ // 工作流程管理下沉页面
		path: '/bpmSys_',
		component: Layout,
		name: '工作流程管理 ',
		icon: 'setting',
		hidden: true,
		authority: 'bpmSys_',
            children: [
        ],
	},
    {
		path: '/taskCenter',
		component: Layout,
		name: '任务中心',
		hidden: true,
		children: [
            {
                path: '',
                component: _import('dashboard/components/TaskCenter'),
                hidden: true,
                noDropdown: true,
            }
        ]
	}
]

export default new Router({
	// mode: 'history', //后端支持可开
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
});

export const asyncRouterMap = [
	{
		path: '/filesPrepare',
		component: Layout,
		name: '监督准备档案',
		icon: 'fa-user',
		authority: 'filesPrepare',
        meta: {
            isSubmenu: true
        },
		children: [
			{
				path: 'filesPer/index',
				// component: _import('archives/index'),
				component: LayoutBlank,
				noDropdown: true,
				props: true,
				name: '个人档案',
				authority: 'filesPer/index',
				children: [
					{
						path: '',
						component: _import('archives/filesPer'),
						hidden: true,
						noDropdown: true,
					}, 
					{
						path: 'solidificationPut/detail',
						component: _import('archives/edit'),
						name: '查看',
						hidden: true,
						meta: {
							parentName: "filesPer/index",
							activeMenu: '/filesPrepare/filesPer/index'
						}
					},
					{
						path: 'solidificationPut/edit',
						component: _import('archives/edit'),
						name: '编辑',
						hidden: true,
						meta: {
							parentName: "filesPer/index",
							activeMenu: '/filesPrepare/filesPer/index'
						}
					},
					{
						path: 'solidificationPut/check',
						component: _import('archives/edit'),
						name: '审核',
						hidden: true,
						meta: {
							parentName: "filesPer/index",
							activeMenu: '/filesPrepare/filesPer/index'
						}
					},
					{
						path: 'solidificationPut/add',
						component: _import('archives/edit'),
						name: '提报',
						hidden: true,
						meta: {
							parentName: "filesPer/index",
							activeMenu: '/filesPrepare/filesPer/index'
						}
					},
					{
									path: 'history',
									component: LayoutBlank,
									// component: _import('archives/history'),
									name: '历史任务',
									hidden: true,
									meta: {
										parentName: "/filesPer/index"
									},
									children: [
										{
											path: '',
											component: _import('archives/history'),
											hidden: true,
											meta: {
												parentName: 'filesPer/index',
												activeMenu: '/filesPrepare/filesPer/index'
											}
										},
										{
										path: 'detailsHis',
										component: LayoutBlank,
										// component: _import('archives/detailsHis'),
										name: '查看详情',
										hidden: true,
										// meta: {
										// 	parentName: "history",
										// 	activeMenu: '/filesPrepare/filesPer/index'
										// },
										children: [
											{
												path: '',
												component: _import('archives/detailsHis'),
												hidden: true,
												noDropdown: true,
												meta: {
													parentName: "/filesPrepare/filesPer/index/history",
													activeMenu: '/filesPrepare/filesPer/index'
												},
											},
											{
												path: 'solidificationPut/detail',
												component: _import('archives/edit'),
												name: '查看',
												hidden: true,
												meta: {
													parentName: "detailsHis",
													activeMenu: '/filesPrepare/filesPer/index'
												}
											}
										]
										}
									]
								}, {
									path: 'taskMy',
									component: LayoutBlank,
									// component: _import('archives/nonInspectionFilesPer'),
									name: '我的任务',
									hidden: true,
									children: [
										{
											path: '',
											component: _import('archives/nonInspectionFilesPer'),
											hidden: true,
											noDropdown: true,
							meta: {
							parentName: "filesPer/index",
							activeMenu: '/filesPrepare/filesPer/index'
							},
										},
										{
											path: 'solidificationPut/detail',
											component: _import('archives/edit'),
											name: '查看',
											hidden: true,
											meta: {
												parentName: "taskMy",
												activeMenu: '/filesPrepare/filesPer/index'
											}
										},
						{
											path: 'solidificationPut/edit',
											component: _import('archives/edit'),
											name: '编辑',
											hidden: true,
											meta: {
												parentName: "taskMy",
												activeMenu: '/filesPrepare/filesPer/index'
											}
										},
						{
											path: 'solidificationPut/check',
											component: _import('archives/edit'),
											name: '审核',
											hidden: true,
											meta: {
												parentName: "taskMy",
												activeMenu: '/filesPrepare/filesPer/index'
											}
										},
						{
								path: 'solidificationPut/add',
								component: _import('archives/edit'),
								name: '提报',
								hidden: true,
								meta: {
									parentName: "taskMy",
									activeMenu: '/filesPrepare/filesPer/index'
								}
							}
						]
					}, 
				]
			}, {
				path: 'informationCom/index',
				// component: _import('archives/index'),
				component: LayoutBlank,
				noDropdown: true,
				props: true,
				name: '单位信息档案',
				authority: 'informationCom/index',
				children: [
					{
						path: '',
						component: _import('archives/informationCom'),
						hidden: true,
						noDropdown: true,
					},
					{
						path: 'history',
						component: _import('archives/informationHistory'),
						name: '历史任务',
						hidden: true,
						meta: {
							parentName: "informationCom/index",
							activeMenu: '/filesPrepare/informationCom/index'
						}
					}
				]
			}, {
				path: 'screeningComCom/index',
				// component: _import('archives/index'),
				component: LayoutBlank,
				noDropdown: true,
				props: true,
				name: '单位风险点排查',
				authority: 'screeningComCom/index',
				children: [
					{
						path: '',
						component: _import('archives/screeningCom'),
						hidden: true,
						noDropdown: true,
					},
				]
			}
		]
	},{
		path: '/filesImplementation',
		component: Layout,
		name: '监督实施档案',
		icon: 'service',
		authority: 'filesImplementation',
        meta: {
            isSubmenu: true
        },
		children: [{
			path: 'meeting',
			// component: _import('meetingJoint/meeting/index'),
			component: LayoutBlank,
			name: '监督联席会',
			noDropdown: true,
			authority: 'meeting',
			props: true,
			children: [
				{
					path: '',
					component: _import('meetingJoint/meeting/index'),
					// name: '监督联席会',
					hidden: true,
					noDropdown: true,
					// meta: {
					// 	parentName: "meeting"
					// }
				},{
                    path: 'meetingDetail',
                    component: _import('meetingJoint/meeting/detail'),
                    name: '监督联席会详情',
                    hidden: true,
                    noDropdown: true,
                    meta: {
                        parentName: "meeting",
                        activeMenu: '/filesImplementation/meeting'
                    },
                },
                {
                    path: 'meetingEdit',
                    component: _import('meetingJoint/meeting/detail'),
                    name: '监督联席会编辑',
                    hidden: true,
                    noDropdown: true,
                    meta: {
                        parentName: "meeting",
                        activeMenu: '/filesImplementation/meeting'
                    }
                },
			    {
                    path: 'topicMng',
                    component: LayoutBlank,
                    name: '上报议题管理',
                    hidden: true,
                    children: [
                        {
                            path: '',
                            component: _import('meetingJoint/meeting/topicMng/TopicManage'),
                            hidden: true,
                            meta: {
                            parentName: 'meeting',
                            activeMenu: '/filesImplementation/meeting'
                            }
                        },
                        // {
                        //     path: 'reportTopic',
                        //     component: _import('meetingJoint/meeting/topicMng/ReportTopic'),
                        //     name: '上报议题',
                        //     hidden: true,
                        //     meta: {
                        //     parentName: "topicMng",
                        //     activeMenu: '/filesImplementation/meeting'
                        //     }
                        // }
                    ]
                }, {
                        path: 'requestMeeting',
                        component: _import('meetingJoint/meeting/RequestMeeting'),
                        name: '添加会议',
                        hidden: true,
                        noDropdown: true,
                        meta: {
                            parentName: "meeting",
                            activeMenu: '/filesImplementation/meeting'
                        }
                    }
                ]
		}, {
			path: 'large',
			// component: _import('largeTriple/large/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '三重一大',
			authority: 'large',
			children: [
				{
					path: '',
					component: _import('largeTriple/large/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: '/accountLarge',
					component: _import('largeTriple/large/account'),
					name: '台账',
					hidden: true,
					meta: {
						parentName: "large",
						activeMenu: '/filesImplementation/large'
					}
				}, {
					path: '/ruleLarge',
					component: _import('largeTriple/large/rule'),
					name: '规则设置',
					hidden: true,
					meta: {
						parentName: "large",
						activeMenu: '/filesImplementation/large'
					}
				}, {
					path: '/situationLarge',
					component: LayoutBlank,
					// component: _import('largeTriple/large/inspectionOrSubsidiary'),
					name: '三重一大情况',
					hidden: true,
					children: [
                        {
                            path: '',
                            component: _import('largeTriple/large/inspectionOrSubsidiary'),
                            hidden: true,
                            meta: {
								parentName: "large",
								activeMenu: '/filesImplementation/large'
							},
                        },
                        {
                            path: 'detailLarge',
                            component: _import('largeTriple/large/detail'),
                            name: '查看',
                            hidden: true,
							meta: {
								parentName: "large",
								activeMenu: '/filesImplementation/large'
							},
                        }
                    ]
					
				}, 
		]
		}, {
			path: 'special',
			// component: _import('specialSup/special/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '专项监督',
			authority: 'special',
			children: [
				{
					path: '',
					component: _import('specialSup/special/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: 'newlySpecial',
					component: _import('specialSup/special/patrolInternalNewly'),
					name: '下发专项监督事项',
					hidden: true,
					meta: {
						parentName: "special", // 解决新建页面不显示侧边栏问题
						activeMenu: '/filesImplementation/special'
					}
				},
                // {
				// 	path: 'editOrg',
				// 	component: _import('specialSup/special/patrolInternalNewly'),
				// 	name: '去提报',
				// 	hidden: true,
				// 	meta: {
				// 		parentName: "special", // 解决新建页面不显示侧边栏问题
				// 		activeMenu: '/filesImplementation/special'
				// 	}
				// },
                // {
				// 	path: 'detailOrg',
				// 	component: _import('specialSup/special/patrolInternalNewly'),
				// 	name: '查看详情',
				// 	hidden: true,
				// 	meta: {
				// 		parentName: "special", // 解决新建页面不显示侧边栏问题
				// 		activeMenu: '/filesImplementation/special'
				// 	}
				// },
                {
					path: 'specialDetail',
					component: LayoutBlank,
					// component: _import('specialSup/special/SpecialDetail'),
					name: '查看',
					hidden: true,
					meta: {
						parentName: "special",
						activeMenu: '/filesImplementation/special'
					},
					children: [
						{
							path: '',
							component: _import('specialSup/special/SpecialDetail'),
							hidden: true,
							noDropdown: true,
							meta: {
								parentName: "special",
								activeMenu: '/filesImplementation/special'
							},
						},
						{
							path: 'editOrg',
							component: _import('specialSup/special/patrolInternalNewly'),
							name: '去提报',
							hidden: true,
							meta: {
								parentName: "specialDetail", // 解决新建页面不显示侧边栏问题
								activeMenu: '/filesImplementation/special'
							}
						},
						{
							path: 'detailOrg',
							component: _import('specialSup/special/patrolInternalNewly'),
							name: '查看详情',
							hidden: true,
							meta: {
								parentName: "specialDetail", // 解决新建页面不显示侧边栏问题
								activeMenu: '/filesImplementation/special'
							}
						},
					]
				}
			]
		}, {
			path: 'employ',
			// component: _import('employment/employ/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '选人用人',
			authority: 'employ',
			children: [
                {
					path: '',
					component: _import('employment/employ/index'),
					hidden: true,
					noDropdown: true,
				},
                {
					path: 'viewCheck',
					component: _import('employment/employ/ViewCheck'),
                    name: '查看',
					hidden: true,
                    meta: {
						parentName: "employ",
						activeMenu: '/filesImplementation/employ'
					}
				},
                {
					path: 'editCheck',
					component: _import('employment/employ/ViewCheck'),
                    name: '审核操作',
					hidden: true,
                    meta: {
						parentName: "employ",
						activeMenu: '/filesImplementation/employ'
					}
				},
			]
		}, {
			path: 'talkInc',
			// component: _import('talkIncorruption/talkInc/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '廉政谈话',
			authority: 'talkInc',
			children: [
				{
					path: '',
					component: _import('talkIncorruption/talkInc/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: '/accountTalkInc',
					component: _import('talkIncorruption/talkInc/account'),
					name: '子公司台账',
					hidden: true,
					meta: {
						parentName: "talkInc",
						activeMenu: '/filesImplementation/talkInc'
					}
				},
			]
		}, {
			path: 'responsibility',
			// component: _import('responsibilityImp/responsibility/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '两个责任落实',
			authority: 'responsibility',
			children: [
				{
					path: '',
					component: _import('responsibilityImp/responsibility/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: '/putDel',
					component: _import('responsibilityImp/responsibility/temporaryPut'),
					name: '查看',
					hidden: true,
					meta: {
						parentName: "responsibility",
						activeMenu: '/filesImplementation/responsibility'
					}
				}, 
				{
					path: '/putResHand',
					component: _import('responsibilityImp/responsibility/temporaryPut'),
					name: '提报',
					hidden: true,
					meta: {
						parentName: "responsibility",
						activeMenu: '/filesImplementation/responsibility'
					}
				}, 
				{
					path: '/putResExamine',
					component: _import('responsibilityImp/responsibility/temporaryPut'),
					name: '审核',
					hidden: true,
					meta: {
						parentName: "responsibility",
						activeMenu: '/filesImplementation/responsibility'
					}
				}, 
				{
					path: '/responsibilityDel',
					component: LayoutBlank,
					// component: _import('responsibilityImp/responsibility/responsibilityDel'),
					name: '两个责任落实查看',
					hidden: true,
					meta: {
						parentName: "responsibility",
						activeMenu: '/filesImplementation/responsibility'
					},
					children: [
						{
							path: '',
							component: _import('responsibilityImp/responsibility/responsibilityDel'),
							hidden: true,
							noDropdown: true,
							meta: {
								parentName: "responsibility",
								activeMenu: '/filesImplementation/responsibility'
							},
						},
						{
							path: '/putRes',
							component: _import('responsibilityImp/responsibility/temporaryPut'),
							name: '查看',
							hidden: true,
							noDropdown: true,
							meta: {
								parentName: "responsibility",
								activeMenu: '/filesImplementation/responsibility'
							},
						}
					]
				},
			]
		}, {
			path: 'patrolInternal',
			// component: _import('patrol/patrolInternal/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '内部巡查',
			authority: 'patrolInternal',
			children: [
				{
					path: '',
					component: _import('patrol/patrolInternal/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: '/newlyPatrolInternal',
					component: _import('patrol/patrolInternal/patrolInternalNewly'),
					name: '内部巡查',
					hidden: true,
					meta: {
						parentName: "patrolInternal", // 解决新建页面不显示侧边栏问题
						activeMenu: '/filesImplementation/patrolInternal'
					}
				}, {
					path: '/personnelPatrolPatrolInternal',
					component: _import('patrol/patrolInternal/personnelPatrol'),
					name: '巡查人员库',
					hidden: true,
					meta: {
						parentName: "patrolInternal", // 解决新建页面不显示侧边栏问题
						activeMenu: '/filesImplementation/patrolInternal'
					}
				},
			]
		}]
	
	},{
		path: '/reviewDiscipline',
		component: Layout,
		name: '执纪审查中心',
		icon: 'group_fill',
		authority: 'reviewDiscipline',
        meta: {
            isSubmenu: true
        },
		children: [{
			path: 'clue',
			// component: _import('casesClues/clue/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '线索及案件管理',
			authority: 'clue',
			children: [
				{
					path: '',
					component: _import('casesClues/clue/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: 'addClue',
					component: _import('casesClues/clue/AddClue'),
					name: '新增录入',
					hidden: true,
					meta: {
						parentName: "clue",
						activeMenu: '/reviewDiscipline/clue'
					}
				},
				{
					path: 'detailClue',
					component: _import('casesClues/clue/DetailClue'),
					name: '查看',
					hidden: true,
					meta: {
						parentName: "clue",
						activeMenu: '/reviewDiscipline/clue'
					}
				},
                {
					path: 'editClue',
					component: _import('casesClues/clue/AddClue'),
					name: '编辑',
					hidden: true,
					meta: {
						parentName: "clue",
                        activeMenu: '/reviewDiscipline/clue'
					}
				}
			]
		}]
	},{
		path: '/educationIncorruptible',
		component: Layout,
		name: '廉政宣教',
		icon: 'fa-users',
		authority: 'educationIncorruptible',
        meta: {
            isSubmenu: true
        },
		children: [{
			path: 'educationUser',
			// component: _import('incorrupt/educationUser/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '廉政宣教中心',
			children: [
				{
					path: '',
					component: _import('incorrupt/educationUser/index'),
					hidden: true,
					noDropdown: true,
				}
			]
		}, {
			path: 'education',
			// component: _import('incorrupt/education/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '廉政宣教管理',
			authority: 'education',
			children: [
				{
					path: '',
					component: _import('incorrupt/education/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: '/sortManagement',
					component: _import('incorrupt/education/sortManagement'),
					name: '分类管理',
					hidden: true,
					meta: {
						parentName: "education", // 解决新建页面不显示侧边栏问题
						activeMenu: '/educationIncorruptible/education'
					}
				}, {
					path: '/newlyLink',
					component: _import('incorrupt/education/newlyLink'),
					name: '新增超链接',
					hidden: true,
					meta: {
						parentName: "education", // 解决新建页面不显示侧边栏问题
						activeMenu: '/educationIncorruptible/education'
					}
				}, {
					path: '/newlyArticle',
					component: _import('incorrupt/education/newlyArticle'),
					name: '新增文章',
					hidden: true,
					meta: {
						parentName: "education", // 解决新建页面不显示侧边栏问题
						activeMenu: '/educationIncorruptible/education'
					}
				}, {
					path: '/articleDetail',
					component: _import('incorrupt/education/articleDetail'),
					name: '文章详情',
					hidden: true,
					meta: {
						parentName: "education", // 解决新建页面不显示侧边栏问题
						activeMenu: '/educationIncorruptible/education'
					}
				}, {
					path: '/educationStatistics',
					component: _import('incorrupt/education/educationStatistics'),
					name: '子公司统计',
					hidden: true,
					meta: {
						parentName: "education", // 解决新建页面不显示侧边栏问题
						activeMenu: '/educationIncorruptible/education'
					}
				}, 
			]
		}]
	},
    {
        path: '/educationUser',
        component: _import('incorrupt/educationUser/EducationUser'),
        name: '廉政宣教单页面',
        hidden: true
    },
    {
		path: '/dataDisciplinary',
		component: Layout,
		name: '监督执纪数据中心',
		icon: 'client',
		authority: 'dataDisciplinary',
        meta: {
            isSubmenu: true
        },
		children: [{
			path: 'prepareFiles',
			component: _import('disciplinaryData/disciplinary/index'),
			name: '监督准备数据',
			hidden: true,
			authority: 'prepareFiles'
		}, {
			path: 'implementationFiles',
			component: _import('disciplinaryData/disciplinary/index'),
			name: '监督实施数据',
			hidden: true,
			authority: 'prepareFiles'
		}, {
			path: 'reviewData',
			component: _import('disciplinaryData/disciplinary/index'),
			name: '执纪审查数据',
			hidden: true,
			authority: 'prepareFiles'
		}, {
			path: 'conferenceData',
			component: _import('disciplinaryData/disciplinary/index'),
			name: '监督联席会数据',
			hidden: true,
			authority: 'prepareFiles'
		},]
	},{
		path: '/backgroundManagement',
		component: Layout,
		name: '管理后台',
		icon: 'setting',
		authority: 'backgroundManagement',
        meta: {
            isSubmenu: true
        },
		children: [
			{
				path: '/informationCon',
				component: LayoutBlank,
				name: '配置信息管理',
				icon: 'setting',
				authority: 'informationCon',
                meta: {
                    isSubmenu: true
                },
				children: [{
					path: 'groupResidency',
					component: _import('archives/groupResidency/index'),
					name: '派驻组人员管理',
					authority: 'groupResidency'
				}, {
					path: 'categoryRes',
					component: _import('responsibilityImp/responsibility/category'),
					name: '两个责任类别管理',
					authority: 'categoryRes',
					meta: {
						parentName: "responsibility"
					}
				}, {
					path: 'themeCon',
					component: _import('meetingJoint/meeting/themeCon/index'),
					authority: 'themeCon',
					name: '联席会会议主题管理'
				}, 
				{
					path: 'typeLarge',
					component: _import('largeTriple/large/type'),
					name: '三重一大会议类型管理',
					authority: 'typeLarge'
				},{
					path: 'clueEvent',
					component: _import('casesClues/clueMng/index'),
					name: '线索及案件信息管理',
					authority: 'clueEvent',
					meta: {
						parentName: "clue"
					}
				},{
					path: 'FileNo',
					component: _import('archives/FileNo/index'),
					name: '单位档案编号管理',
					authority: 'FileNo',
				},{
					path: 'directoryArchive',
					component: _import('archives/directoryArchive/index'),
					name: '单位档案目录管理',
					authority: 'directoryArchive',
				},{
					path: 'categoryMan',
					component: _import('bpm/categoryMan/index'),
					name: '个人档案目录管理',
					authority: 'categoryMan',
				}]
			},
			{
				path: '/bpmSys',
				component: LayoutBlank,
				name: '工作流程管理',
				icon: 'setting',
				authority: 'bpmSys',
                meta: {
                    isSubmenu: true
                },
				children: [{
					path: 'formManager',
					// component: _import('bpm/form/index'),
					component: LayoutBlank,
					noDropdown: true,
					props: true,
					name: '流程表单',
					authority: 'formManager',
					children: [
						{
							path: '',
							component: _import('bpm/form/index'),
							hidden: true,
							noDropdown: true,
						},
						// {
						// 	path: '/modelDesign',
						// 	component: _import('bpm/model/modelEditor'),
						// 	name: '设计流程',
						// 	hidden: true,
						// 	meta: {
						// 		parentName: "formManager" // 解决新建页面不显示侧边栏问题
						// 	}
						// },{
						// 	path: '/manager/definition',
						// 	component: _import('bpm/definition/index'),
						// 	name: '流程定义',
						// 	hidden: true,
						// 	meta: {
						// 		parentName: "formManager" // 解决新建页面不显示侧边栏问题
						// 	}
						// },
						{
							path: '/form/formAdd',
							// component: _import('bpm/form/formEditor'),
							component: _import('bpm/design/index'),
							name: '设计表单-新增',
							hidden: true,
							meta: {
								parentName: "formManager", // 解决新建页面不显示侧边栏问题
								activeMenu: '/bpmSys/formManager'
							}
						},{
							path: '/form/formEdit',
							// component: _import('bpm/form/formEditor'),
							component: _import('bpm/design/index'),
							name: '设计表单-修改',
							hidden: true,
							meta: {
								parentName: "formManager", // 解决新建页面不显示侧边栏问题
								activeMenu: '/bpmSys/formManager' // 解决新建页面不显示侧边栏问题
							}
						},
					]
				}, {
					path: 'modelManager',
					// component: _import('bpm/model/index'),
					component: LayoutBlank,
					noDropdown: true,
					props: true,
					name: '流程模型',
					authority: 'modelManager',
					children: [
						{
							path: '',
							component: _import('bpm/model/index'),
							hidden: true,
							noDropdown: true,
						},
						{
							path: '/modelDesign',
							component: _import('bpm/model/modelEditor'),
							name: '设计流程',
							hidden: true,
							meta: {
								parentName: "modelManager", // 解决新建页面不显示侧边栏问题
								activeMenu: '/bpmSys/modelManager'
							}
						},{
							path: '/manager/definition',
							component: _import('bpm/definition/index'),
							name: '流程定义',
							hidden: true,
							meta: {
								parentName: "modelManager", // 解决新建页面不显示侧边栏问题
								activeMenu: '/bpmSys/modelManager'
							}
						},
					]
				}, {
					path: 'processInstanceManager',
					// component: _import('bpm/processInstance/index'),
					component: LayoutBlank,
					noDropdown: true,
					props: true,
					name: '我的流程',
					authority: 'processInstanceManager',
					children: [
						{
							path: '',
							component: _import('bpm/processInstance/index'),
							hidden: true,
							noDropdown: true,
						},
						{
							path: '/processInstance/create',
							component: _import('bpm/processInstance/create'),
							name: '发起流程',
							hidden: true,
							meta: {
								parentName: "processInstanceManager", // 解决新建页面不显示侧边栏问题
								activeMenu: '/bpmSys/processInstanceManager'
							}
						},{
							path: '/processInstance/detail',
							component: _import('bpm/processInstance/detail'),
							name: '流程详情',
							hidden: true,
							meta: {
								parentName: "processInstanceManager", // 解决新建页面不显示侧边栏问题
								activeMenu: '/bpmSys/processInstanceManager'
							}
						}
					]
				}, {
					path: 'taskTodoManager',
					component: _import('bpm/task/todo'),
					name: '待办任务',
					authority: 'taskTodoManager'
				}, {
					path: 'taskDoneManager',
					component: _import('bpm/task/done'),
					name: '已办任务',
					authority: 'taskDoneManager'
				}]
			},
			{
				path: '/baseManager',
				component: LayoutBlank,
				name: '基础配置管理',
				icon: 'setting',
				authority: 'baseManager',
                meta: {
                    isSubmenu: true
                },
				children: [{
					path: 'userManager',
					// icon: 'fa-user',
					component: _import('admin/user/index'),
					name: '用户管理',
					authority: 'userManager'
				}, {
					path: 'menuManager',
					// icon: 'category',
					component: _import('admin/menu/index'),
					name: '菜单管理',
					authority: 'menuManager'
				}, {
					path: 'groupManager',
					// icon: 'group_fill',
					component: _import('admin/group/index'),
					name: '角色权限管理',
					authority: 'groupManager'
				}, {
					path: 'groupTypeManager',
					// icon: 'fa-users',
					component: _import('admin/groupType/index'),
					name: '角色类型管理',
					authority: 'groupTypeManager'
				}, {
					path: 'gateLogManager',
					// icon: 'viewlist',
					component: _import('admin/gateLog/index'),
					name: '操作日志管理',
					authority: 'gateLogManager'
				}, {
					path: 'baseDict',
					component: _import('admin/dict/index'),
					name: '数据字典',
					authority: 'baseDict'
				}, {
					path: 'baseDepartment',
					component: _import('admin/department/index'),
					name: '部门管理',
					authority: 'baseDepartment'
				}]
			},
		]
	},
	{
		path: '/filesPerOverview',
		component: Layout,
		hidden: true,
		noDropdown: true,
		props: true,
		name: '档案全貌',
		children: [
		  {
			path: '',
			component: _import('archives/index'),
			hidden: true,
			noDropdown: true,
		  },
		  {
			path: '/screeningComCom',
			component: _import('archives/screeningCom'),
			name: '单位风险点排查',
			hidden: true,
			meta: {
			  parentName: "/filesPerOverview"
			}
		  }, {
			path: '/informationCom',
			component: _import('archives/informationCom'),
			name: '单位信息档案',
			hidden: true,
			meta: {
			  parentName: "/filesPerOverview"
			}
		  }, {
                path: '/filesPer',
                component: LayoutBlank,
                name: '个人档案',
                hidden: true,
                noDropdown: true,
                children: [
                    {
                        path: '',
                        component: _import('archives/filesPer'),
                        hidden: true,
                        meta: {
                            parentName: "/filesPerOverview"
                        },
                    },
                    {
                        path: 'solidificationPut/detail',
                        component: _import('archives/edit'),
                        name: '查看',
                        hidden: true,
                        meta: {
                            parentName: "filesPer",
                        }
                    },
                    {
                        path: 'solidificationPut/edit',
                        component: _import('archives/edit'),
                        name: '编辑',
                        hidden: true,
                        meta: {
                            parentName: "filesPer",
                        }
                    },
                    {
                        path: 'solidificationPut/check',
                        component: _import('archives/edit'),
                        name: '审核',
                        hidden: true,
                        meta: {
                            parentName: "filesPer",
                        }
                    },
                    {
                        path: 'solidificationPut/add',
                        component: _import('archives/edit'),
                        name: '提报',
                        hidden: true,
                        meta: {
                            parentName: "filesPer",
                        }
                    },
                    {
                        path: 'history',
                        component: _import('archives/history'),
                        name: '历史任务',
                        hidden: true,
                        meta: {
                        parentName: "/filesPer"
                        }
                    }, 
                    {
                        path: 'taskMy',
                        // component: _import('archives/nonInspectionFilesPer'),
                        component: LayoutBlank,
                        name: '我的任务',
                        hidden: true,
                        children: [{
                            path: '',
                            component: _import('archives/nonInspectionFilesPer'),
                            hidden: true,
                            noDropdown: true,
                            meta: {
                            parentName: "filesPer/index"
                            },
                        },
                        {
                            path: 'solidificationPut/detail',
                            component: _import('archives/edit'),
                            name: '查看',
                            hidden: true,
                            meta: {
                            parentName: "taskMy",
                            activeMenu: '/filesPrepare/filesPer/index'
                            }
                        },
                        {
                            path: 'solidificationPut/edit',
                            component: _import('archives/edit'),
                            name: '编辑',
                            hidden: true,
                            meta: {
                            parentName: "taskMy",
                            activeMenu: '/filesPrepare/filesPer/index'
                            }
                        },
                        {
                            path: 'solidificationPut/check',
                            component: _import('archives/edit'),
                            name: '审核',
                            hidden: true,
                            meta: {
                            parentName: "taskMy",
                            activeMenu: '/filesPrepare/filesPer/index'
                            }
                        },
                        {
                            path: 'solidificationPut/add',
                            component: _import('archives/edit'),
                            name: '提报',
                            hidden: true,
                            meta: {
                            parentName: "taskMy",
                            activeMenu: '/filesPrepare/filesPer/index'
                            }
                        }]
                    }
                ]
		    }, {
                path: '/temporaryPut',
                component: _import('archives/temporaryPut'),
                name: '临时任务提报',
                hidden: true,
                meta: {
                parentName: "/filesPerOverview"
                }
		    }, {
                path: '/solidificationPut/add',
                component: _import('archives/edit'),
                name: '操作',
                hidden: true,
                meta: {
                parentName: "/filesPerOverview"
                }
		    }, {
                path: '/subsidiary',
                component: LayoutBlank,
                // component: _import('archives/subsidiary'),
                name: '子公司信息',
                hidden: true,
                noDropdown: true,
                children: [
                    {
                        path: '',
                        component: _import('archives/subsidiary'),
                        hidden: true,
                        noDropdown: true,
                        meta: {
                            parentName: "/filesPerOverview"
                        },
                    },
                    {
                        path: 'solidificationPut/detail',
                        component: _import('archives/edit'),
                        name: '查看',
                        hidden: true,
                        meta: {
                            parentName: "/subsidiary"
                        }
				    }
			    ]
            },  {
                    path: '/personnelAll',
                    component: _import('archives/personnelAll'),
                    name: '单位内所有人员数据',
                    hidden: true,
                    meta: {
                    parentName: "/filesPerOverview"
                }
            }
		]
	},
];
