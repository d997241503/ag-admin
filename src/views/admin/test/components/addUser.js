import {
	addObj
} from 'api/admin/user/index';

const formData = {
	id: undefined,
	username: undefined,
	name: undefined,
	sex: undefined,
	password: 123456,
	confirmPassword: undefined,
	description: undefined,
	departmentName: undefined,
	departmentId: undefined,
	birthday: undefined,
	address: undefined,
	mobilePhone: undefined,
	telPhone: undefined,
	email: undefined,
	idCard: undefined,
	nation: undefined,
	nativePlace: undefined,
	education: undefined,
	politicalOutlook: undefined,
	workUnit: undefined,
	dateOfWork: undefined,
	rank: undefined,
	post: undefined
}

const departments = [{
	"id": 56,
	"departmentName": "机械学院"
}, {
	"id": 57,
	"departmentName": "信息学院"
}, {
	"id": 58,
	"departmentName": "航空学院"
}, {
	"id": 59,
	"departmentName": "医药学院"
}, {
	"id": 60,
	"departmentName": "音乐学院"
}, {
	"id": 61,
	"departmentName": "体育学院"
}, {
	"id": 62,
	"departmentName": "后勤处"
}, {
	"id": 63,
	"departmentName": "校监察处"
}]

export function executeAdd(num) {
	for (let i = 0; i < num; i++) {
		setTimeout(() => {
			try {
				console.log("_______________________________________________________________________________________")
				console.log(i + 1);
				init();
			} catch (e) {
				//TODO handle the exception
				console.log("_______________________________________________________________________________________")
				console.log("新增用户数据失败！");
			}
		}, 1000 * i);
	}
}

export function init() {
	getStringRandom(8);
	getName();
	getRandomID();
	getTel();
	getDepartment();
	getRoad();
	getEducation();
	getNation();
	getPoliticalOutlook();

	addObj(formData).then(response => {
		if (response && response.code === 0) {
			console.log("账号：" + formData.username + "，姓名：" + formData.name + "，性别：" + (formData.sex == '1' ? '男' : '女') +
				"，出生日期：" + formData.birthday + "，民族：" + formData.nation + "，部门：" + formData.departmentName)
			console.log("新增成功!");
		} else {
			console.log("_______________________________________________________________________________________")
			console.log("新增用户数据失败，" + response.msg + "！");
		}
	}).catch(error => {
		console.log("_______________________________________________________________________________________")
		console.log("新增用户数据失败！");
	});
}

// 随机用户名
function getStringRandom(length) {
	var str = '';
	for (let i = 0; i < length; i++) {
		var numOrChar = Math.floor(Math.random() * 100) % 2 == 0 ? 'char' : 'num';
		switch (numOrChar) {
			case 'char':
				str += randomCoding();
				break;
			case 'num':
				str += Math.floor(Math.random() * 10);
				break;
			default:
				break;
		}
	}
	formData.username = str;
}
// 随机生成字母
function randomCoding() {
	//创建26个字母数组
	var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
		'V', 'W', 'X', 'Y', 'Z'
	];
	var idvalue = '';
	// int n = 4;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
	// for(var i=0;i<n;i++){
	idvalue += arr[Math.floor(Math.random() * 26)];
	// })
	return idvalue;
}

//随机生成姓名
function getName() {
	var Surname = ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
		"何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘",
		"葛", "奚", "范", "彭", "郎",
		"鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳", "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺", "倪",
		"汤", "滕", "殷",
		"罗", "毕", "郝", "邬", "安", "常", "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", "元", "卜", "顾", "孟", "平", "黄", "和",
		"穆", "萧", "尹", "姚", "邵", "湛", "汪", "祁", "毛", "禹", "狄", "米", "贝", "明", "臧", "计", "伏", "成", "戴", "谈", "宋", "茅", "庞",
		"熊", "纪", "舒",
		"屈", "项", "祝", "董", "梁", "杜", "阮", "蓝", "闵", "席", "季"
	];
	var girl =
		"秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兰凤洁梅琳素云莲真环雪荣爱妹霞香月莺媛艳瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽 ";
	var boy =
		"伟刚勇毅俊峰强军平保东文辉力明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行时泰盛雄琛钧冠策腾楠榕风航弘";
	var index = Math.floor(Math.random() * (Surname.length - 1));
	var name = Surname[index]; //获得一个随机的姓氏
	var i = Math.floor(Math.random() * 3); //可以根据这个数设置产生的男女比例
	if (i == 2) {
		var j = Math.floor(Math.random() * (girl.length - 2));
		if (j % 2 == 0) {
			name = name + girl.substring(j, j + 2);
			formData.sex = '0';
		} else {
			name = name + boy.substring(j, j + 1);
			formData.sex = '1';
		}
	} else {
		var j = Math.floor(Math.random() * (boy.length - 2));
		if (j % 2 == 0) {
			name = name + boy.substring(j, j + 2);
			formData.sex = '1';
		} else {
			name = name + girl.substring(j, j + 1);
			formData.sex = '0';
		}
	}
	formData.name = name;
}


