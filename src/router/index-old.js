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
	// {
	// 	path: '/',
	// 	component: Layout,
	// 	// component: _import('dashboard/ssologin'),
	// 	redirect: '/ssologin',
	// 	// name: '首页',
	// 	icon: 'sy_home',
	// 	// hidden: true,
	// 	noDropdown: true,
	// 	children: [{
	// 		path: 'ssologin',
	// 		component: _import('dashboard/ssologin'),
	// 		name: '首页',
	// 	}]
	// },
	// {
	// 	path: '/introduction',
	// 	component: Layout,
	// 	redirect: '/introduction/index',
	// 	icon: 'form',
	// 	noDropdown: true,
	// 	children: [{
	// 		path: 'index',
	// 		component: _import('introduction/index'),
	// 		name: '简述'
	// 	}]
	// },
	// // 纪检工作类档案
	// {
	// 	path: '/DisciplineInspectionWorkFiles',
	// 	component: _import('incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/index'),
	// 	name: '纪检工作类档案',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "纪检工作类档案"
	// 	},
	// 	children: [{
	// 			path: 'situationRegistration',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/investigationRegistrationForm'
	// 			),
	// 			name: '领导干部接受组织调查情况登记表',
	// 			formType: '14'
	// 		},
	// 		{
	// 			path: 'investigationHandling',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/reportInvestigationRegistrationForm'
	// 			),
	// 			name: '领导干部信访举报调查处理情况表',
	// 			formType: '15'
	// 		},
	// 		{
	// 			path: 'clueProcessing',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/clueProcessingRegistrationForm'
	// 			),
	// 			name: '领导干部问题线索处理情况表',
	// 			formType: '16'
	// 		},
	// 		{
	// 			path: 'conversation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/conversationRegistrationForm'
	// 			),
	// 			name: '领导干部廉政谈话情况登记表',
	// 			formType: '19'
	// 		},
	// 		{
	// 			path: 'disciplinePunishment',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/punishmentRegistrationForm'
	// 			),
	// 			name: '领导干部党纪处分登记表',
	// 			formType: '17'

	// 		},
	// 		{
	// 			path: 'disciplinaryAction',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/governmentDisciplinepunishment'
	// 			),
	// 			name: '领导干部政纪处分登记表',
	// 			formType: '18'
	// 		},
	// 		{
	// 			path: 'illegalSituation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/IllegalRegistrationForm'
	// 			),
	// 			name: '领导干部违法情况登记表',
	// 			formType: '20'
	// 		},
	// 		{
	// 			path: 'problemNotification',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/exposureRegistrationForm'
	// 			),
	// 			name: '领导干部违纪问题通报曝光情况登记表',
	// 			formType: '21'
	// 		},
	// 		{
	// 			path: 'personneLpunishment',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/causePunishment'
	// 			),
	// 			name: '事业单位人员处分情况登记表',
	// 			formType: '22'
	// 		},
	// 		{
	// 			path: 'eightProvisions',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/DisciplineInspectionWorkFiles/components/violationRegulations'
	// 			),
	// 			name: '违反中央八项规定情况登记表',
	// 			formType: '23'
	// 		}
	// 	]
	// },
	// // 干部信息类档案
	// {
	// 	path: '/CadreInformationArchives',
	// 	component: _import('incorrupt/integrityArchives/tableViews/CadreInformationArchives/index'),
	// 	name: '干部信息类档案',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "干部信息类档案"
	// 	},
	// 	children: [{
	// 			path: 'basicInformation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/CadreInformationArchives/components/cadreSituationTable'
	// 			),
	// 			name: '干部基本情况表',
	// 			formType: '24'
	// 		},
	// 		{
	// 			path: 'weddingsFunerals',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/CadreInformationArchives/components/eventReportForm'
	// 			),
	// 			name: '领导干部操办婚丧喜庆事宜报告表',
	// 			formType: '25'
	// 		},
	// 		{
	// 			path: 'responsibilityAudit',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/CadreInformationArchives/components/auditRegistrationForm'
	// 			),
	// 			name: '领导干部经济责任审计情况登记表',
	// 			formType: '28'
	// 		},
	// 		{
	// 			path: 'handGifts',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/CadreInformationArchives/components/cashGiftRegistrationForm'
	// 			),
	// 			name: '领导干部上交礼金礼品情况登记表',
	// 			formType: '27'
	// 		},
	// 		{
	// 			path: 'goAbroad',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/CadreInformationArchives/components/filingForm'
	// 			),
	// 			name: '领导干部因公（私）出国（境）、赴台港澳备案表',
	// 			formType: '26'
	// 		},
	// 	]
	// },
	// // 党风廉政建设类
	// {
	// 	path: '/PartyConstruction',
	// 	component: _import('incorrupt/integrityArchives/tableViews/PartyConstruction/index'),
	// 	name: '党风廉政建设类',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "党风廉政建设类"
	// 	},
	// 	children: [{
	// 			path: 'democraticAssociation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/PartyConstruction/components/lifeRegistrationForm'
	// 			),
	// 			name: '领导干部参加民主生活会情况登记表',
	// 			formType: '29'
	// 		},
	// 		{
	// 			path: 'democraticEvaluation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/PartyConstruction/components/evaluatingRegistrationForm'
	// 			),
	// 			name: '领导干部年度党风廉政建设民主测评情况登记表',
	// 			formType: '30'
	// 		},
	// 		{
	// 			path: 'debriefing',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/PartyConstruction/components/reportWorkRegistrationForm'
	// 			),
	// 			name: '领导干部年度述职述廉情况登记表',
	// 			formType: '31'
	// 		}
	// 	]
	// },
	// // 领导干部个人有关事项报告表
	// {
	// 	path: '/RelatedMattersTable',
	// 	component: _import('incorrupt/integrityArchives/tableViews/RelatedMattersTable/index'),
	// 	name: '领导干部个人有关事项报告表',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "领导干部个人有关事项报告表"
	// 	},
	// 	children: [{
	// 			path: 'basicInformation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/basicInformationTable'
	// 			),
	// 			name: '报告人基本情况表',
	// 			formType: '32'
	// 		},
	// 		{
	// 			path: 'estateSituation',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/realEstateSituationTable'
	// 			),
	// 			name: '本人、配偶、共同生活的子女的房产情况',
	// 			formType: '33'
	// 		},
	// 		{
	// 			path: 'financialManagement',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/financeSituationTable'
	// 			),
	// 			name: '本人配偶子女投资式持有股票金融理财等产品',
	// 			formType: '34'
	// 		},
	// 		{
	// 			path: 'certificateAbroad',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/certificatesSituationTable'
	// 			),
	// 			name: '本人持有因私出国（境）证件的情况',
	// 			formType: '35'
	// 		},
	// 		{
	// 			path: 'engageLabor',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/labourServicesIncome'
	// 			),
	// 			name: '本人从事讲学写作咨询审稿书画等劳务所得',
	// 			formType: '36'
	// 		},
	// 		{
	// 			path: 'mySalary',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/wagesable'),
	// 			name: '本人的工资及各类奖金、津贴、补贴等',
	// 			formType: '37'
	// 		},
	// 		{
	// 			path: 'maritalChange',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/marriageChange'),
	// 			name: '本人的婚姻变化情况',
	// 			formType: '38'
	// 		},
	// 		{
	// 			path: 'goAbroad',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/goAbroadSituation'
	// 			),
	// 			name: '本人因私出国（境）的情况',
	// 			formType: '39'
	// 		},
	// 		{
	// 			path: 'otherMatters',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/reportMatter'),
	// 			name: '个人认为需要报告的其他事项',
	// 			formType: '40'
	// 		},
	// 		{
	// 			path: 'investment',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/investmentSituation'
	// 			),
	// 			name: '配偶、子女投资非上市公司、企业的情况',
	// 			formType: '41'
	// 		},
	// 		{
	// 			path: 'lifeRegister',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/registrationSituation'
	// 			),
	// 			name: '配偶、子女注册个体户、个人独资企业的情况',
	// 			formType: '42'
	// 		},
	// 		{
	// 			path: 'criminalResponsibility',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/criminalResponsibility'
	// 			),
	// 			name: '配偶、子女被司法机关追究刑事责任的情况',
	// 			formType: '43'
	// 		},
	// 		{
	// 			path: 'Practice',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/practiceSituation'
	// 			),
	// 			name: '配偶、子女从业情况',
	// 			formType: '44'
	// 		},
	// 		{
	// 			path: 'emigrate',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/emigrateSituation'
	// 			),
	// 			name: '配偶、子女移居国（境）外的情况',
	// 			formType: '45'
	// 		},
	// 		{
	// 			path: 'intermarriage',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/TaiwanIntermarriage'
	// 			),
	// 			name: '子女与港澳以及台湾居民通婚的情况',
	// 			formType: '46'
	// 		},
	// 		{
	// 			path: 'abroadIntermarriage',
	// 			component: _import(
	// 				'incorrupt/integrityArchives/tableViews/RelatedMattersTable/components/foreignIntermarriage'
	// 			),
	// 			name: '子女与外国人、无国籍人通婚的情况',
	// 			formType: '47'
	// 		},
	// 	]
	// },
	// {
	// 	path: '/photograph',
	// 	component: _import('incorrupt/integrityArchives/tableViews/component/photograph'),
	// 	name: '拍照',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "拍照"
	// 	},
	// },
	// {
	// 	path: '/album',
	// 	component: _import('incorrupt/integrityArchives/tableViews/component/album'),
	// 	name: '文件照片',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "文件照片"
	// 	},
	// },
	// { // 廉政系统下沉页面
	// 	path: '/incorruptSys_',
	// 	component: Layout,
	// 	name: '廉政系统 ',
	// 	icon: 'setting',
	// 	hidden: true,
	// 	authority: 'incorruptSys_',
	// 	children: [
	// 		// {
	// 		// 	path: '/newlyHonestReport',
	// 		// 	component: _import('incorrupt/honestReport/addOrEdit'),
	// 		// 	name: '新增举报信息',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "honestReport" // 解决新建页面不显示侧边栏问题
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/editHonestReport',
	// 		// 	component: _import('incorrupt/honestReport/addOrEdit'),
	// 		// 	name: '修改举报信息',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "honestReport"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/honestReportDetail',
	// 		// 	component: _import('incorrupt/honestReport/detail'),
	// 		// 	name: '举报信息详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "honestReport"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/newlyStatement',
	// 		// 	component: _import('incorrupt/statement/addOrEdit'),
	// 		// 	name: '报表新增导入',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "statement"
	// 		// 	}
	// 		// }, 
	// 		// {
	// 		// 	path: '/sortManagement',
	// 		// 	component: _import('incorrupt/education/sortManagement'),
	// 		// 	name: '分类管理',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "education"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/newlyLink',
	// 		// 	component: _import('incorrupt/education/newlyLink'),
	// 		// 	name: '新增超链接',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "education"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/newlyArticle',
	// 		// 	component: _import('incorrupt/education/newlyArticle'),
	// 		// 	name: '新增文章',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "education"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/articleDetail',
	// 		// 	component: _import('incorrupt/education/articleDetail'),
	// 		// 	name: '文章详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "education"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/educationStatistics',
	// 		// 	component: _import('incorrupt/education/educationStatistics'),
	// 		// 	name: '子公司统计',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "education"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/educationUser',
	// 		// 	component: _import('incorrupt/educationUser/index'),
	// 		// 	name: '廉政教育用户端',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "education"
	// 		// 	}
	// 		// },
	// 		// {
	// 		// 	path: 'OAFormSys_',
	// 		// 	component: _import('incorrupt/OAForm/index'),
	// 		// 	name: 'OA廉政表单子系统 ',
	// 		// 	hidden: true,
	// 		// 	authority: 'OAFormSys_',
	// 		// 	children: [{
	// 		// 		path: '/incorrupt/OAForm/routineMatters/index',
	// 		// 		component: _import('incorrupt/OAForm/routineMatters/index'),
	// 		// 		name: '常规监督事项报备表',
	// 		// 		hidden: true,
	// 		// 		meta: {
	// 		// 			parentName: "OAFormSys"
	// 		// 		}
	// 		// 	}]
	// 		// },
	// 		// {
	// 		// 	path: '/routineMatters',
	// 		// 	component: _import('incorrupt/OAForm/routineMatters/index'),
	// 		// 	name: '常规监督事项报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "OAFormSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/OAFormSys/detail',
	// 		// 	component: _import('incorrupt/OAForm/dailyBuild/detail'),
	// 		// 	name: '详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "OAFormSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/weddingsAndFunerals',
	// 		// 	component: _import('incorrupt/OAForm/weddingsAndFunerals/index'),
	// 		// 	name: '婚丧喜庆事宜报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "OAFormSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/dailyBuild',
	// 		// 	component: _import('incorrupt/OAForm/dailyBuild/index'),
	// 		// 	name: '日常落实党风廉政建设工作表单（二级单位）',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "OAFormSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/audit/detail',
	// 		// 	component: _import('incorrupt/audit/detail'),
	// 		// 	name: '廉洁性审核数据',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "AuditSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/audit/result',
	// 		// 	component: _import('incorrupt/audit/result'),
	// 		// 	name: '查看结果',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "AuditSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/examManage/examInfoNewly',
	// 		// 	component: _import('incorrupt/exam/manage/examInfoNewly'),
	// 		// 	name: '新增考试',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "examManage"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/examManage/examInfoDetail',
	// 		// 	component: _import('incorrupt/exam/manage/examInfoDetail'),
	// 		// 	name: '考试详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "examManage"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/examManage/subjectinfo',
	// 		// 	component: _import('incorrupt/exam/manage/subjectinfo'),
	// 		// 	name: '考题库',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "examManage"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/examManage/exam',
	// 		// 	component: _import('incorrupt/exam/onlineExam/exam'),
	// 		// 	name: '在线考试 ',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "examManage"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/examManage/myErrors',
	// 		// 	component: _import('incorrupt/exam/myErrors/index'),
	// 		// 	name: '我的错题',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "examManage"
	// 		// 	}
	// 		// },
	// 		// {
	// 		// 	path: '/configureShape',
	// 		// 	component: _import('incorrupt/integrityArchives/components/configure_shape'),
	// 		// 	name: '四种形态管理配置',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// },
	// 		// {
	// 		// 	path: '/ArchivesIndex',
	// 		// 	component: _import('archives/index'),
	// 		// 	// name: '廉政档案首页',
	// 		// 	redirect: '/ArchivesIndex/situation',
	// 		// 	hidden: true,
	// 		// 	authority: 'ArchivesIndex',
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	},
	// 		// 	children: [{
	// 		// 			path: 'archivesManage',
	// 		// 			component: _import('incorrupt/integrityArchives/components/archivesManage'),
	// 		// 			name: '档案管理',
	// 		// 			meta: {
	// 		// 				parentName: "integrityArchives"
	// 		// 			},
	// 		// 		},
	// 		// 		{
	// 		// 			path: 'situation',
	// 		// 			component: _import('incorrupt/integrityArchives/components/situation'),
	// 		// 			name: '整体情况',
	// 		// 			meta: {
	// 		// 				parentName: "integrityArchives"
	// 		// 			},
	// 		// 		},
	// 		// 		{
	// 		// 			path: 'shapeMager',
	// 		// 			component: _import('incorrupt/integrityArchives/components/shapeMager'),
	// 		// 			name: '四种形态管理',
	// 		// 			meta: {
	// 		// 				parentName: "integrityArchives"
	// 		// 			},
	// 		// 		},
	// 		// 		{
	// 		// 			path: 'statistical',
	// 		// 			component: _import('incorrupt/integrityArchives/components/statistical'),
	// 		// 			name: '统计分析',
	// 		// 			meta: {
	// 		// 				parentName: "integrityArchives"
	// 		// 			},
	// 		// 		}
	// 		// 	]
	// 		// }, {
	// 		// 	path: '/topLeaders/taskList',
	// 		// 	component: _import('incorrupt/topLeaders/taskList/index'),
	// 		// 	name: '任务清单',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/taskList/add',
	// 		// 	component: _import('incorrupt/topLeaders/taskList/edit'),
	// 		// 	name: '添加任务清单',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/taskList/update',
	// 		// 	component: _import('incorrupt/topLeaders/taskList/edit'),
	// 		// 	name: '修改任务清单',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/taskList/detail',
	// 		// 	component: _import('incorrupt/topLeaders/taskList/detail'),
	// 		// 	name: '任务清单详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/daily',
	// 		// 	component: _import('incorrupt/topLeaders/common/index'),
	// 		// 	name: '日常监督报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/common/dailyWritten',
	// 		// 	component: _import('incorrupt/topLeaders/common/written'),
	// 		// 	name: '填写批示',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/common/dailyWrittenDetail',
	// 		// 	component: _import('incorrupt/topLeaders/common/written'),
	// 		// 	name: '日常监督报备表详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/common/dailyInspectionDetail',
	// 		// 	component: _import('incorrupt/topLeaders/common/inspectionResult'),
	// 		// 	name: '日常监督报备表详情 ',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/common/dailyInspectionResult',
	// 		// 	component: _import('incorrupt/topLeaders/common/inspectionResult'),
	// 		// 	name: '填写监督检查情况',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/special',
	// 		// 	component: _import('incorrupt/topLeaders/common/index'),
	// 		// 	name: '专项监督检查事项',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/common/specialWrittenDetail',
	// 		// 	component: _import('incorrupt/topLeaders/common/written'),
	// 		// 	name: '专项监督检查事项详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/common/specialInspectionDetail',
	// 		// 	component: _import('incorrupt/topLeaders/common/inspectionResult'),
	// 		// 	name: '专项监督检查事项详情 ',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/personnel',
	// 		// 	component: _import('incorrupt/topLeaders/common/personnel'),
	// 		// 	name: '经手事项',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/department',
	// 		// 	component: _import('incorrupt/topLeaders/common/department'),
	// 		// 	name: '二级单位详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/archives',
	// 		// 	component: _import('incorrupt/topLeaders/common/archives'),
	// 		// 	name: '档案信息',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersManageSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/report/daily',
	// 		// 	component: _import('incorrupt/topLeaders/report/common'),
	// 		// 	name: '日常监督报备表 ',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersReportSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/report/special',
	// 		// 	component: _import('incorrupt/topLeaders/report/common'),
	// 		// 	name: '专项被监督情况',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersReportSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/report/add',
	// 		// 	component: _import('incorrupt/topLeaders/report/handle'),
	// 		// 	name: '添加报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersReportSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/report/update',
	// 		// 	component: _import('incorrupt/topLeaders/report/handle'),
	// 		// 	name: '修改报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersReportSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/topLeaders/report/change',
	// 		// 	component: _import('incorrupt/topLeaders/report/handle'),
	// 		// 	name: '负责人变更',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "TopLeadersReportSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/equative/logSheet',
	// 		// 	component: _import('incorrupt/leadingGroup/equative/logSheet/index'),
	// 		// 	name: '重要会议报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "equativeLeadingGroupSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/equative/logSheet/add',
	// 		// 	component: _import('incorrupt/leadingGroup/equative/logSheet/edit'),
	// 		// 	name: '添加重要会议报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "equativeLeadingGroupSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/equative/logSheet/update',
	// 		// 	component: _import('incorrupt/leadingGroup/equative/logSheet/edit'),
	// 		// 	name: '修改重要会议报备表',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "equativeLeadingGroupSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/equative/logSheet/detail',
	// 		// 	component: _import('incorrupt/leadingGroup/equative/logSheet/detail'),
	// 		// 	name: '重要会议报备表详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "equativeLeadingGroupSys"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/equative/importantMatter',
	// 		// 	component: _import('incorrupt/leadingGroup/equative/importantMatter/index'),
	// 		// 	name: '三重一大监督情况',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "equativeLeadingGroupSys"
	// 		// 	}
	// 		// },
	// 		// {
	// 		// 	path: '/equative',
	// 		// 	component: _import('incorrupt/leadingGroup/equative/index'),
	// 		// 	name: '同级领导班子监督管理系统 ',
	// 		// 	redirect: '/equative/index',
	// 		// 	hidden: true,
	// 		// 	authority: 'equative',
	// 		// 	meta: {
	// 		// 		parentName: "equativeLeadingGroupSys"
	// 		// 	},
	// 		// 	children: [{
	// 		// 		path: '/equative/logSheet',
	// 		// 		component: _import('incorrupt/leadingGroup/equative/pages/logSheet'),
	// 		// 		name: '重要会议报备表',
	// 		// 		redirect: '/equative/logSheet',
	// 		// 		hidden: true,
	// 		// 		meta: {
	// 		// 			parentName: "equativeLeadingGroupSys"
	// 		// 		},
	// 		// 	}]
	// 		// }
	// 		// {
	// 		// 	path: '/newlyPatrolInternal',
	// 		// 	component: _import('patrol/patrolInternal/patrolInternalNewly'),
	// 		// 	name: '内部巡查',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "patrolInternal" // 解决新建页面不显示侧边栏问题
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/personnelPatrolPatrolInternal',
	// 		// 	component: _import('patrol/patrolInternal/personnelPatrol'),
	// 		// 	name: '巡查人员库',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "patrolInternal"
	// 		// 	}
	// 		// }, 
	// 		// {
	// 		// 	path: '/accountTalkInc',
	// 		// 	component: _import('talkIncorruption/talkInc/account'),
	// 		// 	name: '子公司台账',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "talkInc"
	// 		// 	}
	// 		// }, 
	// 		// {
	// 		// 	path: '/situationTemploy',
	// 		// 	component: _import('employment/employ/situation'),
	// 		// 	name: '选人用人情况',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "employ"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/screeningComCom',
	// 		// 	component: _import('archives/screeningCom'),
	// 		// 	name: '单位风险点排查',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/informationCom',
	// 		// 	component: _import('archives/informationCom'),
	// 		// 	name: '单位信息档案',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/filesPer',
	// 		// 	component: _import('archives/filesPer'),
	// 		// 	name: '个人档案',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/temporaryPut',
	// 		// 	component: _import('archives/temporaryPut'),
	// 		// 	name: '临时任务提报',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/solidificationPut/add',
	// 		// 	component: _import('archives/edit'),
	// 		// 	name: '固化任务提报 / 新增',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/subsidiary',
	// 		// 	component: _import('archives/subsidiary'),
	// 		// 	name: '子公司信息',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/personnelAll',
	// 		// 	component: _import('archives/personnelAll'),
	// 		// 	name: '单位内所有人员数据',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "integrityArchives"
	// 		// 	}
	// 		// }, 
	// 		// {
	// 		// 	path: '/meetingDetail',
	// 		// 	component: _import('meetingJoint/meeting/detail'),
	// 		// 	name: '联席会会议详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "meeting"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/meetingPersonnel',
	// 		// 	component: _import('meetingJoint/meeting/personnel'),
	// 		// 	name: '联席会成员',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "meeting"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/accountLarge',
	// 		// 	component: _import('largeTriple/large/account'),
	// 		// 	name: '台账',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "large"
	// 		// 	}
	// 		// }, {
	// 		// 	path: '/ruleLarge',
	// 		// 	component: _import('largeTriple/large/rule'),
	// 		// 	name: '规则设置',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "large"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/typeLarge',
	// 		// 	component: _import('largeTriple/large/type'),
	// 		// 	name: '会议类型管理',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "large"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/situationLarge',
	// 		// 	component: _import('largeTriple/large/situation'),
	// 		// 	name: '”三重一大“情况',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "large"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/clueAdd',
	// 		// 	component: _import('casesClues/clue/add'),
	// 		// 	name: '新增线索情况',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "clue"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/clueEvent',
	// 		// 	component: _import('casesClues/clue/event'),
	// 		// 	name: '事项信息管理',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "clue"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/newlySpecial',
	// 		// 	component: _import('specialSup/special/patrolInternalNewly'),
	// 		// 	name: '下发专项监督事项',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "special" // 解决新建页面不显示侧边栏问题
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/putRes',
	// 		// 	component: _import('responsibilityImp/responsibility/temporaryPut'),
	// 		// 	name: '两个责任类别提报',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "responsibility"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/categoryRes',
	// 		// 	component: _import('responsibilityImp/responsibility/category'),
	// 		// 	name: '两个责任类别管理',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "responsibility"
	// 		// 	}
	// 		// }
	// 		// , {
	// 		// 	path: '/profile',
	// 		// 	component: _import('disciplinaryData/disciplinary/profile'),
	// 		// 	name: '个人档案',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "disciplinary"
	// 		// 	}
	// 		// }
	// 		, {
	// 			path: '/examination',
	// 			component: _import('disciplinaryData/disciplinary/examination'),
	// 			name: '执纪审查档案',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "disciplinary"
	// 			}
	// 		}, {
	// 			path: '/subsidiaryDis',
	// 			component: _import('disciplinaryData/disciplinary/subsidiary'),
	// 			name: '子公司信息',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "disciplinary"
	// 			}
	// 		}
	// 	]
	// 	// , {
	// 	// 	path: '/examSys_',
	// 	// 	component: Layout,
	// 	// 	name: '考试系统 ',
	// 	// 	icon: 'setting',
	// 	// 	authority: 'examSys_',
	// 	// 	children: [{
	// 	// 		path: '/newlyHonestReport',
	// 	// 		component: _import('incorrupt/honestReport/addOrEdit'),
	// 	// 		name: '新增举报信息',
	// 	// 		hidden: true,
	// 	// 		meta: {
	// 	// 			parentName: "honestReport" // 解决新建页面不显示侧边栏问题
	// 	// 		}
	// 	// 	}]
	// 	// }]
	// },

	{ // 监督准备档案下沉页面
		path: '/filesPrepare_',
		component: Layout,
		name: '监督准备档案 ',
		hidden: true,
		icon: 'sy_folderOpen',
		authority: 'filesPrepare_',
		children: [
			// {
			// 	path: '/screeningComCom',
			// 	component: _import('archives/screeningCom'),
			// 	name: '单位风险点排查',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, {
			// 	path: '/informationCom',
			// 	component: _import('archives/informationCom'),
			// 	name: '单位信息档案',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, {
			// 	path: '/filesPer',
			// 	component: _import('archives/filesPer'),
			// 	name: '个人档案',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, {
			// 	path: '/temporaryPut',
			// 	component: _import('archives/temporaryPut'),
			// 	name: '临时任务提报',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, {
			// 	path: '/solidificationPut/add',
			// 	component: _import('archives/edit'),
			// 	name: '固化任务提报 / 新增',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, {
			// 	path: '/subsidiary',
			// 	component: _import('archives/subsidiary'),
			// 	name: '子公司信息',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, {
			// 	path: '/personnelAll',
			// 	component: _import('archives/personnelAll'),
			// 	name: '单位内所有人员数据',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "integrityArchives"
			// 	}
			// }, 
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
		// 	{
		// 	path: '/meetingDetail',
		// 	component: _import('meetingJoint/meeting/detail'),
		// 	name: '联席会会议详情',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "meeting"
		// 	}
		// }, {
		// 	path: '/meetingPersonnel',
		// 	component: _import('meetingJoint/meeting/personnel'),
		// 	name: '联席会成员',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "meeting"
		// 	}
		// },
		// {
		// 	path: '/accountLarge',
		// 	component: _import('largeTriple/large/account'),
		// 	name: '台账',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "large"
		// 	}
		// }, {
		// 	path: '/ruleLarge',
		// 	component: _import('largeTriple/large/rule'),
		// 	name: '规则设置',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "large"
		// 	}
		// }, {
		// 	path: '/situationLarge',
		// 	component: _import('largeTriple/large/situation'),
		// 	name: '”三重一大“情况',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "large"
		// 	}
		// }, 
		// {
		// 	path: '/newlySpecial',
		// 	component: _import('specialSup/special/patrolInternalNewly'),
		// 	name: '下发专项监督事项',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "special" // 解决新建页面不显示侧边栏问题
		// 	}
		// },
		// {
		// 	path: '/situationTemploy',
		// 	component: _import('employment/employ/situation'),
		// 	name: '选人用人情况',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "employ"
		// 	}
		// }, 
		// {
		// 	path: '/accountTalkInc',
		// 	component: _import('talkIncorruption/talkInc/account'),
		// 	name: '子公司台账',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "talkInc"
		// 	}
		// }, 
		// {
		// 	path: '/putRes',
		// 	component: _import('responsibilityImp/responsibility/temporaryPut'),
		// 	name: '两个责任落实',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "responsibility"
		// 	}
		// }, {
		// 	path: '/responsibilityDel',
		// 	component: _import('responsibilityImp/responsibility/responsibilityDel'),
		// 	name: '两个责任落实查看',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "responsibility"
		// 	}
		// }, 
		// {
		// 	path: '/newlyPatrolInternal',
		// 	component: _import('patrol/patrolInternal/patrolInternalNewly'),
		// 	name: '内部巡查',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "patrolInternal" // 解决新建页面不显示侧边栏问题
		// 	}
		// }, {
		// 	path: '/personnelPatrolPatrolInternal',
		// 	component: _import('patrol/patrolInternal/personnelPatrol'),
		// 	name: '巡查人员库',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "patrolInternal"
		// 	}
		// }, 
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
			// {
			// 	path: '/clueEvent',
			// 	component: _import('casesClues/clue/event'),
			// 	name: '事项信息管理',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "clue"
			// 	}
			// }
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
			// {
			// 	path: '/sortManagement',
			// 	component: _import('incorrupt/education/sortManagement'),
			// 	name: '分类管理',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "education"
			// 	}
			// }, {
			// 	path: '/newlyLink',
			// 	component: _import('incorrupt/education/newlyLink'),
			// 	name: '新增超链接',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "education"
			// 	}
			// }, {
			// 	path: '/newlyArticle',
			// 	component: _import('incorrupt/education/newlyArticle'),
			// 	name: '新增文章',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "education"
			// 	}
			// }, {
			// 	path: '/articleDetail',
			// 	component: _import('incorrupt/education/articleDetail'),
			// 	name: '文章详情',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "education"
			// 	}
			// }, {
			// 	path: '/educationStatistics',
			// 	component: _import('incorrupt/education/educationStatistics'),
			// 	name: '子公司统计',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "education"
			// 	}
			// }, 
			// {
			// 	path: '/educationUser',
			// 	component: _import('incorrupt/educationUser/index'),
			// 	name: '廉政宣教中心',
			// 	hidden: true,
			// 	meta: {
			// 		parentName: "education"
			// 	}
			// },
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
		// 	{
		// 	path: '/form/formAdd',
		// 	// component: _import('bpm/form/formEditor'),
		// 	component: _import('bpm/design/index'),
		// 	name: '设计表单-新增',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "modelManager" // 解决新建页面不显示侧边栏问题
		// 	}
		// },{
		// 	path: '/form/formEdit',
		// 	// component: _import('bpm/form/formEditor'),
		// 	component: _import('bpm/design/index'),
		// 	name: '设计表单-修改',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "modelManager" // 解决新建页面不显示侧边栏问题
		// 	}
		// },
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
		// {
		// 	path: '/processInstance/create',
		// 	component: _import('bpm/processInstance/create'),
		// 	name: '发起流程',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
		// 	}
		// },{
		// 	path: '/processInstance/detail',
		// 	component: _import('bpm/processInstance/detail'),
		// 	name: '流程详情',
		// 	hidden: true,
		// 	meta: {
		// 		parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
		// 	}
		// }
	],
	},

	// { // 内部巡查整改下沉页面
	// 	path: '/patrol_',
	// 	component: Layout,
	// 	name: '内部巡查整改 ',
	// 	icon: 'setting',
	// 	authority: 'patrol_',
	// 	children: [{
	// 			path: '/newlyPatrolInternal',
	// 			component: _import('patrol/patrolInternal/patrolInternalNewly'),
	// 			name: '新增巡查计划',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "patrolInternal" // 解决新建页面不显示侧边栏问题
	// 			}
	// 		}, {
	// 			path: '/personnelPatrolPatrolInternal',
	// 			component: _import('patrol/patrolInternal/personnelPatrol'),
	// 			name: '巡查人员库',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "patrolInternal"
	// 			}
	// 		}
	// 		// , {
	// 		// 	path: '/planPatrolDetailPatrolInternal',
	// 		// 	component: _import('patrol/patrolInternal/components/planPatrolDetail'),
	// 		// 	name: '巡查计划详情',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "patrolInternal"
	// 		// 	}
	// 		// }
	// 	]
	// },

	// { // 廉政谈话下沉页面
	// 	path: '/talkInc_',
	// 	component: Layout,
	// 	name: '廉政谈话 ',
	// 	icon: 'setting',
	// 	authority: 'talkInc_',
	// 	children: [{
	// 			path: '/newlytalkInc',
	// 			component: _import('talkIncorruption/talkInc/addOrEdit'),
	// 			name: '新增谈话记录',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "talkInc" // 解决新建页面不显示侧边栏问题
	// 			}
	// 		}, {
	// 			path: '/accountTalkInc',
	// 			component: _import('talkIncorruption/talkInc/account'),
	// 			name: '子公司台账',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "talkInc"
	// 			}
	// 		}
	// 	]
	// },

	// { // 选人用人监督下沉页面
	// 	path: '/employ_',
	// 	component: Layout,
	// 	name: '选人用人监督 ',
	// 	icon: 'setting',
	// 	authority: 'employ_',
	// 	children: [{
	// 			path: '/newlyemploy',
	// 			component: _import('employment/employ/addOrEdit'),
	// 			name: '新增选人用人情况',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "employ" // 解决新建页面不显示侧边栏问题
	// 			}
	// 		}, {
	// 			path: '/situationTemploy',
	// 			component: _import('employment/employ/situation'),
	// 			name: '选人用人情况',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "employ"
	// 			}
	// 		}
	// 	]
	// },
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
		children: [{
				path: 'screeningComCom/index',
				// component: _import('archives/index'),
				component: LayoutBlank,
				noDropdown: true,
				props: true,
				name: '单位风险点排查',
				children: [
					{
						path: '',
						component: _import('archives/screeningCom'),
						hidden: true,
						noDropdown: true,
					},
				]
			}, {
				path: 'informationCom/index',
				// component: _import('archives/index'),
				component: LayoutBlank,
				noDropdown: true,
				props: true,
				name: '单位信息档案',
				children: [
					{
						path: '',
						component: _import('archives/informationCom'),
						hidden: true,
						noDropdown: true,
					},
				]
			}, {
				path: 'filesPer/index',
				component: _import('archives/filesPer'),
				noDropdown: true,
				props: true,
				name: '个人档案',
        children: [
          {
            path: 'history',
            component: _import('archives/history'),
            name: '历史任务',
            hidden: true,
            meta: {
              parentName: "/filesPer/index"
            }
          }
        ]
			}
		]
	},{
		path: '/filesImplementation',
		component: Layout,
		name: '监督实施档案',
		icon: 'service',
		authority: 'filesImplementation',
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
				path: '/meetingDetail',
				component: _import('meetingJoint/meeting/detail'),
				name: '联席会会议详情',
				hidden: true,
				noDropdown: true,
				meta: {
					parentName: "meeting",
					activeMenu: '/filesImplementation/meeting'
				}
			}, {
				path: '/meetingPersonnel',
				component: _import('meetingJoint/meeting/personnel'),
				name: '联席会成员',
				hidden: true,
				noDropdown: true,
				meta: {
					parentName: "meeting",
					activeMenu: '/filesImplementation/meeting'
				}
			}, 
	// 		{
    //     path: 'reportTopic',
	// 			component: _import('meetingJoint/meeting/unit/ReportTopic'),
	// 			name: '上报议题',
	// 			hidden: true,
	// 			noDropdown: true,
	// 			meta: {
	// 				parentName: "meeting",
	// 				activeMenu: '/filesImplementation/meeting'
	// 			}
    //   }, {
    //     path: 'requestMeeting',
	// 			component: _import('meetingJoint/meeting/unit/RequestMeeting'),
	// 			name: '申请会议',
	// 			hidden: true,
	// 			noDropdown: true,
	// 			meta: {
	// 				parentName: "meeting",
	// 				activeMenu: '/filesImplementation/meeting'
	// 			}
    //   }
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
					component: _import('largeTriple/large/situation'),
					name: '”三重一大“情况',
					hidden: true,
					meta: {
						parentName: "large",
						activeMenu: '/filesImplementation/large'
					}
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
					path: '/newlySpecial',
					component: _import('specialSup/special/patrolInternalNewly'),
					name: '下发专项监督事项',
					hidden: true,
					meta: {
						parentName: "special", // 解决新建页面不显示侧边栏问题
						activeMenu: '/filesImplementation/special'
					}
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
					path: '/situationTemploy',
					component: _import('employment/employ/situation'),
					name: '选人用人情况',
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
					path: '/putRes',
					component: _import('responsibilityImp/responsibility/temporaryPut'),
					name: '两个责任落实',
					hidden: true,
					meta: {
						parentName: "responsibility",
						activeMenu: '/filesImplementation/responsibility'
					}
				}, {
					path: '/responsibilityDel',
					component: _import('responsibilityImp/responsibility/responsibilityDel'),
					name: '两个责任落实查看',
					hidden: true,
					meta: {
						parentName: "responsibility",
						activeMenu: '/filesImplementation/responsibility'
					}
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
					path: '/clueEvent',
					component: _import('casesClues/clue/event'),
					name: '事项信息管理',
					hidden: true,
					meta: {
						parentName: "clue"
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
		children: [{
			path: 'educationUser',
			// component: _import('incorrupt/educationUser/index'),
			component: LayoutBlank,
			noDropdown: true,
			props: true,
			name: '廉政宣教中心',
			authority: 'educationUser',
			children: [
				{
					path: '',
					component: _import('incorrupt/educationUser/index'),
					hidden: true,
					noDropdown: true,
				},
				{
					path: '/educationUser',
					component: _import('incorrupt/educationUser/index'),
					name: '廉政宣教中心',
					hidden: true,
					meta: {
						parentName: "educationUser"
					}
				},
			]
		}]
	},{
		path: '/dataDisciplinary',
		component: Layout,
		name: '监督执纪数据中心',
		icon: 'client',
		authority: 'dataDisciplinary',
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
		children: [
			{
				path: '/informationCon',
				component: Layout,
				name: '配置信息管理',
				icon: 'setting',
				authority: 'informationCon',
				children: [{
					path: 'groupResidency',
					component: _import('archives/groupResidency/index'),
					name: '派驻组人员管理',
					// authority: 'large'
				},{
					path: 'typeLarge',
					component: _import('largeTriple/large/type'),
					name: '三重一大信息管理',
					authority: 'large'
				}, {
					path: 'categoryRes',
					component: _import('responsibilityImp/responsibility/category'),
					name: '两个责任类别管理',
					meta: {
						parentName: "responsibility"
					}
				},{
					path: 'clueEvent',
					component: _import('casesClues/clue/event'),
					name: '线索及案件信息管理',
					meta: {
						parentName: "clue"
					}
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
								parentName: "education"
							}
						}, {
							path: '/newlyLink',
							component: _import('incorrupt/education/newlyLink'),
							name: '新增超链接',
							hidden: true,
							meta: {
								parentName: "education"
							}
						}, {
							path: '/newlyArticle',
							component: _import('incorrupt/education/newlyArticle'),
							name: '新增文章',
							hidden: true,
							meta: {
								parentName: "education"
							}
						}, {
							path: '/articleDetail',
							component: _import('incorrupt/education/articleDetail'),
							name: '文章详情',
							hidden: true,
							meta: {
								parentName: "education"
							}
						}, {
							path: '/educationStatistics',
							component: _import('incorrupt/education/educationStatistics'),
							name: '子公司统计',
							hidden: true,
							meta: {
								parentName: "education"
							}
						}, 
					]
				}]
			},
			{
				path: '/bpmSys',
				component: Layout,
				name: '工作流程管理',
				icon: 'setting',
				authority: 'bpmSys',
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
						{
							path: '/modelDesign',
							component: _import('bpm/model/modelEditor'),
							name: '设计流程',
							hidden: true,
							meta: {
								parentName: "formManager" // 解决新建页面不显示侧边栏问题
							}
						},{
							path: '/manager/definition',
							component: _import('bpm/definition/index'),
							name: '流程定义',
							hidden: true,
							meta: {
								parentName: "formManager" // 解决新建页面不显示侧边栏问题
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
							path: '/form/formAdd',
							// component: _import('bpm/form/formEditor'),
							component: _import('bpm/design/index'),
							name: '设计表单-新增',
							hidden: true,
							meta: {
								parentName: "modelManager" // 解决新建页面不显示侧边栏问题
							}
						},{
							path: '/form/formEdit',
							// component: _import('bpm/form/formEditor'),
							component: _import('bpm/design/index'),
							name: '设计表单-修改',
							hidden: true,
							meta: {
								parentName: "modelManager" // 解决新建页面不显示侧边栏问题
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
								parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
							}
						},{
							path: '/processInstance/detail',
							component: _import('bpm/processInstance/detail'),
							name: '流程详情',
							hidden: true,
							meta: {
								parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
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
				component: Layout,
				name: '基础配置管理',
				icon: 'setting',
				authority: 'baseManager',
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
        component: _import('archives/filesPer'),
        name: '个人档案',
        hidden: true,
        meta: {
          parentName: "/filesPerOverview"
        },
        children: [
          {
            path: 'history',
            component: _import('archives/history'),
            name: '历史任务',
            hidden: true,
            meta: {
              parentName: "/filesPer"
            }
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
        name: '固化任务提报 / 新增',
        hidden: true,
        meta: {
          parentName: "/filesPerOverview"
        }
      }, {
        path: '/subsidiary',
        component: _import('archives/subsidiary'),
        name: '子公司信息',
        hidden: true,
        meta: {
          parentName: "/filesPerOverview"
        }
      }, {
        path: '/personnelAll',
        component: _import('archives/personnelAll'),
        name: '单位内所有人员数据',
        hidden: true,
        meta: {
          parentName: "/filesPerOverview"
        }
      }
    ]
  }

	// { // 工作流程管理下沉页面
	// path: '/bpmSys_',
	// component: Layout,
	// name: '工作流程管理 ',
	// icon: 'setting',
	// authority: 'bpmSys_',
	// children: [{
	// 	path: '/form/formAdd',
	// 	// component: _import('bpm/form/formEditor'),
	// 	component: _import('bpm/design/index'),
	// 	name: '设计表单-新增',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "modelManager" // 解决新建页面不显示侧边栏问题
	// 	}
	// },{
	// 	path: '/form/formEdit',
	// 	// component: _import('bpm/form/formEditor'),
	// 	component: _import('bpm/design/index'),
	// 	name: '设计表单-修改',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "modelManager" // 解决新建页面不显示侧边栏问题
	// 	}
	// },{
	// 	path: '/modelDesign',
	// 	component: _import('bpm/model/modelEditor'),
	// 	name: '设计流程',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "formManager" // 解决新建页面不显示侧边栏问题
	// 	}
	// },{
	// 	path: '/processInstance/create',
	// 	component: _import('bpm/processInstance/create'),
	// 	name: '发起流程',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
	// 	}
	// },{
	// 	path: '/processInstance/detail',
	// 	component: _import('bpm/processInstance/detail'),
	// 	name: '流程详情',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
	// 	}
	// },{
	// 	path: '/manager/definition',
	// 	component: _import('bpm/definition/index'),
	// 	name: '流程定义',
	// 	hidden: true,
	// 	meta: {
	// 		parentName: "formManager" // 解决新建页面不显示侧边栏问题
	// 	}
	// }
	// 	]
	// },
	// {
	// 	path: '/baseManager',
	// 	component: Layout,
	// 	name: '基础配置管理',
	// 	icon: 'setting',
	// 	authority: 'baseManager',
	// 	children: [{
	// 		path: 'userManager',
	// 		// icon: 'fa-user',
	// 		component: _import('admin/user/index'),
	// 		name: '用户管理',
	// 		authority: 'userManager'
	// 	}, {
	// 		path: 'menuManager',
	// 		// icon: 'category',
	// 		component: _import('admin/menu/index'),
	// 		name: '菜单管理',
	// 		authority: 'menuManager'
	// 	}, {
	// 		path: 'groupManager',
	// 		// icon: 'group_fill',
	// 		component: _import('admin/group/index'),
	// 		name: '角色权限管理',
	// 		authority: 'groupManager'
	// 	}, {
	// 		path: 'groupTypeManager',
	// 		// icon: 'fa-users',
	// 		component: _import('admin/groupType/index'),
	// 		name: '角色类型管理',
	// 		authority: 'groupTypeManager'
	// 	}, {
	// 		path: 'gateLogManager',
	// 		// icon: 'viewlist',
	// 		component: _import('admin/gateLog/index'),
	// 		name: '操作日志管理',
	// 		authority: 'gateLogManager'
	// 	}, {
	// 		path: 'baseDict',
	// 		component: _import('admin/dict/index'),
	// 		name: '数据字典',
	// 		authority: 'baseDict'
	// 	}, {
	// 		path: 'baseDepartment',
	// 		component: _import('admin/department/index'),
	// 		name: '部门管理',
	// 		authority: 'baseDepartment'
	// 	}]
	// },
	// {
	// 	path: '/patrol',
	// 	component: Layout,
	// 	name: '内部巡查整改',
	// 	icon: 'setting',
	// 	authority: 'patrol',
	// 	children: [{
	// 		path: 'patrolInternal',
	// 		component: _import('patrol/patrolInternal/index'),
	// 		name: '内部巡查整改',
	// 		authority: 'patrolInternal'
	// 	}]
	// },
	// {
	// 	path: '/talkIncorruption',
	// 	component: Layout,
	// 	name: '廉政谈话',
	// 	icon: 'setting',
	// 	authority: 'talkIncorruption',
	// 	children: [{
	// 		path: 'talkInc',
	// 		component: _import('talkIncorruption/talkInc/index'),
	// 		name: '廉政谈话',
	// 		authority: 'talkInc'
	// 	}]
	// },
	// {
	// 	path: '/employment',
	// 	component: Layout,
	// 	name: '选人用人监督',
	// 	icon: 'setting',
	// 	authority: 'employment',
	// 	children: [{
	// 		path: 'employ',
	// 		component: _import('employment/employ/index'),
	// 		name: '选人用人监督',
	// 		authority: 'employ'
	// 	}]
	// },
	// {
	// 	path: '/authManager',
	// 	component: Layout,
	// 	name: '服务权限管理',
	// 	icon: 'setting',
	// 	authority: 'authManager',
	// 	children: [{
	// 		path: 'serviceManager',
	// 		component: _import('auth/service/index'),
	// 		name: '服务管理',
	// 		authority: 'serviceManager'
	// 	}]
	// },
	
	// {
	// 	path: '/incorruptSys',
	// 	component: Layout,
	// 	name: '廉政系统',
	// 	icon: 'setting',
	// 	hidden: true,
	// 	authority: 'incorruptSys',
	// 	children: [{
	// 			path: 'honestReport',
	// 			component: _import('incorrupt/honestReport/index'),
	// 			name: '举报信息',
	// 			hidden: true,
	// 			authority: 'honestReport'
	// 		}, {
	// 			path: 'statement',
	// 			component: _import('incorrupt/statement/index'),
	// 			name: '统计报表',
	// 			hidden: true,
	// 			authority: 'statement'
	// 		}, {
	// 			path: 'education',
	// 			component: _import('incorrupt/education/index'),
	// 			name: '廉政宣教管理',
	// 			hidden: true,
	// 			authority: 'education'
	// 		}, {
	// 			path: 'educationUser',
	// 			component: _import('incorrupt/educationUser/index'),
	// 			name: '廉政宣教中心',
	// 			hidden: true,
	// 			authority: 'educationUser'
	// 		}, {
	// 			path: 'patrolInternal',
	// 			component: _import('patrol/patrolInternal/index'),
	// 			name: '内部巡查',
	// 			hidden: true,
	// 			authority: 'patrolInternal'
	// 		}, {
	// 			path: 'talkInc',
	// 			component: _import('talkIncorruption/talkInc/index'),
	// 			name: '廉政谈话',
	// 			hidden: true,
	// 			authority: 'talkInc'
	// 		}, {
	// 			path: 'employ',
	// 			component: _import('employment/employ/index'),
	// 			name: '选人用人监督',
	// 			hidden: true,
	// 			authority: 'employ'
	// 		}, {
	// 			path: 'screeningComCom/index',
	// 			component: _import('archives/index'),
	// 			name: '单位风险点排查',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "screeningComCom"
	// 			}
	// 		}, {
	// 			path: 'informationCom/index',
	// 			component: _import('archives/index'),
	// 			name: '单位信息档案',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "informationCom"
	// 			}
	// 		}, {
	// 			path: 'filesPer/index',
	// 			component: _import('archives/index'),
	// 			name: '个人档案',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "filesPer"
	// 			}
	// 		}, {
	// 			path: 'meeting',
	// 			component: _import('meetingJoint/meeting/index'),
	// 			name: '监督联席会',
	// 			hidden: true,
	// 			authority: 'meeting'
	// 		}, {
	// 			path: 'large',
	// 			component: _import('largeTriple/large/index'),
	// 			name: '三重一大',
	// 			hidden: true,
	// 			authority: 'large'
	// 		}, {
	// 			path: 'typeLarge',
	// 			component: _import('largeTriple/large/type'),
	// 			name: '三重一大信息管理',
	// 			hidden: true,
	// 			authority: 'large'
	// 		}, {
	// 			path: 'clue',
	// 			component: _import('casesClues/clue/index'),
	// 			name: '线索及案件管理',
	// 			hidden: true,
	// 			authority: 'clue'
	// 		}, {
	// 			path: 'clueEvent',
	// 			component: _import('casesClues/clue/event'),
	// 			name: '线索及案件事项信息管理',
	// 			hidden: true,
	// 			meta: {
	// 				parentName: "clue"
	// 			}
	// 		}, 
	// 		// {
	// 		// 	path: 'categoryRes',
	// 		// 	component: _import('responsibilityImp/responsibility/category'),
	// 		// 	name: '两个责任类别管理',
	// 		// 	hidden: true,
	// 		// 	meta: {
	// 		// 		parentName: "responsibility"
	// 		// 	}
	// 		// }
	// 		, {
	// 			path: 'special',
	// 			component: _import('specialSup/special/index'),
	// 			name: '专项监督',
	// 			hidden: true,
	// 			authority: 'special'
	// 		}, {
	// 			path: 'responsibility',
	// 			component: _import('responsibilityImp/responsibility/index'),
	// 			name: '两个责任落实',
	// 			hidden: true,
	// 			authority: 'responsibility'
	// 		}, {
	// 			path: 'disciplinary',
	// 			component: _import('disciplinaryData/disciplinary/index'),
	// 			// component: () => import(`@/views/SubView`),
	// 			name: '监督执纪数据中心',
	// 			hidden: true,
	// 			authority: 'disciplinary',
	// 			// redirect:'disciplinary/profile',
	// 			meta: {
	// 				parentName: "integrityArchives"
	// 			},
	// 			// children: [{
	// 			// 	path: 'profile',
	// 			// 	component: _import('disciplinaryData/disciplinary/profile'),
	// 			// 	name: '个人档案',
	// 			// 	meta: {
	// 			// 		parentName: "integrityArchives"
	// 			// 	},
	// 			// 	// authority: 'profile'
	// 			// }]
	// 		}, {
	// 			path: 'prepareFiles',
	// 			component: _import('disciplinaryData/disciplinary/index'),
	// 			name: '监督准备档案',
	// 			hidden: true,
	// 			authority: 'prepareFiles'
	// 		}, {
	// 			path: 'implementationFiles',
	// 			component: _import('disciplinaryData/disciplinary/index'),
	// 			name: '监督实施档案',
	// 			hidden: true,
	// 			authority: 'prepareFiles'
	// 		}, {
	// 			path: 'reviewData',
	// 			component: _import('disciplinaryData/disciplinary/index'),
	// 			name: '执纪审查数据',
	// 			hidden: true,
	// 			authority: 'prepareFiles'
	// 		}, {
	// 			path: 'patrolData',
	// 			component: _import('disciplinaryData/disciplinary/index'),
	// 			name: '内部巡查数据',
	// 			hidden: true,
	// 			authority: 'prepareFiles'
	// 		}, {
	// 			path: 'conferenceData',
	// 			component: _import('disciplinaryData/disciplinary/index'),
	// 			name: '监督联席会数据',
	// 			hidden: true,
	// 			authority: 'prepareFiles'
	// 		}, {
	// 			path: '/incorrupt/test',
	// 			component: _import('incorrupt/test/child/index'),
	// 			name: '测试',
	// 			authority: 'testSys',
	// 			children: [{
	// 				path: 'testManager',
	// 				component: _import('incorrupt/test/child/index'),
	// 				name: '测试子类',
	// 				authority: 'testManager'
	// 			}]
	// 		}, {
	// 			path: 'examManage',
	// 			component: _import('incorrupt/exam/manage/index'),
	// 			name: '考试管理',
	// 			hidden: true,
	// 			authority: 'examManage'
	// 		}, {
	// 			path: 'onlineTest',
	// 			component: _import('incorrupt/exam/onlineTest/index'),
	// 			name: '在线测试',
	// 			hidden: true,
	// 			authority: 'onlineTest'
	// 		}, {
	// 			path: 'onlineExam',
	// 			component: _import('incorrupt/exam/onlineExam/index'),
	// 			name: '在线考试',
	// 			hidden: true,
	// 			authority: 'onlineExam'
	// 		}, {
	// 			path: 'OAFormSys',
	// 			component: _import('incorrupt/OAForm/index'),
	// 			name: 'OA廉政表单子系统',
	// 			hidden: true,
	// 			authority: 'OAFormSys'
	// 		}, {
	// 			path: 'AuditSys',
	// 			component: _import('incorrupt/audit/index'),
	// 			name: '廉洁性审核子系统',
	// 			hidden: true,
	// 			authority: 'AuditSys'
	// 		}, {
	// 			path: 'integrityArchives',
	// 			name: '廉政档案',
	// 			// redirect: '/ArchivesIndex',
	// 			component: _import('archives/index'),
	// 			hidden: true,
	// 			authority: 'integrityArchives',
	// 		}, {
	// 			path: 'TopLeadersManageSys',
	// 			component: _import('incorrupt/topLeaders/manage/index'),
	// 			name: '一把手监督管理系统',
	// 			hidden: true,
	// 			authority: 'TopLeadersManageSys'
	// 		}, {
	// 			path: 'TopLeadersReportSys',
	// 			component: _import('incorrupt/topLeaders/report/index'),
	// 			name: '一把手日常监督报备系统',
	// 			hidden: true,
	// 			authority: 'TopLeadersReportSys'
	// 		}, {
	// 			path: 'equativeLeadingGroupSys',
	// 			component: _import('incorrupt/leadingGroup/equative/index'),
	// 			name: '同级领导班子监督管理系统',
	// 			hidden: true,
	// 			authority: 'equativeLeadingGroupSys'
	// 		},
	// 		// {
	// 		// 	path: '/incorruptSys/examSys',
	// 		// 	// component: Layout,
	// 		// 	name: '考试系统',
	// 		// 	icon: 'setting',
	// 		// 	authority: 'examSys',
	// 		// 	children: [
	// 		// 		{
	// 		// 			path: '/incorruptSys/examSys/examManage',
	// 		// 			component: _import('incorrupt/exam/manage/index'),
	// 		// 			name: '考试管理',
	// 		// 			hidden: true,
	// 		// 			authority: 'examManage'
	// 		// 		}
	// 		// 	]
	// 		// }
	// 		{
	// 			path: '/backstage',
	// 			component: _import('dashboard/backstage/index'),
	// 			name: '管理后台',
	// 			hidden: true,
	// 			children: [{
	// 					path: "/userinfo/notification",
	// 					name:"notification",
	// 					component: _import("dashboard/backstage/notification"), //组件地址
	// 				},{
	// 					path: '/backstage/education',
	// 					component: _import('incorrupt/education/index'),
	// 					name: '廉政宣教管理',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "/backstage"
	// 					}
	// 				}, {
	// 					path: '/backstage/educationUser',
	// 					component: _import('incorrupt/educationUser/index'),
	// 					name: '廉政教育',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "/backstage"
	// 					}
	// 				}, {
	// 					path: '/backstage/patrolInternal',
	// 					component: _import('patrol/patrolInternal/index'),
	// 					name: '内部巡查整改',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "/backstage"
	// 					}
	// 				}, {
	// 					path: '/backstage/talkInc',
	// 					component: _import('talkIncorruption/talkInc/index'),
	// 					name: '廉政谈话'
	// 				}, {
	// 					path: '/backstage/employ',
	// 					component: _import('employment/employ/index'),
	// 					name: '选人用人监督'
	// 				}, {
	// 					path: '/backstage/integrityArchives',
	// 					name: '廉政档案',
	// 					component: _import('archives/index')
	// 				}, {
	// 					path: '/backstage/meeting',
	// 					component: _import('meetingJoint/meeting/index'),
	// 					name: '监督联席会'
	// 				}, {
	// 					path: '/backstage/large',
	// 					component: _import('largeTriple/large/index'),
	// 					name: '三重一大'
	// 				}, {
	// 					path: '/backstage/typeLarge',
	// 					component: _import('largeTriple/large/type'),
	// 					name: '三重一大信息管理',
	// 					hidden: true,
	// 					authority: 'large'
	// 				}, {
	// 					path: '/backstage/clue',
	// 					component: _import('casesClues/clue/index'),
	// 					name: '线索及案件管理'
	// 				}, {
	// 					path: '/backstage/clueEvent',
	// 					component: _import('casesClues/clue/event'),
	// 					name: '线索及案件信息管理',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "clue"
	// 					}
	// 				}, 
	// 				// {
	// 				// 	path: '/backstage/categoryRes',
	// 				// 	component: _import('responsibilityImp/responsibility/category'),
	// 				// 	name: '两个责任类别管理',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "responsibility"
	// 				// 	}
	// 				// }
	// 				, {
	// 					path: '/backstage/special',
	// 					component: _import('specialSup/special/index'),
	// 					name: '专项监督'
	// 				}, {
	// 					path: '/backstage/responsibility',
	// 					component: _import('responsibilityImp/responsibility/index'),
	// 					name: '两个责任落实'
	// 				}, {
	// 					path: '/backstage/disciplinary',
	// 					component: _import('disciplinaryData/disciplinary/index'),
	// 					// component: () => import(`@/views/SubView`),
	// 					name: '监督执纪数据中心',
	// 				}, {
	// 					path: '/backstage/formManager',
	// 					component: _import('bpm/form/index'),
	// 					// component: _import('bpm/infra/build/index'),
	// 					name: '流程表单'
	// 				}, {
	// 					path: '/backstage/modelManager',
	// 					component: _import('bpm/model/index'),
	// 					name: '流程模型'
	// 				}, {
	// 					path: '/backstage/processInstanceManager',
	// 					component: _import('bpm/processInstance/index'),
	// 					name: '我的流程'
	// 				}, {
	// 					path: '/backstage/taskTodoManager',
	// 					component: _import('bpm/task/todo'),
	// 					name: '待办任务'
	// 				}, {
	// 					path: '/backstage/taskDoneManager',
	// 					component: _import('bpm/task/done'),
	// 					name: '已办任务'
	// 				}, {
	// 					path: '/backstage/userManager',
	// 					component: _import('admin/user/index'),
	// 					name: '用户管理'
	// 				}, {
	// 					path: '/backstage/menuManager',
	// 					component: _import('admin/menu/index'),
	// 					name: '菜单管理'
	// 				}, {
	// 					path: '/backstage/groupManager',
	// 					component: _import('admin/group/index'),
	// 					name: '角色权限管理'
	// 				}, {
	// 					path: '/backstage/groupTypeManager',
	// 					component: _import('admin/groupType/index'),
	// 					name: '角色类型管理'
	// 				}, {
	// 					path: '/backstage/gateLogManager',
	// 					component: _import('admin/gateLog/index'),
	// 					name: '操作日志管理'
	// 				}, {
	// 					path: '/backstage/baseDict',
	// 					component: _import('admin/dict/index'),
	// 					name: '数据字典'
	// 				}, {
	// 					path: '/backstage/baseDepartment',
	// 					component: _import('admin/department/index'),
	// 					name: '部门管理'
	// 				}, 
	// 				// {
	// 				// 	path: '/backstage/newlyPatrolInternal',
	// 				// 	component: _import('patrol/patrolInternal/patrolInternalNewly'),
	// 				// 	name: '内部巡查',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "patrolInternal" // 解决新建页面不显示侧边栏问题
	// 				// 	}
	// 				// }, {
	// 				// 	path: '/backstage/personnelPatrolPatrolInternal',
	// 				// 	component: _import('patrol/patrolInternal/personnelPatrol'),
	// 				// 	name: '巡查人员库',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "patrolInternal"
	// 				// 	}
	// 				// }, 
	// 				// {
	// 				// 	path: '/backstage/accountTalkInc',
	// 				// 	component: _import('talkIncorruption/talkInc/account'),
	// 				// 	name: '子公司台账',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "talkInc"
	// 				// 	}
	// 				// }, 
	// 				// {
	// 				// 	path: '/backstage/situationTemploy',
	// 				// 	component: _import('employment/employ/situation'),
	// 				// 	name: '选人用人情况',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "employ"
	// 				// 	}
	// 				// },
	// 				 {
	// 					path: '/backstage/screeningComCom',
	// 					component: _import('archives/screeningCom'),
	// 					name: '单位风险点排查',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "integrityArchives"
	// 					}
	// 				}, {
	// 					path: '/backstage/informationCom',
	// 					component: _import('archives/informationCom'),
	// 					name: '单位信息档案',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "integrityArchives"
	// 					}
	// 				}, {
	// 					path: '/backstage/filesPer',
	// 					component: _import('archives/filesPer'),
	// 					name: '个人档案',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "integrityArchives"
	// 					}
	// 				}, 
	// 				// {
	// 				// 	path: '/backstage/temporaryPut',
	// 				// 	component: _import('archives/temporaryPut'),
	// 				// 	name: '临时任务提报',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "integrityArchives"
	// 				// 	}
	// 				// }, 
	// 				{
	// 					path: '/backstage/solidificationPut/add',
	// 					component: _import('archives/edit'),
	// 					name: '固化任务提报 / 新增',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "integrityArchives"
	// 					}
	// 				}, {
	// 					path: '/backstage/subsidiary',
	// 					component: _import('archives/subsidiary'),
	// 					name: '子公司信息',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "integrityArchives"
	// 					}
	// 				}, {
	// 					path: '/backstage/personnelAll',
	// 					component: _import('archives/personnelAll'),
	// 					name: '单位内所有人员数据',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "integrityArchives"
	// 					}
	// 				}, {
	// 					path: '/backstage/newlyLink',
	// 					component: _import('incorrupt/education/newlyLink'),
	// 					name: '新增超链接',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}, {
	// 					path: '/backstage/newlyArticle',
	// 					component: _import('incorrupt/education/newlyArticle'),
	// 					name: '新增文章',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}, {
	// 					path: '/backstage/sortManagement',
	// 					component: _import('incorrupt/education/sortManagement'),
	// 					name: '分类管理',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}, {
	// 					path: '/backstage/educationStatistics',
	// 					component: _import('incorrupt/education/educationStatistics'),
	// 					name: '子公司统计',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}, {
	// 					path: '/backstage/articleDetail',
	// 					component: _import('incorrupt/education/articleDetail'),
	// 					name: '文章详情',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}, 
	// 				// {
	// 				// 	path: '/backstage/meetingDetail',
	// 				// 	component: _import('meetingJoint/meeting/detail'),
	// 				// 	name: '联席会会议详情',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "meeting"
	// 				// 	}
	// 				// }, {
	// 				// 	path: '/backstage/meetingPersonnel',
	// 				// 	component: _import('meetingJoint/meeting/personnel'),
	// 				// 	name: '联席会成员',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "meeting"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/accountLarge',
	// 				// 	component: _import('largeTriple/large/account'),
	// 				// 	name: '台账',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "large"
	// 				// 	}
	// 				// }, {
	// 				// 	path: '/backstage/ruleLarge',
	// 				// 	component: _import('largeTriple/large/rule'),
	// 				// 	name: '规则设置',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "large"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/typeLarge',
	// 				// 	component: _import('largeTriple/large/type'),
	// 				// 	name: '会议类型管理',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "large"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/situationLarge',
	// 				// 	component: _import('largeTriple/large/situation'),
	// 				// 	name: '”三重一大“情况',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "large"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/clueAdd',
	// 				// 	component: _import('casesClues/clue/add'),
	// 				// 	name: '新增线索情况',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "clue"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/clueEvent',
	// 				// 	component: _import('casesClues/clue/event'),
	// 				// 	name: '事项信息管理',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "clue"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/newlySpecial',
	// 				// 	component: _import('specialSup/special/patrolInternalNewly'),
	// 				// 	name: '下发专项监督事项',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "special" // 解决新建页面不显示侧边栏问题
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/putRes',
	// 				// 	component: _import('responsibilityImp/responsibility/temporaryPut'),
	// 				// 	name: '两个责任类别提报',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "responsibility"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/categoryRes',
	// 				// 	component: _import('responsibilityImp/responsibility/category'),
	// 				// 	name: '两个责任类别管理',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "responsibility"
	// 				// 	}
	// 				// }
	// 				// , {
	// 				// 	path: '/backstage/profile',
	// 				// 	component: _import('disciplinaryData/disciplinary/profile'),
	// 				// 	name: '个人档案',
	// 				// 	hidden: true,
	// 				// 	meta: {
	// 				// 		parentName: "disciplinary"
	// 				// 	}
	// 				// }
	// 				, {
	// 					path: '/backstage/examination',
	// 					component: _import('disciplinaryData/disciplinary/examination'),
	// 					name: '执纪审查档案',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "disciplinary"
	// 					}
	// 				}, {
	// 					path: '/backstage/subsidiaryDis',
	// 					component: _import('disciplinaryData/disciplinary/subsidiary'),
	// 					name: '子公司信息',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "disciplinary"
	// 					}
	// 				}, {
	// 					path: '/backstage/form/formAdd',
	// 					// component: _import('bpm/form/formEditor'),
	// 					component: _import('bpm/design/index'),
	// 					name: '设计表单-新增',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "modelManager" // 解决新建页面不显示侧边栏问题
	// 					}
	// 				},{
	// 					path: '/backstage/form/formEdit',
	// 					// component: _import('bpm/form/formEditor'),
	// 					component: _import('bpm/design/index'),
	// 					name: '设计表单-修改',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "modelManager" // 解决新建页面不显示侧边栏问题
	// 					}
	// 				},{
	// 					path: '/backstage/modelDesign',
	// 					component: _import('bpm/model/modelEditor'),
	// 					name: '设计流程',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "formManager" // 解决新建页面不显示侧边栏问题
	// 					}
	// 				},{
	// 					path: '/backstage/processInstance/create',
	// 					component: _import('bpm/processInstance/create'),
	// 					name: '发起流程',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
	// 					}
	// 				},{
	// 					path: '/backstage/processInstance/detail',
	// 					component: _import('bpm/processInstance/detail'),
	// 					name: '流程详情',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "processInstanceManager" // 解决新建页面不显示侧边栏问题
	// 					}
	// 				},{
	// 					path: '/backstage/manager/definition',
	// 					component: _import('bpm/definition/index'),
	// 					name: '流程定义',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "formManager" // 解决新建页面不显示侧边栏问题
	// 					}
	// 				}, {
	// 					path: '/backstage/newlyArticle',
	// 					component: _import('incorrupt/education/newlyArticle'),
	// 					name: '新增文章',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}, {
	// 					path: '/backstage/articleDetail',
	// 					component: _import('incorrupt/education/articleDetail'),
	// 					name: '文章详情',
	// 					hidden: true,
	// 					meta: {
	// 						parentName: "education"
	// 					}
	// 				}
	// 			  ],
	// 		},
	// 	]
	// },
	// {
	// 	path: '/bpmSys',
	// 	component: Layout,
	// 	name: '工作流程管理',
	// 	icon: 'setting',
	// 	authority: 'bpmSys',
	// 	children: [{
	// 		path: 'formManager',
	// 		component: _import('bpm/form/index'),
	// 		// component: _import('bpm/infra/build/index'),
	// 		name: '流程表单',
	// 		authority: 'formManager'
	// 	}, {
	// 		path: 'modelManager',
	// 		component: _import('bpm/model/index'),
	// 		name: '流程模型',
	// 		authority: 'modelManager'
	// 	}, {
	// 		path: 'processInstanceManager',
	// 		component: _import('bpm/processInstance/index'),
	// 		name: '我的流程',
	// 		authority: 'processInstanceManager'
	// 	}, {
	// 		path: 'taskTodoManager',
	// 		component: _import('bpm/task/todo'),
	// 		name: '待办任务',
	// 		authority: 'taskTodoManager'
	// 	}, {
	// 		path: 'taskDoneManager',
	// 		component: _import('bpm/task/done'),
	// 		name: '已办任务',
	// 		authority: 'taskDoneManager'
	// 	}]
	// },
];
