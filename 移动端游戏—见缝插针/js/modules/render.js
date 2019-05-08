//渲染旋转的圆
let renderBigCircle = (ctx,obj) =>{
	let R=obj.circle.radius,
		r=obj.needles[0].needleCircle.radius
	ctx.beginPath()
	//画中间的大圆
	ctx.lineWidth=obj.circle.borderWidth
	ctx.arc(obj.circle.center[0],obj.circle.center[1],R,0,2*Math.PI)
	ctx.stroke()
	ctx.beginPath()
	//画针头
	ctx.moveTo(0,R)
	ctx.lineWidth=obj.needles[0].line.width
	ctx.lineTo(0,R+obj.needles[0].line.length)
	ctx.stroke()
	ctx.beginPath()
	//画针尾的圆
	ctx.lineWidth=obj.needles[0].needleCircle.borderWidth
	ctx.arc(obj.needles[0].needleCircle.center[0],obj.needles[0].needleCircle.center[1],r,0,2*Math.PI);
	ctx.stroke()
}
//渲染针
let renderNeedles= (ctx,needlesObj) =>{
	//建立临时数组用来保存渲染完成后底部各个圆的信息
	let tempArr=[]
	needlesObj.forEach((val,index)=>{
		//逆序输出
		anti_index=needlesObj.length-index
		//画圆
		let r=val.needleCircle.radius
		ctx.beginPath()
		ctx.arc(-5,(0.5)*canvas.height-5+35*index,r,0,2*Math.PI)
		ctx.fillStyle='red'
		ctx.fill()
		ctx.stroke()
		//在圆中写数字
		ctx.font="14px Arial";
		if(anti_index>=10){
			ctx.strokeText(anti_index,-r-2,(0.5)*canvas.height+35*index)
			val.needleCircle.center[1]=((0.5)*canvas.height+35*index)
		}else{
			ctx.strokeText(anti_index,-r+1.5,(0.5)*canvas.height+35*index)
			val.needleCircle.center[1]=((0.5)*canvas.height+35*index)
		}
		tempArr.push(val)
	})
	console.log(tempArr)
	//以数组的形式返回底部圆的信息
	return tempArr
}
//获得n个针的实例对象
let getObjsOfNeedle= (num) =>{
	let needlesArr=[]
	for(let i=0;i<num;i++){
		needlesArr.push(new needleConstr())
	}
	return needlesArr
}

