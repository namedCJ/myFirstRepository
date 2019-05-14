// 获得当前的顺序
let getCurSeq = function ( x , unit = 54){ //unit为单位
    return Math.round( x / unit)
}

// 深拷贝数组
let deepCopy = function ( obj ){
    let objDeepCopy
    [ ...objDeepCopy ] = obj
    return objDeepCopy
}

//冒泡交换数组中的子元素
let exchangeArrSub = function ( arr , index1 , index2 ){
    [arr[index1],arr[index2]] = [arr[index2],arr[index1]]
    return arr
}

//在视图层对div进行交换,排序时的render
let sortingRender = function ( el , direction , distance = 54 ){ //direction的取值为-1,0,1，distance为偏移量
    // let a = s.match(/-?[0-9]{1,}[.][0-9]*/g)
    //获取el元素的translateY值
    let transformInfo = getComputedStyle(el,false)['transform']
    let translateY = Number(transformInfo.split('(')[1].split(')')[0].split(',')[5])
    if(translateY != 0){//如果translateY不等于0的话，就让transform属性Y值为0
        el.style.transform = `translate3d(0px,0px,0px)`
    }
    else{
        let offsetY = (-1) * direction * distance//offsetY方向与direction相反
        el.style.transform = `translate3d(0px,${offsetY}px,0px)`
    }
    //根据direction计算offsetY值
    // let offsetY = (-1) * direction * distance//offsetY方向与direction相反

    // let s = translateY + offsetY
    
    // el.style.transform = `translate3d(0px,${s}px,0px)` //可加动效
    
}

let sortedRender = function ( parentEle ,eleObjsArr ){
    //将目标元素的子元素清除
    parentEle.innerHTML=''
    for (let i = 0; i < eleObjsArr.length; i++) {
        //将子元素的translateY还原
        eleObjsArr[i].style.transform = 'translate3d(0px,0px,0px)'
        //将索引值放到标签的data-index属性里去
        eleObjsArr[i].dataset.index = i
        eleObjsArr[i].querySelectorAll('.sort-seq')[0].innerText = i+1
        //将子元素添加到目标元素里去
        parentEle.appendChild(eleObjsArr[i])
    }
}

//节流函数
function throttle(method,delay = 100 ,duration = 100){
    let timer=null;
    let begin=new Date();    
    return function(){                
        var context = this, args = arguments;
        var current = new Date();        
        clearTimeout(timer);
        if(current - begin>=duration){
            method.apply(context,args);
            begin=current;
        }else{
            timer = setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
}

//比较2数组是否相等
function compareArr(arr1 , arr2){
    for (let i = 0; i < arr1.length; i++) {
        if(arr1[i] != arr2[i] ){
            return false
        }
    }
    return true
}

//函数防抖
function debounce(func, wait = 500) {
    let timeout;  // 定时器变量
    
        clearTimeout(timeout);  // 每次触发时先清除上一次的定时器,然后重新计时
        timeout = setTimeout(func, wait);  // 指定 xx ms 后触发真正想进行的操作 handler
    ;
}

function initRenderSortRow(parentEle ,textArr = ['选项A','选项B','选项C','选项D','选项E','选项F']){
    parentEle = parentEle || document.querySelectorAll(el)[0]
    for(let i=0; i < textArr.length; i++){
        let div = document.createElement('div')
        div.className = 'sort-row'
        // div.id = i+1
        div.innerHTML = `<div class="cell">
                            <div class="cell-label"><span class="sort-seq">${i+1}</span></div>
                            <div class="cell-text">${textArr[i]}</div>
                            <div class="cell-foot"><img></img></div>
                        </div>`
        parentEle.appendChild(div)
    }
}

export{ getCurSeq , deepCopy , exchangeArrSub , sortingRender , sortedRender , throttle , initRenderSortRow, debounce, compareArr }