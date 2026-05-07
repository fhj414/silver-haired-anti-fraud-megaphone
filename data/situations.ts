export type Situation = {
  id: string;
  title: string;
  urgent: string;
  cannotDo: string[];
  shouldDo: string[];
  phones: string[];
  familyMessage: string;
};

export const situations: Situation[] = [
  {
    id: "unknown-call",
    title: "我接到陌生电话了",
    urgent: "先别急，先把电话挂掉，给自己一分钟冷静。",
    cannotDo: ["不能按对方要求转账", "不能告诉验证码", "不能打开陌生链接"],
    shouldDo: ["拨打官方电话核实", "把来电号码发给子女", "不确定就拨打 96110"],
    phones: ["96110", "110"],
    familyMessage: "我刚接到陌生电话，对方让我配合操作。请你帮我看一下，我先不转账、不点链接、不告诉验证码。",
  },
  {
    id: "transfer-money",
    title: "有人让我转账",
    urgent: "先别转，所有急着要钱的人都要多核实。",
    cannotDo: ["不能转给陌生账户", "不能相信安全账户", "不能因为对方催就付款"],
    shouldDo: ["问清楚对方身份", "打原来的电话核实", "让子女或银行工作人员帮忙看"],
    phones: ["96110", "110"],
    familyMessage: "有人让我转账，我先停下来了。请你帮我核实对方身份和收款账户。",
  },
  {
    id: "download-app",
    title: "有人让我下载 App",
    urgent: "先别下载，陌生软件可能会偷钱。",
    cannotDo: ["不能安装陌生安装包", "不能给 App 开远程控制权限", "不能输入银行卡密码"],
    shouldDo: ["只从手机官方应用商店下载", "让子女帮忙确认", "删除来历不明的软件"],
    phones: ["96110"],
    familyMessage: "有人让我下载一个 App 办事。我先没有装，请你帮我确认是不是官方软件。",
  },
  {
    id: "share-screen",
    title: "有人让我共享屏幕",
    urgent: "马上停止，共享屏幕时银行卡和验证码都会被看见。",
    cannotDo: ["不能打开银行 App", "不能输入密码", "不能继续听对方指挥"],
    shouldDo: ["立刻关闭共享屏幕", "退出会议软件", "改支付密码并联系银行"],
    phones: ["96110", "110"],
    familyMessage: "有人让我共享屏幕，我已经停下了。请你帮我检查手机和银行卡是否安全。",
  },
  {
    id: "delivery-problem",
    title: "有人说我快递有问题",
    urgent: "先别点链接，快递理赔请到官方平台处理。",
    cannotDo: ["不能给验证码", "不能点短信链接", "不能提供银行卡密码"],
    shouldDo: ["打开购物平台查看订单", "拨打快递官方客服电话", "把短信截图发给子女"],
    phones: ["96110"],
    familyMessage: "有人说我的快递有问题，要我点链接理赔。我先不点，请你帮我看看订单。",
  },
  {
    id: "elder-invest",
    title: "有人推荐养老投资",
    urgent: "先别交钱，养老投资一定要慢慢查。",
    cannotDo: ["不能现场交会员费", "不能相信高额返利", "不能把养老钱转给个人"],
    shouldDo: ["查企业资质", "看清合同", "让子女陪同再决定"],
    phones: ["96110", "110"],
    familyMessage: "有人推荐养老投资，说能返利。我先没有交钱，请你陪我一起看看合同和公司资质。",
  },
  {
    id: "miracle-medicine",
    title: "有人卖神药保健品",
    urgent: "先别买，包治百病的话不能信。",
    cannotDo: ["不能停正规医院开的药", "不能相信免费体检后的恐吓", "不能大额购买囤货"],
    shouldDo: ["问正规医生", "看清是否是药品批准文号", "和家人商量后再买"],
    phones: ["12315"],
    familyMessage: "有人向我推荐保健品，说能治病。我先不买，请你帮我查一下是否正规。",
  },
  {
    id: "child-accident",
    title: "有人说孩子出事了",
    urgent: "先别慌，马上拨打孩子原来的电话核实。",
    cannotDo: ["不能按陌生号码转账", "不能听对方说别报警", "不能只听一段语音就相信"],
    shouldDo: ["回拨孩子原号码", "联系其他家人", "问家庭暗号"],
    phones: ["110", "96110"],
    familyMessage: "有人说家里孩子出事要钱。我先没有转，请你马上帮我确认孩子是否安全。",
  },
  {
    id: "subsidy",
    title: "有人说能帮我领补贴",
    urgent: "先别填信息，补贴不会让您先交钱。",
    cannotDo: ["不能交手续费", "不能给银行卡密码", "不能点陌生登记链接"],
    shouldDo: ["问社区或街道", "查看政府官方网站", "让子女帮忙核实"],
    phones: ["96110", "110"],
    familyMessage: "有人说能帮我领补贴，让我填信息或交钱。我先停下了，请你帮我核实是不是真的。",
  },
];

export function getSituationById(id: string) {
  return situations.find((situation) => situation.id === id);
}
