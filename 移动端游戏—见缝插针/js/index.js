
canvas=document.getElementById("mainCanvas")
let ctx=canvas.getContext('2d')
ctx.translate(canvas.width/2,canvas.height/4)//将绘图原点移到画布中点
let obj=new objDrawn()//建立旋转动画实例
console.log(obj)
let needles=new needleConstr(5,80,'black')
ctx.save()
animateRotate(10,3*(Math.PI/180))//让动画以10ms的周期旋转起来
let bottomCircleInfo=renderNeedles(ctx,getObjsOfNeedle(12))//渲染底部的n根针,并将返回的信息存入变量中
canvas.addEventListener('touchstart',() =>{
	shoot()
})
let shoot= (obj,speed=10) =>setInterval(() =>move(obj),speed)
ctx.restore()
let move= (obj) =>{
	r=obj.needleCircle.radius
	ctx.restore()
	ctx.clearRect(-r,obj.needleCircle.center[1]-r,2*r,2*r)
	ctx.beginPath()
	ctx.arc(-r/2,obj.needleCircle.center[1]-r/2,r,0,2*Math.PI)
	obj.needleCircle.center[1]-=1
	console.log(-r/2)
	ctx.fillStyle='red'
	ctx.fill()
	ctx.stroke()

}
//shoot(bottomCircleInfo[0])