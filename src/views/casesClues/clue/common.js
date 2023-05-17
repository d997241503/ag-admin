export const MANAGE_STATUS = {
    CONCLUSION: '1',
    PROCESS: '0'
}
export const MANAGE_STATUS_OPTIONS = [
    { label: '办结', value: MANAGE_STATUS.CONCLUSION },
    { label: '办理中', value: MANAGE_STATUS.PROCESS }
]

export const CLUE_SOURCE = {
    REPORT: '1',
    DISCOVER: '2',
    OVER: '3'
}
export const CLUE_SOURCE_OPTIONS = [
    { label: '信访举报', value: CLUE_SOURCE.REPORT },
    { label: '监督执纪过程中发现', value: CLUE_SOURCE.DISCOVER },
    { label: '外部移交', value: CLUE_SOURCE.OVER }
]

export const CLUE_TYPE = {
    LETTER: '1',
    PROBLEM: '2'
}
export const CLUE_TYPE_OPTIONS = [
    { label: '信访线索', value: CLUE_TYPE.LETTER },
    { label: '问题线索', value: CLUE_TYPE.PROBLEM }
]

export const CLUE_FIELD = {
    ZHAOCAI: '1',
    GONGCHENG: '2',
    ZHAOSHANG: '3',
    TUDI: '4',
    RONGZI: '5',
    XUANREN: '6',
    CAIWU: '7',
    QITA: '8',
}
export const CLUE_FIELD_OPTIONS = [
    { label: '招标采购', value: CLUE_FIELD.ZHAOCAI },
    { label: '工程建设', value: CLUE_FIELD.GONGCHENG },
    { label: '四风问题', value: CLUE_FIELD.TUDI },
    { label: '投资融资', value: CLUE_FIELD.RONGZI },
    { label: '选人用人', value: CLUE_FIELD.XUANREN },
    { label: '资产管理', value: CLUE_FIELD.CAIWU },
    { label: '其他', value: CLUE_FIELD.QITA },
]


export const TURN_TYPE = {
    SHANGJI: '1',
    ZHINENG: '2',
    ZIGONGSI: '3',
    XUNSHI: '4'
}
export const TURN_TYPE_OPTIONS = [
    { label: '上级机关转办移交', value: TURN_TYPE.SHANGJI },
    { label: '职能监督移交', value: TURN_TYPE.ZHINENG },
    { label: '子公司上报', value: TURN_TYPE.ZIGONGSI },
    { label: '巡视巡察移交', value: TURN_TYPE.XUNSHI }
]

export const RANK_OPTIONS = [
    { label: 'M1', value: '1' },
    { label: 'M2', value: '2' },
    { label: 'M3', value: '3' },
    { label: 'M4', value: '4' },
    { label: 'M5', value: '5' },
    { label: 'M6', value: '6' },
    { label: 'M7', value: '7' },
    { label: 'M8', value: '8' },
    { label: 'M9', value: '9' },
    { label: 'PV', value: '10' },
    { label: 'P1', value: '11' },
    { label: 'P2', value: '12' },
    { label: 'P3', value: '13' },
    { label: 'P4', value: '14' }
]

export const LETTER_DISPOSE = [
    { label: '予以了结', value: '1' },
    { label: '业务管理问题（给予一定组织处理）', value: '2' }
]

export const PROBLEM_DISPOSE = {
    TANHUA: '1',
    HESHI: '2',
    DAICHA: '3',
    LIAOJIE: '4'
}
export const PROBLEM_DISPOSE_OPTIONS = [
    { label: '谈话（函询）', value: PROBLEM_DISPOSE.TANHUA },
    { label: '初步核实', value: PROBLEM_DISPOSE.HESHI },
    { label: '暂存待查', value: PROBLEM_DISPOSE.DAICHA },
    { label: '予以了结', value: PROBLEM_DISPOSE.LIAOJIE }
]

export const TALK_MEASUER = {
    HUIFU: '1',
    CHULI: '2',
    HESHI: '3'
}
export const TALK_MEASUER_OPTIONS = [
    { label: '回复采信', value: TALK_MEASUER.HUIFU },
    { label: '给予适当处理', value: TALK_MEASUER.CHULI },
    { label: '初步核实', value: TALK_MEASUER.HESHI }
]

export const VERIFY_MEASURE = {
    LIAN: '4',
    LIAOJIE: '5',
    TANHUA: '6',
    ZANCUN: '7',
    CHULI: '8'
}
export const VERIFY_MEASURE_OPTIONS = [
    { label: '立案', value: VERIFY_MEASURE.LIAN },
    { label: '给予了结', value: VERIFY_MEASURE.LIAOJIE },
    { label: '谈话提醒', value: VERIFY_MEASURE.TANHUA },
    { label: '暂存', value: VERIFY_MEASURE.ZANCUN },
    { label: '给予适当处理', value: VERIFY_MEASURE.CHULI }
]

export const RECORD_TYPE_OPTIONS = [
    { label: '党纪立案', value: '1' },
    { label: '政务立案', value: '2' },
    { label: '司纪立案', value: '3' }
]

export function getMap(opt) {
    let mapObj = {}
    opt.forEach(({label, value}) => {
        mapObj[value] = label
    })
    return mapObj
}