//随机生成身份证号码
function getRandomID() {
	var id = "";
	// 随机生成省、自治区、直辖市代码 1-2
	var provinces = [
		"43",
		"43"
	];
	var province = provinces[Math.floor(Math.random() * (provinces.length - 1))];
	// 随机生成地级市、盟、自治州代码 3-4
	var citys = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
	var city = citys[Math.floor(Math.random() * (citys.length - 1))];
	// 随机生成县、县级市、区代码 5-6
	var countys = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "21", "22", "23", "24", "25", "26", "27",
		"28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"
	];
	var county = countys[Math.floor(Math.random() * (countys.length - 1))];
	// 随机生成出生年月 7-14
	// SimpleDateFormat dft = new SimpleDateFormat("yyyyMMdd");
	var nowDate = new Date();
	var year = parseInt(nowDate.getFullYear()) - Math.floor(Math.random() * 50) - 20;
	var month = Math.floor(Math.random() * 12) + 1;
	month = month + 1 < 10 ? '0' + month : month;
	var day = Math.floor(Math.random() * 28) + 1;
	day = day + 1 < 10 ? '0' + day : day;
	var birth = '' + year + month + day;
	formData.birthday = year + '-' + month + '-' + day;
	// Date beginDate = new Date();
	// Calendar date = Calendar.getInstance();
	// date.setTime(beginDate);
	// date.set(Calendar.DATE,
	// 	date.get(Calendar.DATE) - new Random().nextInt(365 * 100));
	// var birth = dft.format(date.getTime());
	// 随机生成顺序号 15-17
	//String no = new Random().nextInt(999) + "";
	var i = Math.floor(Math.random() * 900) + 100;
	var no = i + "";

	// 随机生成校验码 18
	var checks = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"];
	var check = checks[Math.floor(Math.random() * (checks.length - 1))];
	// 拼接身份证号码
	id = province + city + county + birth + no + check;
	formData.idCard = id;
}

//手机号
function getTel() {
	var telFirst = [134, 135, 136, 137, 138, 139, 150, 151, 152, 157, 158, 159, 130, 131, 132, 155, 156, 133, 153];
	var first = telFirst[Math.floor(Math.random() * (telFirst.length - 1))];
	var second = Math.floor(Math.random() * 9999);
	var third = Math.floor(Math.random() * 9999);
	formData.mobilePhone = "" + first + second + third;
}

// 部门
function getDepartment() {
	var index = Math.floor(Math.random() * (departments.length - 1));
	var status = Math.floor(Math.random() * 100);
	if (status % 30 == 0) {
		formData.departmentId = departments[index].id;
		formData.departmentName = departments[index].departmentName;
	} else {
		formData.departmentId = departments[index].id;
		formData.departmentName = departments[index].departmentName;
	}
}

