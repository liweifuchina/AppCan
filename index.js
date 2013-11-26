var 	winPlat = window.navigator.platform; 
var	isPhone = !(winPlat == 'Win32' || winPlat == 'Win64' || winPlat == 'MacIntel' || winPlat == 'Linux i686' || winPlat == 'Linux x86_64'),	
	isIOS = (winPlat == 'iPad' || winPlat == 'iPod' || winPlat == 'iPhone'),
	isAndroid = window.navigator.userAgent.indexOf('Android');

/**
 * 日志输出
 * @param {Object} str	string|object
 * @param {Object} obj	object
 */
function log(str,obj){
	str = obj ? str+'	'+JSON.stringify(obj) : typeof str == 'object' ? JSON.stringify(str) : str;
	uexLog.sendLog(str);
}

/**
 * 
 * @param {Object} name	窗口名称
 * @param {Object} url	请求地址
 * @param {Object} anim	动画效果	[0:None,5:淡入淡出]	推入[1:LeftToRight,2:RightToLeft,3:UpToDown,4:DownToUp]	切入[9:LeftToRight,10:RightToLeft,11:UpToDown,12:DownToUp]
 * @param {Object} flag	功能参数	[0:普通;1:OAuth;2:加密;4:强制刷新;8:wind中url调用系统浏览器;64:popOver预加载;128:手势缩放]
 */
function winOpen(name,url,anim,flag){
    anim = anim ? anim : 2,flag = flag ? flag : 4;
    uexWindow.open(name, '0', url, anim, '', '', flag, '0');	//animDuration默认为250ms
}

/**
 * 跨窗口执行脚本
 * @param {Object} main		主窗口名称
 * @param {Object} pop		浮动窗口名称
 * @param {Object} funstr	脚本方法
 */
function winEval(main,pop,funstr){
	pop ? uexWindow.evaluatePopoverScript(main,pop,funstr) : uexWindow.evaluateScript(main,'0',funstr);
}

/**
 * 关闭窗口
 * @param {Object} n 关闭参数
 */
function winClose(n){
	n==='' ? uexWindow.close(n) : uexWindow.close(-1);
}

/**
 * 系统alert提示框
 * @param {Object} str
 * @param {Object} cb
 */
function sysAlert(str,cb){
	if(cb){
		uexWindow.cbConfirm = function(opId,dataType,data){
			if(data == 0)	cb(); 
		}
		uexWindow.confirm('提示',str,['确定'])
	}else
		uexWindow.alert('提示',str,'确定');
}

function toast(type,str,times){
	if(!str)
		type='1',str='数据加载中...',times='';
	uexWindow.toast(type,'5',str,times);
}

function closeToast(){
	uexWindow.closeToast();
}

function getJSONError(err){
	var msg = '';
	switch(err.message) {
		case 'network error!':		msg = '请检查网络状态';	break;
		case 'json parse failed!':	msg = '数据解析错误';	break;
		case 'file does not exist!':	msg = '文件不存在';	break;
		case 'read file failed!':	msg = '文件读取错误';	break;
		default: 			msg = '发现未知错误';	break;
	}
	uexWindow.toast('0','5',msg,'3000');
}


/**
 * 非空验证
 * @param {Object} para
 */
function isDefine(para){
	return (para == undefined || para == null || para == '') ? false : true;
}

/**
 * localStorage 基本操作
 */
var lcstor = window.localStorage;
function setLS(key,value,isObj){
	return lcstor[key] = (isObj ? JSON.stringify(value) : value);
}

function getLS(key,isObj){
	return (isObj ? JSON.parse(lcstor[key]) : lcstor[key]);
}

function clearLS(key){
	return (key ? lcstor.removeItem(key) : lcstor.clear());
}

/**
 * Get请求参数转JSON	
 * @param {Object} str	eg:userId=801&age=21&sex=1
 */
function setParam(str){
	setLS('skipParams',str);	//userId=801&age=21&sex=1
}

function getParam(){
	var params={keys:[]},skipParams=getLS('skipParams');
	if(!skipParams) return params;
    for (var i = 0,pieces = skipParams.split('&'); i < pieces.length; i++) {
        var keyVal = pieces[i].split('=');
        params.keys[i] = keyVal[0];
        params[keyVal[0]] = decodeURIComponent(keyVal[1]);
    }
    return params;
}

function clearParam(){
	clearLS('skipParams');
}

/**
 * 获取dom节点
 * @param {Object} id
 */
function $$(id){
	return document.getElementById(id);
}
/**
 * 为相应节点赋值
 * @param {Object} id
 * @param {Object} html
 */
