//旋转函数，默认旋转角度为1度,半径为50
let rotate = (ctx,angle=1*(Math.PI/180),r=50) =>{
	//ctx.save()
	ctx.clearRect(-canvas.width/2,-canvas.height/4,canvas.width,canvas.height*(1/2))
	ctx.rotate(angle)//旋转角度
	renderBigCircle(ctx,obj)//画图
	//ctx.restore()
}
//旋转动画函数，默认的速度为100ms，每次旋转角度为1s，顺时针旋转
let animateRotate = (speed=100,angle=1*(Math.PI/180),r=50,direction='clockwise') =>{
	angle=direction=='clockwise'?angle:-angle
	setInterval( () =>rotate(ctx,angle,r),speed)
}