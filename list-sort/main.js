import listInfo from './listInfo.json'// 导入listInfo.json

import "./public/stylesheets/main.scss"
const imgFinished = require('./public/images/finished.png'),
      imgMoving = require('./public/images/moving.png')

import { getCurSeq , deepCopy , exchangeArrSub , sortingRender , sortedRender, initRenderSortRow, throttle , debounce , compareArr } from './public/javascripts/utils'
import { addClass , removeClass , hasClass } from './public/javascripts/modifyClass.js';


window.onload = function(){
    //将网页高度设置为浏览器屏幕的高度
    document.getElementsByTagName('body')[0].style.height=window.screen.availHeight+'px'
    console.log("网页高度："+document.body.clientHeight)
    
    //给每个选项的末尾加上move图标
    let imgsObj = document.querySelectorAll('.cell-foot img')
    Array.prototype.forEach.call(imgsObj , each => {
        each.src=imgFinished
    });
}
//初始化渲染sortRow
let questionBody = document.querySelectorAll('.question-body')[0]
initRenderSortRow(questionBody ,listInfo.listText)
//获取sort-row行高
let sortRowHeight = document.querySelectorAll('.sort-row')[0].clientHeight
console.log(sortRowHeight)

let timer = window.performance.now()//用来计算冒泡交换一次的执行时间

let sortRowObj = document.querySelectorAll('.sort-row')
sortRowObj = Array.from(sortRowObj)//将对象转换成真正的数组
let tempCopyArr=deepCopy(sortRowObj)//深拷贝一个临时的sortRow数组，用来与原数组做对比
sortRowObj.forEach( (each,index,arr)=>{
    each.dataset.index = index//给每个元素都带上‘data-index’标记
    
    //console.log(arr,exchangeArrSub(tempCopyArr,1,2))
    let originalClientY//用来记录该元素原始的clientY坐标
    let originalTranslateY
    let curIndex

    each.addEventListener('touchstart',function(e){
        console.time('点击用时：')
        addClass(this.parentNode,'sorting')
        addClass(this,'moving')
        this.querySelectorAll('.cell-foot img')[0].src = imgMoving
        this.style.zIndex = 2
        originalClientY=e.touches[0].clientY//记录该元素原始的clientY坐标
        console.log(originalTranslateY)
        curIndex = Number(this.dataset.index)//获取该元素的data-index
    })

    each.addEventListener('touchmove',function(e){
        e.preventDefault()//防止浏览器默认事件
        
        let clientY=e.touches[0].clientY//获取鼠标当前的Y高度
        let distanceY=clientY - originalClientY//获取鼠标当前的Y高度与该元素原始高度的差值
        

       
        let virtualTop = this.offsetTop + distanceY//获取该元素的虚拟高度（模拟Top属性）
        //限制活动区域
        if(virtualTop > 0 & virtualTop < questionBody.clientHeight - sortRowHeight){
            this.style.transform = `translate3d(0px,${distanceY}px,0px)`

            //冒泡交换数组中的子元素
            //curIndex = this.dataset.index
            let curSeq = getCurSeq(virtualTop,sortRowHeight)//获取该元素当前的当前的序列值
            let direction = curSeq - curIndex//获取direction
            //console.log(tempCopyArr)
            
            if(direction != 0){
                // let timer1 = window.performance.now()
                // let timer2 = window.performance.now()
                // console.log('用时：' + (timer2 - timer1))
                //节流
                
                console.log('触发用时：',(window.performance.now()-timer))
                //if(window.performance.now()-timer > 10){
                    sortingRender(tempCopyArr[curIndex + direction],direction,sortRowHeight)//在视图层对div进行冒泡交换
                    exchangeArrSub(tempCopyArr,curIndex,curSeq)//对数组内子元素进行冒泡交换
                //}
                 
                
                console.log('curIndex：'+curIndex+'  curSeq：'+curSeq+'  目前direction：'+direction)
    
                curIndex = curSeq//将该元素当前的index设为当前序列值，并放到data-index中

                timer = window.performance.now()
            }
            
        }

        
    })

    each.addEventListener('touchend',function(e){
        removeClass(this.parentNode,'sorting')
        removeClass(this,'moving')
        this.querySelectorAll('.cell-foot img')[0].src = imgFinished
        this.style.zIndex = 1
        console.timeEnd('点击用时：')
        if(compareArr(tempCopyArr,sortRowObj)){
            addClass(this , 'ending')
            let timer = setTimeout(()=>{
                removeClass(this , 'ending')
                clearTimeout(timer)
            },200)
            //添加transition动画
            
            this.style.transform = `translate3d(0px,0px,0px)`
        }
        else{
            sortedRender(questionBody,tempCopyArr)//排完序后render
            sortRowObj = Array.from(document.querySelectorAll('.sort-row'))
        }


    })

})