function setHtml(id, html) {
	if ("string" == typeof(id)) {
		var ele = $$(id);
		if (ele != null) {
			ele.innerHTML = html == null ? "" : html;
		}
	} else if (id != null) {
		id.innerHTML = html == null ? "" : html;
	}
}

/**
 * 弹动效果
 * @param {Object} funcTop	顶部弹动
 * @param {Object} funcBtm	底部弹动
 */
function initBounce(funcTop, funcBtm){
	if(!isPhone)	return;
	uexWindow.setBounce("1");
	var top = 0,btm = 1;
	if(!funcTop && !funcBtm){
		uexWindow.showBounceView(top,"rgba(255,255,255,0)","0");
		uexWindow.showBounceView(btm,"rgba(255,255,255,0)","0");
		return;
	}
	uexWindow.onBounceStateChange = function(type,state){	
		if(type==top && state==2)		funcTop();
		if(type==btm && state==2)		funcBtm();
	}
	if(funcTop){
		uexWindow.setBounceParams('0',"{'pullToReloadText':'下拉刷新','releaseToReloadText':'释放刷新','loadingText':'正在刷新,请稍候'}");
		uexWindow.showBounceView(top,"rgba(255,255,255,0)",1);
		uexWindow.notifyBounceEvent(top,1);	
	}
	if(funcBtm){
		uexWindow.setBounceParams('1',"{'pullToReloadText':'加载更多','releaseToReloadText':'加载更多','loadingText':'加载中,请稍候'}");
		uexWindow.showBounceView(btm,"rgba(255,255,255,0)",1);//设置弹动位置及效果([1:显示内容;0:不显示])
		uexWindow.notifyBounceEvent(btm,1);		//注册接收弹动事件([0:不接收onBounceStateChange方法回调;1:接收])
	}
}

/**
 * 验证接口，获取应用的AuthorizeID
 * @param {Object} func		回调函数
 * @param {Object} refresh	强制刷新AuthorizeID
 */
function getAuthorizeID(func,refresh){
	uexDataAnalysis.cbGetAuthorizeID = function(opid, dataType, data){
		if (data) {
			if(func)	func(data);
		}else{
			uexDataAnalysis.refreshGetAuthorizeID();
		}
	};
	if(refresh)
		uexDataAnalysis.refreshGetAuthorizeID();
	else
		uexDataAnalysis.getAuthorizeID();
}

/**
 * 获取当前时间
 * @param {Object} type	类型
 */
function curDate(type){
	var d = new Date();	// yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒
		yyyy = d.getFullYear(),
		MM = d.getMonth()+1,
		dd = d.getDate(),
		HH = d.getHours()<10?('0'+d.getHours()):d.getHours(),
		mm = d.getMinutes()<10?('0'+d.getMinutes()):d.getMinutes(),
		ss = d.getSeconds()<10?('0'+d.getSeconds()):d.getSeconds();
	switch(type) {
		case 1:		d = [yyyy,MM,dd];		break;	//[yyyy,MM,dd]
		case 2:		d = yyyy+'-'+MM+'-'+dd;		break;	//yyyy-MM-dd
		case 3:		d = [HH,mm,ss];			break;	//[HH,mm,ss]
		case 4:		d = HH+':'+mm+':'+sd;		break;	//HH:mm:ss
		case 5:		d = [yyyy,MM,dd,HH,mm,ss];	break;	//[yyyy,MM,dd,HH,mm,ss]
		default: 	d = yyyy+'-'+MM+'-'+dd+' ' + HH +':' + mm +':' + ss;	break;	//yyyy-MM-dd HH:mm:ss
		return d;	
	}
}

var dbname = "localdb",dbId = 0;
/**
 * 创建或打开数据库
 * @param {Object} cb	初始化DB
 */
function openDB(cb){
	uexDataBaseMgr.cbOpenDataBase = function(opId,type,data){
		if(type==2 && data==0){
			if(cb)	cb();
		}
	}				
	uexDataBaseMgr.openDataBase(dbname,++dbId); 
}

/**
 * 查询操作
 * @param {Object} id
 * @param {Object} sql
 * @param {Object} cb
 */
function selSql(id,sql,cb){
	uexDataBaseMgr.cbSelectSql = function(opId,type,data){
		log('selSql:	'+opId+','+type+','+data);
		if(type==1){
			if(cb && opId == id)	cb(data);
			else	cb(false);
		}
	}
	uexDataBaseMgr.selectSql(dbname,id,sql);
}

