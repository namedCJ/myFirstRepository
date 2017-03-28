//require('./util/.util.js')
console.time('页面载入花了');//计时
//ES5的类构造方法
//构建一个构造函数，为存储每个圆形按钮信息的对象提供原型
function circle (ele){
	if(ele.style.width!=ele.style.height){
		ele.style.height=ele.style.width;
	}
	this.radius=ele.clientWidth/2;
	this.posX=ele.offsetLeft+this.radius;
	this.posY=ele.offsetTop+this.radius;
	//初始化连接变量，值为“false”,表示“未连接”
	this.isLinked=false;
	//初始化可被连接变量，值为“true”，表示“可被连接”
	this.linkable=true;
	/*this.getPosX=function(){
		return this._posX;
	};
	this.setPosX=function(newPosX){
		return this._posX=newPosX;
	}*/
}
//一些圆形按钮及连线的设置参数
var options={
	lineWidth:2,
	lineColor:'red',
	lineSuccessColor:'green',
	circleActiveBGColor:'#FFA500',
};
//初始化全局变量SUCCESSED_TRY_COUNT为0，用,以计算设置密码成功的次数
var SUCCESSED_TRY_COUNT=0;
//初始化全局变量STATUS为“设置密码”，用以保存网页状态
var STATUS='SET_PASSWORD';
//设置全局变量PASSWORD用来保存密码
var PASSWORD;
//初始化全局变量PASSWORD_ARR用来保存密码数组
var PASSWORD_ARR=[];
//设置2个全局变量，分别用来保存目前触点碰及的圆形横坐标与纵坐标
var CUR_POINT_X,CUR_POINT_Y;
//初始化保存各个圆形按钮信息的全局变量，它是一个对象数组；
var CIRCLE_INFO=[];
//将每个圆形按钮的信息存在CICLE_INFO中，手机浏览器不支持forEach
var GRID_ARR=document.querySelectorAll('.grid');
for(var i=0;i<GRID_ARR.length;i++){
	CIRCLE_INFO.push(new circle(GRID_ARR[i]))
}
console.info(CIRCLE_INFO)
var wrapper=document.getElementById('wrapper');
wrapper.addEventListener('touchmove',function(e){
	var distanceInfo=[];
	for(var i=0;i<CIRCLE_INFO.length;i++){
		distanceInfo.push(getDistance(CIRCLE_INFO[i].posX,CIRCLE_INFO[i].posY,e.changedTouches[0].clientX,e.changedTouches[0].clientY-wrapper.offsetTop))
	}
	/*如果现在手指的坐标到最近的圆形按钮的距离小于圆形按钮半径，
	并且这个圆形按钮的linkable属性为真且isLinked属性为false的话
	就把这个圆形按钮的圆心位置保存到CUR_POINT_X,CUR_POINT_Y中*/
	if(index=getMinNum(distanceInfo).value<=CIRCLE_INFO[0].radius&&CIRCLE_INFO[getMinNum(distanceInfo).index].isLinked==false&&CIRCLE_INFO[getMinNum(distanceInfo).index].linkable==true){		
		/*虽然之前并未定义2个全局变量CUR_POINT_X、CUR_POINT_Y,
		因此touchmove在函数第一次执行的时候2个变量是undefinde,
		但是第一次执行函数的过程中将这2个变量赋值了,因此第二次调用
		函数的时候2个全局变量是有值得,然而,只要手指在屏幕移动,就会
		立马出发第二次函数,使得函数看起来运行得行云流水，
		其实第一次函数是没用的*/
		console.log('被吸附的圆心按钮的横坐标:'+CUR_POINT_X,'\n被吸附的圆形按钮的圆心横坐标:'+CUR_POINT_Y);
		var index=getMinNum(distanceInfo).index;
		//将密码添加进PASSWORD_ARR
		PASSWORD_ARR.push(parseInt(index)+1);
		drawLine(wrapper,CUR_POINT_X,CUR_POINT_Y,CIRCLE_INFO[getMinNum(distanceInfo).index].posX,CIRCLE_INFO[getMinNum(distanceInfo).index].posY)
		CUR_POINT_X=CIRCLE_INFO[index].posX;
		CUR_POINT_Y=CIRCLE_INFO[index].posY;
		CIRCLE_INFO[index].isLinked=true;
		CIRCLE_INFO[index].linkable=false;	
		GRID_ARR[index].getElementsByClassName('circle')[0].style.backgroundColor=options.circleActiveBGColor;
	}
	//绘制即时射线
	liveRendering(wrapper,CUR_POINT_X,CUR_POINT_Y);
	/*if(){
		
	}*/
	//console.log(e instanceof Object)
	//console.log(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
});
wrapper.addEventListener('touchend',function(e){
	var linkedLine=document.querySelectorAll('.line');
	var avtiveLine=document.getElementById('activeLine');
	if(avtiveLine){
		wrapper.removeChild(activeLine);
	}
	//console.log(linkedLine)
	
	if(PASSWORD_ARR.length<=4){
		//将之前的连线清除,手机浏览器不支持forEach
		clearLinkedLine(wrapper,linkedLine);
		//清除PASSWORD_ARR的缓存，且将CUR_POINT_X、CUR_POINT_Y还原回undefined
		resetCache();
		var info=document.getElementById('info');
		info.innerHTML='<h4>密码太短，至少需要5个点</h4>';
		shake(wrapper);
	}else{
		if(STATUS=='VERIFY_PASSWORD'){
			disappearLinkedLine(linkedLine,1);
			if(hex_sha1(PASSWORD_ARR.join(''))==localStorage.sha1_ps){
				document.getElementById('info').innerHTML='<h4>密码正确!</h4>';
				resetCache();
				alert('进入主界面');
				//如果解锁成功，刷新页面
				history.go(0);
			}else{
				document.getElementById('info').innerHTML='<h4>密码错误!</h4>';
				resetCache();
				shake(wrapper)
				//如果密码错误，终止此次函数
				return;
			}
			
		}
		//
		if(STATUS=='SET_PASSWORD'&&SUCCESSED_TRY_COUNT===0){
			//密码设置成功的话，SUCCESSED_TRY_COUNT设为1，准备进行第二次验证
			SUCCESSED_TRY_COUNT=1;
			//将密码改成string格式
			PASSWORD=PASSWORD_ARR.join('');	
			//加密password
			PASSWORD=hex_sha1(PASSWORD);
			var info=document.getElementById('info');
			info.innerHTML='<h4>请再次输入手势密码</h4>';
			//将连接线变为绿色停留0.5s，并且缓慢消失
			changeLinkedLine(linkedLine,options.lineSuccessColor);
			setTimeout(function(){
				disappearLinkedLine(linkedLine,1);
			},500);
			/*disappearLinkedLine函数会以过渡动画的方式降低元素的透明度，
			linkedLine参数为必需，time参数默认是0.5s*/
			//连线缓慢消失，让用户知道自己这一步的操作是对的
			//disappearLinkedLine(linkedLine,1)
			setTimeout(function(){
				clearLinkedLine(wrapper,linkedLine);
			},1000);
			//清除PASSWORD_ARR的缓存，且将CUR_POINT_X、CUR_POINT_Y还原回undefined
			resetCache();
			/*终止此次函数，防止进入这个if/else之后的其他模块
			（虽然这个if已经是最后一个,但难免日后会在后面添加新的模块）*/
			return;
		}
		if(STATUS=='SET_PASSWORD'&&SUCCESSED_TRY_COUNT===1){
			var info=document.getElementById('info');
			if(hex_sha1(PASSWORD_ARR.join(''))===PASSWORD){
				//将SUCCESSED_TRY_COUNT还原为0
				SUCCESSED_TRY_COUNT=0;
				info.innerHTML='<h4>密码设置成功,请验证密码</h4>';
				//console.log('已将密码设置为'+PASSWORD+'(哈希算法处理后的密码)');
				//将密码以sha1_ps的名字存在localStorage中
				localStorage.sha1_ps=PASSWORD;
				//将连接线变为绿色停留0.5s，并且缓慢消失
				changeLinkedLine(linkedLine,options.lineSuccessColor);
				setTimeout(function(){
					disappearLinkedLine(linkedLine,1);
				},500);
				
				setTimeout(function(){
					clearLinkedLine(wrapper,linkedLine);
				},1000);
				//清除PASSWORD_ARR的缓存，且将CUR_POINT_X、CUR_POINT_Y还原回undefined
				resetCache();
				document.getElementById('verify-password').checked='checked';
				STATUS='VERIFY_PASSWORD';
			}else{
				shake(wrapper)
				info.innerHTML='<h4>两次密码输入不一致,请重新设置</h4>';
				SUCCESSED_TRY_COUNT=0;
				PASSWORD=undefined;
				clearLinkedLine(wrapper,linkedLine);
				resetCache();
			}
			//终止此次函数，防止进入这个if/else之后的其他模块
			return;
		}
	}
});

