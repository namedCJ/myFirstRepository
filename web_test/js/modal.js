var R=5;
var num=4;
var init_x=100;
var init_y=60;
var canvas=document.getElementById("myCanvas");
var ctx=canvas.getContext('2d');
canvas.width=1024
canvas.height=768
setInterval('countDown(ctx)',1000)

function countDown(){
	ctx.clearRect(0,0,1024,768);
	var time=new Date();
	var hours=divideTime(time.getHours());
	var minutes=divideTime(time.getMinutes());
	var secounds=divideTime(time.getSeconds());
	renderNum(init_x,init_y,hours[0],R,ctx);
	renderNum(init_x+100,init_y,hours[1],R,ctx);
	renderNum(init_x+220,init_y,10,R,ctx);
	renderNum(init_x+300,init_y,minutes[0],R,ctx);
	renderNum(init_x+400,init_y,minutes[1],R,ctx);
	renderNum(init_x+520,init_y,10,R,ctx);
	renderNum(init_x+600,init_y,secounds[0],R,ctx);
	renderNum(init_x+700,init_y,secounds[1],R,ctx);
	
}

function divideTime(timeNum){
	y=parseInt(timeNum%10)
	x=(timeNum-y)/10;
	return [x,y]; 
}



function renderNum(x,y,num,R,ctx){
	
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var a=parseInt(255*Math.random()).toString(16);
				var b=parseInt(255*Math.random()).toString(16);
				var c=parseInt(255*Math.random()).toString(16);
				ctx.fillStyle="#"+a+b+c;
				ctx.beginPath();
				ctx.arc(x+j*2*(R+1)+(R+1) ,y+i*2*(R+1)+R+1 , R ,0, 2*Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}