//地址
function getRoad() {
	var road =
		"重庆大厦,黑龙江路,十梅庵街,遵义路,湘潭街,瑞金广场,仙山街,仙山东路,仙山西大厦,白沙河路,赵红广场,机场路,民航街,长城南路,流亭立交桥,虹桥广场,长城大厦,礼阳路,风岗街,中川路,白塔广场,兴阳路,文阳街,绣城路,河城大厦,锦城广场,崇阳街,华城路,康城街,正阳路,和阳广场,中城路,江城大厦,顺城路,安城街,山城广场,春城街,国城路,泰城街,德阳路,明阳大厦,春阳路,艳阳街,秋阳路,硕阳街,青威高速,瑞阳街,丰海路,双元大厦,惜福镇街道,夏庄街道,古庙工业园,中山街,太平路,广西街,潍县广场,博山大厦,湖南路,济宁街,芝罘路,易州广场,荷泽四路,荷泽二街,荷泽一路,荷泽三大厦,观海二广场,广西支街,观海一路,济宁支街,莒县路,平度广场,明水路,蒙阴大厦,青岛路,湖北街,江宁广场,郯城街,天津路,保定街,安徽路,河北大厦,黄岛路,北京街,莘县路,济南街,宁阳广场,日照街,德县路,新泰大厦,荷泽路,山西广场,沂水路,肥城街,兰山路,四方街,平原广场,泗水大厦,浙江路,曲阜街,寿康路,河南广场,泰安路,大沽街,红山峡支路,西陵峡一大厦,台西纬一广场,台西纬四街,台西纬二路,西陵峡二街,西陵峡三路,台西纬三广场,台西纬五路,明月峡大厦,青铜峡路,台西二街,观音峡广场,瞿塘峡街,团岛二路,团岛一街,台西三路,台西一大厦,郓城南路,团岛三街,刘家峡路,西藏二街,西藏一广场,台西四街,三门峡路,城武支大厦,红山峡路,郓城北广场,龙羊峡路,西陵峡街,台西五路,团岛四街,石村广场,巫峡大厦,四川路,寿张街,嘉祥路,南村广场,范县路,西康街,云南路,巨野大厦,西江广场,鱼台街,单县路,定陶街,滕县路,钜野广场,观城路,汶上大厦,朝城路,滋阳街,邹县广场,濮县街,磁山路,汶水街,西藏路,城武大厦,团岛路,南阳街,广州路,东平街,枣庄广场,贵州街,费县路,南海大厦,登州路,文登广场,信号山支路,延安一街,信号山路,兴安支街,福山支广场,红岛支大厦,莱芜二路,吴县一街,金口三路,金口一广场,伏龙山路,鱼山支街,观象二路,吴县二大厦,莱芜一广场,金口二街,海阳路,龙口街,恒山路,鱼山广场,掖县路,福山大厦,红岛路,常州街,大学广场,龙华街,齐河路,莱阳街,黄县路,张店大厦,祚山路,苏州街,华山路,伏龙街,江苏广场,龙江街,王村路,琴屿大厦,齐东路,京山广场,龙山路,牟平街,延安三路,延吉街,南京广场,东海东大厦,银川西路,海口街,山东路,绍兴广场,芝泉路,东海中街,宁夏路,香港西大厦,隆德广场,扬州街,郧阳路,太平角一街,宁国二支路,太平角二广场,天台东一路,太平角三大厦,漳州路一路,漳州街二街,宁国一支广场,太平角六街,太平角四路,天台东二街,太平角五路,宁国三大厦,澳门三路,江西支街,澳门二路,宁国四街,大尧一广场,咸阳支街,洪泽湖路,吴兴二大厦,澄海三路,天台一广场,新湛二路,三明北街,新湛支路,湛山五街,泰州三广场,湛山四大厦,闽江三路,澳门四街,南海支路,吴兴三广场,三明南路,湛山二街,二轻新村镇,江南大厦,吴兴一广场,珠海二街,嘉峪关路,高邮湖街,湛山三路,澳门六广场,泰州二路,东海一大厦,天台二路,微山湖街,洞庭湖广场,珠海支街,福州南路,澄海二街,泰州四路,香港中大厦,澳门五路,新湛三街,澳门一路,正阳关街,宁武关广场,闽江四街,新湛一路,宁国一大厦,王家麦岛,澳门七广场,泰州一路,泰州六街,大尧二路,青大一街,闽江二广场,闽江一大厦,屏东支路,湛山一街,东海西路,徐家麦岛函谷关广场,大尧三路,晓望支街,秀湛二路,逍遥三大厦,澳门九广场,泰州五街,澄海一路,澳门八街,福州北路,珠海一广场,宁国二路,临淮关大厦,燕儿岛路,紫荆关街,武胜关广场,逍遥一街,秀湛四路,居庸关街,山海关路,鄱阳湖大厦,新湛路,漳州街,仙游路,花莲街,乐清广场,巢湖街,台南路,吴兴大厦,新田路,福清广场,澄海路,莆田街,海游路,镇江街,石岛广场,宜兴大厦,三明路,仰口街,沛县路,漳浦广场,大麦岛,台湾街,天台路,金湖大厦,高雄广场,海江街,岳阳路,善化街,荣成路,澳门广场,武昌路,闽江大厦,台北路,龙岩街,咸阳广场,宁德街,龙泉路,丽水街,海川路,彰化大厦,金田路,泰州街,太湖路,江西街,泰兴广场,青大街,金门路,南通大厦,旌德路,汇泉广场,宁国路,泉州街,如东路,奉化街,鹊山广场,莲岛大厦,华严路,嘉义街,古田路,南平广场,秀湛路,长汀街,湛山路,徐州大厦,丰县广场,汕头街,新竹路,黄海街,安庆路,基隆广场,韶关路,云霄大厦,新安路,仙居街,屏东广场,晓望街,海门路,珠海街,上杭路,永嘉大厦,漳平路,盐城街,新浦路,新昌街,高田广场,市场三街,金乡东路,市场二大厦,上海支路,李村支广场,惠民南路,市场纬街,长安南路,陵县支街,冠县支广场,小港一大厦,市场一路,小港二街,清平路,广东广场,新疆路,博平街,港通路,小港沿,福建广场,高唐街,茌平路,港青街,高密路,阳谷广场,平阴路,夏津大厦,邱县路,渤海街,恩县广场,旅顺街,堂邑路,李村街,即墨路,港华大厦,港环路,馆陶街,普集路,朝阳街,甘肃广场,港夏街,港联路,陵县大厦,上海路,宝山广场,武定路,长清街,长安路,惠民街,武城广场,聊城大厦,海泊路,沧口街,宁波路,胶州广场,莱州路,招远街,冠县路,六码头,金乡广场,禹城街,临清路,东阿街,吴淞路,大港沿,辽宁路,棣纬二大厦,大港纬一路,贮水山支街,无棣纬一广场,大港纬三街,大港纬五路,大港纬四街,大港纬二路,无棣二大厦,吉林支路,大港四街,普集支路,无棣三街,黄台支广场,大港三街,无棣一路,贮水山大厦,泰山支路,大港一广场,无棣四路,大连支街,大港二路,锦州支街,德平广场,高苑大厦,长山路,乐陵街,临邑路,嫩江广场,合江路,大连街,博兴路,蒲台大厦,黄台广场,城阳街,临淄路,安邱街,临朐路,青城广场,商河路,热河大厦,济阳路,承德街,淄川广场,辽北街,阳信路,益都街,松江路,流亭大厦,吉林路,恒台街,包头路,无棣街,铁山广场,锦州街,桓台路,兴安大厦,邹平路,胶东广场,章丘路,丹东街,华阳路,青海街,泰山广场,周村大厦,四平路,台东西七街,台东东二路,台东东七广场,台东西二路,东五街,云门二路,芙蓉山村,延安二广场,云门一街,台东四路,台东一街,台东二路,杭州支广场,内蒙古路,台东七大厦,台东六路,广饶支街,台东八广场,台东三街,四平支路,郭口东街,青海支路,沈阳支大厦,菜市二路,菜市一街,北仲三路,瑞云街,滨县广场,庆祥街,万寿路,大成大厦,芙蓉路,历城广场,大名路,昌平街,平定路,长兴街,浦口广场,诸城大厦,和兴路,德盛街,宁海路,威海广场,东山路,清和街,姜沟路,雒口大厦,松山广场,长春街,昆明路,顺兴街,利津路,阳明广场,人和路,郭口大厦,营口路,昌邑街,孟庄广场,丰盛街,埕口路,丹阳街,汉口路,洮南大厦,桑梓路,沾化街,山口路,沈阳街,南口广场,振兴街,通化路,福寺大厦,峄县路,寿光广场,曹县路,昌乐街,道口路,南九水街,台湛广场,东光大厦,驼峰路,太平山,标山路,云溪广场,太清路"
		.split(",");
	var first = road[Math.floor(Math.random() * (road.length - 1))];
	var second = Math.floor(Math.random() * 150) + 11 + "号";
	var third = "-" + Math.floor(Math.random() * 20) + 1 + "-" + Math.floor(Math.random() * 10) + 1;
	formData.address = first + second + third;
}

//学历
function getEducation() {
	var education = [1, 2, 3, 4, 5, 6, 7];
	formData.education = education[Math.floor(Math.random() * (education.length - 1))];
}

//民族
function getNation() {
	var nations = ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族",
		"土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族", "土族",
		"达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族",
		"德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"
	];
	var index = Math.floor(Math.random() * (nations.length - 1));
	if (index != 8) {
		formData.nation = "汉族";
	} else {
		formData.nation = nations[index];
	}
}

//政治面貌
function getPoliticalOutlook() {
	var politicalOutlooks = [1, 2, 3, 5];
	var index = Math.floor(Math.random() * 100);
	if (index <= 3) {
		formData.politicalOutlook = politicalOutlooks[0];
		return;
	}
	if (index <= 10) {
		formData.politicalOutlook = politicalOutlooks[1];
		return;
	}
	if (index <= 80) {
		formData.politicalOutlook = politicalOutlooks[2];
		return;
	}
	formData.politicalOutlook = politicalOutlooks[3];
}
