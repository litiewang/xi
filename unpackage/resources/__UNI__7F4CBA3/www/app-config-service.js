
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/category/category","pages/rank/rank","pages/mybooks/mybooks","pages/bookinfo/bookinfo","pages/searchRes/searchRes","pages/read/read","pages/read/localread","pages/searchlocal/searchlocal"],"window":{"navigationBarBackgroundColor":"#2979ff","navigationBarTextStyle":"black","navigationBarTitleText":"爱看小说","backgroundColor":"#eeeeee","backgroundTextStyle":"light","enablePullDownRefresh":false},"tabBar":{"list":[{"pagePath":"pages/index/index","text":"精选","iconPath":"/static/imgs/index.png","selectedIconPath":"/static/imgs/index_selected.png"},{"pagePath":"pages/rank/rank","text":"排行","iconPath":"/static/imgs/rank.png","selectedIconPath":"/static/imgs/rank_selected.png"},{"pagePath":"pages/category/category","text":"书城","iconPath":"/static/imgs/category.png","selectedIconPath":"/static/imgs/category_selected.png"},{"pagePath":"pages/mybooks/mybooks","text":"书架","iconPath":"/static/imgs/mybooks.png","selectedIconPath":"/static/imgs/mybooks_selected.png"}],"color":"#707070","selectedColor":"#2979ff"},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"小说阅读app-完整前端-导入即可调试运行","compilerVersion":"3.1.12","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/category/category","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/rank/rank","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/mybooks/mybooks","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/bookinfo/bookinfo","meta":{},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/searchRes/searchRes","meta":{},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/read/read","meta":{},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/read/localread","meta":{},"window":{"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/searchlocal/searchlocal","meta":{},"window":{"navigationBarTitleText":"导入本地图书","enablePullDownRefresh":false,"navigationBarTextStyle":"white"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