document.getElementById('verify-password').addEventListener('click',function(){
	//检查localStorage中是否有sha1_ps，如果没有则返回设置密码界面，如果有，继续
	if(!localStorage.sha1_ps){
		document.getElementById('info').innerHTML='<h4>请先设置密码</h4>';
		shake(wrapper);
		setTimeout(function(){
			document.getElementById('set-password').checked='checked';
		},700);
	}else{
		STATUS='VERIFY_PASSWORD';
	}
	
});
document.getElementById('set-password').addEventListener('click',function(){
	STATUS='SET_PASSWORD';
});




//util，功能函数
//获得两点之间距离
function getDistance(x1,y1,x2,y2){
	
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
}
//取得一个不限长度的number型数组中所有number的最小值及其索引
function getMinNum(numArr){
	var min=numArr[0],minIndex;
	for(var i in numArr){
		if(typeof numArr[i]=="number"){
			min=min<=numArr[i]?min:numArr[i];
		}
	}
	for(var j in numArr){
		if(min===numArr[j]){
			minIndex=j;
		}
	}
	return {index:minIndex,value:min};
}
//传进保存了每个圆形按钮信息的对象数组，传出与当前触摸点距离小于半径的圆形按钮的位置信息对象数组
/*arr=CIRCLE_INFO;
wrapper=document.getElementById('wrapper');
wrapper.addEventListener('touchmove',function(e){
	var distanceInfo=[];
	for(var i=0;i<arr.length;i++){
		distanceInfo.push(getDistance(arr[i].posX,arr[i].posY,e.changedTouches[0].clientX,e.changedTouches[0].clientY-wrapper.offsetTop))
	}
	//console.log(distanceInfo)
	if(getMinNum(distanceInfo).value<=arr[0].radius){
		console.log(getMinNum(distanceInfo).index)
	}
	//console.log(getMinNum(distanceInfo)) 
})*/