/**
 * 增删改操作
 * @param {Object} id
 * @param {Object} sql
 * @param {Object} cb
 */
function exeSql(id,sql,cb){
	uexDataBaseMgr.cbExecuteSql = function(opId,type,data){
		log('exeSql:	'+opId+','+type+','+data);
		if(type==2 && data==0){
			if(cb && opId == id)	cb(data);
			else 	cb(false);
		}
	}
	uexDataBaseMgr.executeSql(dbname,id,sql);
}

/**
 * DB数据初始化
 */
function initDB(){
	if(!getLS('initDB')){
		exeSql(++dbId,'drop table task');
		exeSql(++dbId,'drop table gps');
		var sqlArr =["CREATE TABLE gps(times INTEGER PRIMARY KEY,longitude TEXT,latitude TEXT,userId TEXT,carNo TEXT);",
				"CREATE TABLE task(id TEXT PRIMARY KEY,destination TEXT,imgName TEXT,jzxNo TEXT,qfNo TEXT,userId TEXT,carNo TEXT);",
				"INSERT INTO task(id,destination,imgName,jzxNo,qfNo,userId,carNo) values('002','天津','imageName2','120002','5002','500','K-43053');",
				"INSERT INTO task(id,destination,imgName,jzxNo,qfNo,userId,carNo) values('003','青岛','imageName3','120003','5003','500','K-43053');"];
		for (i in sqlArr) {
			exeSql(++dbId, sqlArr[i]);
		}
		setLS('initDB',true);
	}
} 

/**
 * 打开百度地图
 * @param {Object} id 	div ID
 * @param {Object} lon	经度
 * @param {Object} lat	纬度
 * @param {Object} x	div 坐标X
 * @param {Object} y	div 坐标Y
 */
function mapOpen(id,lon,lat,x,y){	//x|y:坐标位置
	var s=window.getComputedStyle($$(id),null);
	x = x ? x : 0;
	y = y ? y : int($$("header").offsetHeight);
	w = int(s.width),h = int(s.height);				//	w|h:宽高
	var BaiduKey = '5E584AA41FACBE7C4162B56188FAEBA07E6C92F1';		//百度APIKey
	uexBaiduMap.open(BaiduKey,x,y,w,h,lon,lat);
}

/**
 * 百度地图添加标注
 * @param {Object} id		mark标注Id，唯一
 * @param {Object} lon		经度
 * @param {Object} lat		纬度
 * @param {Object} image	标注图片
 * @param {Object} msg		点击提示信息
 */
function mapAddMark(id,lon,lat,image,msg){
	msg = msg ? msg : '';
	var str = {"markInfo":[{
				"id":id,
				"longitude":lon,
				"latitude":lat,
				"imageUrl":image,
				"imageWidth":"50",
				"imageHeight":"50",
				"message":''}]};
	uexBaiduMap.addMark(JSON.stringify(str));
	uexBaiduMap.showBubbleView2(id,msg,'');
}
/**
 * 百度地图区域搜索
 * @param {Object} cb			搜索结果处理
 * @param {Object} keyword		关键字
 * @param {Object} lon			经度
 * @param {Object} lat			纬度
 * @param {Object} radius		搜索半径(默认500)
 * @param {Object} pageIndex	分页页码(默认0)
 */
function mapSearchArea(cb,keyword,lon,lat,radius,pageIndex){
	radius = radius ? radius : '500';
	pageIndex = pageIndex ? pageIndex : '0';
	uexBaiduMap.cbPoiSearchArea = function (opId,dataType,data){
		if(dataType == 1)	cb(data);
		else	cb(false);
	}
	uexBaiduMap.poiSearchNearBy(keyword,lon,lat,radius,pageIndex);
}

/**
 * 开百度地图并定位到当前位置
 * @param {Object} conId	地图div Id
 */
function localPos(conId){
	uexLocation.onChange = function(inLat,inLog){
		uexLocation.closeLocation();
		var currLat = inLat,currLon = inLog,locName;
		mapOpen(conId,currLon,currLat);
		uexLocation.cbGetAddress = function(opId,dataType,data){
			uexWindow.closeToast();
			locName = data;
			mapAddMark(1,currLon,currLat,'../css/img/address.png',data);
			uexBaiduMap.onTouchMark = function(mid, lon, lat){
				if(mid == 1)
					uexBaiduMap.showBubbleView2(1,locName,'');
			}
		}
		uexLocation.getAddress(currLat,currLon);
	}
	uexWindow.toast('1','5','定位中...','');
	uexLocation.openLocation();
}