//根据两点坐标求出线段的长度与斜率，继而求出角度用rotate旋转
function drawLine(ele,x1,y1,x2,y2){
	var hypotenuseDistance=getDistance(x1,y1,x2,y2);
	var horizontalOrdinate=x2-x1;
	var verticalOrdinate=y2-y1;
	var angle=Math.atan(verticalOrdinate/horizontalOrdinate)*180/Math.PI;
	//因为tan()函数在[-π，π]上并不单调，且tan()的周期为π，因此当横坐标小于0时要在角度上加一个180°
	angle=horizontalOrdinate>=0?angle:angle+180;
	
	var line=document.createElement('div');
	line.className='line'
	line.style.position='absolute';
	line.style.width=hypotenuseDistance+'px'
	line.style.height=options.lineWidth+'px';
	line.style.left=x1+'px';
	line.style.top=y1+'px';
	//将旋转基点设置为直线的左上顶点
	line.style.webkitTransformOrigin='0% 0%';
	line.style.webkitTransform='rotate('+angle+'deg)';
	line.style.backgroundColor=options.lineColor;
	ele.appendChild(line);
	//console.log(angle+'°',horizontalOrdinate,verticalOrdinate)
	return line;
}
//即时绘制解锁的射线的函数
function liveRendering(ele,fixedPointPosX,fixedPointPosY){
	/*在此函数本身中添加一个touchmove事件是为了在单独调用该函数时也能
	使函数产生效果，而不需要依托于在touchmove事件时调用该函数才
	能使该函数产生效果*/
	ele.addEventListener('touchmove',function(e){
		//console.log(e.changedTouches[0].clientX,e.changedTouches[0].clientY-150)
		
		//重第二次调用函数开始，清除上一次调用函数创建的div元素
		var line;
		if(line=document.getElementById('activeLine')){
			this.removeChild(line);
		}
		//初始化/重绘div
		drawLine(this,fixedPointPosX,fixedPointPosY,e.changedTouches[0].clientX,e.changedTouches[0].clientY-wrapper.offsetTop).id='activeLine';
	})
}
//liveRendering(wrapper,120,40)
//
function disappearLinkedLine(arr,time){
	time=time||0.5;
	for(var i=0;i<arr.length-1;i++){
		arr[i].style.webkitTransition='all '+typeof time==='number'?time:time+'s'
		arr[i].style.opacity=0;
	}
	////清除圆形按钮颜色
	for(var i=0;i<GRID_ARR.length;i++){
		GRID_ARR[i].getElementsByClassName('circle')[0].style.webkitTransition='all '+typeof time==='number'?time:time+'s'
		GRID_ARR[i].getElementsByClassName('circle')[0].style.backgroundColor='';
	}
}
//
function changeLinkedLine(arr,color){
	for(var i=0;i<arr.length-1;i++){
		arr[i].style.backgroundColor=color;
	}
}
//清除绘制的连锁线
function clearLinkedLine(ele,arr){
	//清除线条
	for(var i=0;i<arr.length-1;i++){
		ele.removeChild(arr[i]);
	}
	//清除圆形按钮颜色
	for(var i=0;i<GRID_ARR.length;i++){
		GRID_ARR[i].getElementsByClassName('circle')[0].style.backgroundColor='';
	}
	
}
//将CIRCLE_INFO还原回初始状态,清除PASSWORD_ARR的缓存，且将CUR_POINT_X、CUR_POINT_Y还原回undefined
function resetCache(){
	for(var i=0;i<CIRCLE_INFO.length;i++){
		CIRCLE_INFO[i].linkable=true;
		CIRCLE_INFO[i].isLinked=false;
	}
	PASSWORD_ARR=[];
	CUR_POINT_X=undefined;
	CUR_POINT_Y=undefined;
}
//震动动画
function shake(ele){
	ele.style.position='relative';
	
	var timer1=setInterval(function(){
		ele.style.left=ele.offsetLeft+10+'px';
	},100);
	var timer2;
	setTimeout(function(){
		timer2=setInterval(function(){
			ele.style.left=ele.offsetLeft-10+'px';
		},100);
	},50);
	//0.3秒之后清除振动
	setTimeout(function(){
		clearInterval(timer1);
		clearInterval(timer2);
		ele.style.left=0+'px';
	},300);
}
//计时
console.timeEnd('页面载入花了');

