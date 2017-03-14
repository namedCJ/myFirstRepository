
$(function(){
	
	
/*	var data=[
	{"id":0,"UFile_name":"根目录","UF_parentid":-1,"File_type":0},
	{"id":1,"UFile_name":"我的文件夹","UF_parentid":0,"File_type":0},
	{"id":2,"UFile_name":"A文本","UF_parentid":0,"File_type":1},
	{"id":3,"UFile_name":"新建文件夹","UF_parentid":1,"File_type":0},
	{"id":4,"UFile_name":"B文本","UF_parentid":3,"File_type":1},
	{"id":5,"UFile_name":"C文本","UF_parentid":1,"File_type":1},
	{"id":6,"UFile_name":"文件夹1","UF_parentid":0,"File_type":0},
	{"id":7,"UFile_name":"文件夹2","UF_parentid":6,"File_type":0},
	{"id":8,"UFile_name":"D文本","UF_parentid":6,"File_type":1},
	{"id":9,"UFile_name":"E文本","UF_parentid":7,"File_type":1},
	{"id":10,"UFile_name":"文件夹3","UF_parentid":3,"File_type":0},
	{"id":11,"UFile_name":"F文本","UF_parentid":10,"File_type":1}
	];*/
	
		
	
	var data;
	$.ajaxSetup({ 
	  async: false 
	  }); 
	  $.post('sever.php',{},function(_data){
			data=JSON.parse(_data)	
		});
	  
/*	$.ajax({ 
	    type : "post", 
	    url :'sever.php', 
	    data :null, 
	    async : false, 
	    success : function(_data){ 
	        data=JSON.parse(_data)
	     } 
	}); */		
	//将按钮的事件委托给最大的容器:#container	
	$("#container").on("click",'.folder',aClick);
	$("#container").on("click",'.li',breadFun);
	$("#container").off("click",'.li:last',breadFun);
	$("#container").on("click",'#back',backBtn);
	$("#container").on("click",'.rename',rename);
	$("#container").on("click",'.delate',extra);		
	$("#container").on("click",'.download',downloadFile);
	$("#container").on("click",'.file',downloadFile);
	$('.alert-warning').on('click','.jump',breadFun);
	$('.alert-warning').on('click','.jump',function(){
		$(".alert-warning").hide("slow");
		$('.modal-header .close').click();
	});
	
	$('#upload').on('click',function(){
		console.log('curPId:'+ curPId);
		/*alert('测试阶段才不让你上传呢')*/
	});
	$('.alert-success,.alert-warning,.alert-danger').on('click',function(){
		$(this).hide("slow")
	});
	$("#modal-confirm").on("click",newFolder);
	$("#delate-modal-confirm").on("click",delate);
	$("#back").on("click",backBtn);
	//设置用来判定该函数是第一次载入还是被点击触发
	var isClick=0;
	//创建history数组来保存html结构，以便返回按钮的函数调用
	var history=[];
	//初始化用来更新列表中html结构的变量
	var mainContentHtmlStr='';
	//初始化当前页面的父ID值
	var curPId=0;
	//curFileInfor[]用来存放符合条件的文件信息
	var curFileInfor=[],
		breadInfor=[];
	function aClick(){
		
		if($(this).attr('data-id')==8){
        	var psw= prompt('请输入密码');
        	if(psw!=521){
				return;
        	}
        }
		
		history.push($("#container").html());
		//先清空列表里的内容
		/*$("#bread").html("");*/
		$("#main-content").html("");
		//判定这次函数的执行是点击触发的还是网页加载时触发的
		if(isClick==1){
				curPId=this.dataset.id;
		}
		
		//遍历后台传来的json数据并将符合条件的信息保存在curFileInfor数组中
		for(var i=data.length-1;i>=0;i--){
			if(data[i].UF_parentid==curPId)
			{curFileInfor.push(data[i]);}
		}
		//更新面包屑中的内容
		if(isClick==1){
			$("#bread").append('<li class="li" data-id='+this.dataset.id+' data-name='+this.dataset.name+' >'+this.dataset.name+'</li>');
		}
		else{
			$("#bread").append('<li class="li" data-id=0 data-name="根目录" >根目录</li>');
		}
		/*$("#bread").html(breadHtmlStr);*/
		$(".li").removeClass("active")
		$(".li:last").addClass("active");
		//更新列表中的内容
		//将文件夹渲染到网页中
		addFolder();
		//渲染文件到网页中
		addFile();
		//清空mainContentHtmlStr、curFileInfor[]
		mainContentHtmlStr="";
		curFileInfor=[];
 
		//如果curPId=0，则隐藏返回按钮
		if(curPId==0){
			document.getElementById("back").style.display="none";
		}
		else{
			document.getElementById("back").style.display="inline-block";
		}
		//将isClick设为1，使得接下来该函数被按钮触发
		isClick=1;
	};
	console.time('载入改页面用了');
	aClick();
	console.timeEnd('载入改页面用了');
	/*var curpid=Number($(".li:last").attr('data-id'));
	console.log(curpid);*/
	
	//设置上传文件插件的初始化函数
	var max=0;
	for(var i=0;i<data.length;i++){
		max=max>Number(data[i].id)?max:Number(data[i].id);
	}
	$("#upload-file").fileinput({
		/*'uploadUrl':'',
		'showUpload':false,
		'previewFileType':'any',*/
		allowedPreviewTypes:null,
		language: 'zh', //设置语言
	    uploadUrl: "receiveFiles.php", //上传的地址
	    uploadAsync:true,//设置上传同步异步 
	    multiple:true,
	    allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀,
	    maxFileCount: 5,//允许同时上传的最大文件个数
	    enctype: 'multipart/form-data',
	    showUpload: false, //是否显示上传按钮
	    initialCaption: "请上传文件",//初始化文本框中的文字
	    showCaption: true,//是否显示标题
	    showRemove:true,//是否显示移除按钮
	    showCancel:true,//是否显示文件上传取消按钮,只在异步模式下显示和生效
	   // showUploadedThumbs:true,//是否持续显示上传文件的缩略图预览窗口(用于ajax上传),直到删除的按钮被按下。默认为 true。当设置为 false下一批的文件选择上传将清除这些缩略图预览。
	    showBrowse:true,//是否显示文件浏览按钮
	    browseClass: "btn btn-primary", //按钮样式  
	    browseOnZoneClick:true,//点击拖拽区可以打开文件选择框
	    //dropZoneEnabled: false,//是否显示拖拽区域
		//minImageWidth: 50, //图片的最小宽度
		//minImageHeight: 50,//图片的最小高度
		//maxImageWidth: 1000,//图片的最大宽度
		//maxImageHeight: 1000,//图片的最大高度
		maxFileSize: 200000,//单位为kb，如果为0表示不限制文件大小
		//minFileCount: 0,//允许同时上传的最小文件个数
	    //previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
	    //msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
	    uploadExtraData:{type:1},
		slugCallback : function(filename) {
	    	return filename.replace('(', '_').replace(']', '_');
	    }	
	});
	$("#upload-file").on('filepreupload',function(event, data, previewId, index){
		
        data.extra.pid=curPId;
    	console.log('File pre upload triggered');
	});
	$("#upload-file").on("fileuploaded", function (event, data_) {
	    	//异步上传后返回结果处理
	        //后台一定要返回json对象,空的也行。否则会出现提示警告。
	        //返回对象的同时会显示进度条，可以根据返回值进行一些功能扩展
	        console.log(data_)
	        if(data_.response.text=='exist'){
	        	$('.alert-warning').show(function(){
	    			$('.file-upload-indicator[title="上传"]').prev().children('.kv-file-remove').click();
	    			for(var i=0;i<data.length;i++){
	    				if(data[i].id==data_.response.pid){
	    					$('.alert-warning').html('<span class="label label-info">'+data_.response.fileName+'</span> 已存在于 <a href="javascript:void(0)" class="jump btn btn-info" data-id='+data[i].id+' data-name='+data[i].UFile_name+' >'+data[i].UFile_name + '<span class="badge pull-right">click</span></a>'  +' 目录下啦！')
	    				}
	    			}
		 			
		 			setTimeout('$(".alert-warning").hide("slow")',5000);
		 		});
		 		return;
	        }
	        $.ajax({ 
			    type : "post", 
			    url :'updatePid.php', 
			    data :{id:data_.response.id,pid:data_.extra.pid}, 
			    async : false, 
			    success : function(_data){ 
			    	_data=JSON.parse(_data);
			    	$('.file-upload-indicator[title="上传"]').prev().children('.kv-file-remove').click();
			        console.log('add a new file:↓\n');
			        console.log(_data);
			        //data数组中增加一个对象
			        var newObject  =
					 	{
					 		"id":_data.id,
					     	"UFile_name" :_data.UFile_name,
					    	"UF_parentid" :_data.UF_parentid,
					    	"File_type" :1,
					    	"fileLink":_data.fileLink,
					    	"fileSize":_data.fileSize
					 	}
					 data.push(newObject);
			        //表象上添加一个文件
			        $("#main-content").append(
			 			'<div class="file-row row-file">'+
							'<span class="glyphicon glyphicon-file" ></span><a class="link file" data-name='+newObject.UFile_name+' data-id='+newObject.id+'  data-link='+newObject.fileLink+'>'+newObject.UFile_name+'</a>'+
							' <ul id="rowBtn"><li data-toggle="modal" data-target="#modalWin2" class="delate btn btn-primary" >删除</li><li data-toggle="modal" data-target="#modalWinRename"  class="rename btn btn-primary" >重命名</li></ul>'+
						'<hr/></div>'
			 		);
			     },
			     error:function(){
			     	$('.alert-danger').show(function(){
			 			$('.alert-danger').text('上传文件夹失败,请检查网络')
			 			setTimeout('$(".alert-danger").hide("slow")',2000);
			 		});
			     }
			});
	    });

	//渲染文件夹的函数
	function addFolder(){
		
		for(var i=0;i<curFileInfor.length;i++){
			if(curFileInfor[i].File_type==0){
				
				mainContentHtmlStr+=
					'<div class="file-row row-folder">'+
						'<span class="glyphicon glyphicon-folder-open" ></span>'+'<a class="link folder" data-name='+curFileInfor[i].UFile_name
						+' data-id='+curFileInfor[i].id+'>'+curFileInfor[i].UFile_name+'</a>'+
						'<ul id="rowBtn"><li data-toggle="modal" data-target="#modalWin2" class="delate btn btn-primary" >删除</li><li data-toggle="modal" data-target="#modalWinRename"  class="rename btn btn-primary" >重命名</li></ul>'+
						'<hr/></div>';
				for(var k=0;k<data.length;k++){
					if(data[k].id==curFileInfor[i].UF_parentid){
						document.getElementById("back").dataset.id=data[k].UF_parentid;
					}			
				}
			}			
			$("#main-content").html(mainContentHtmlStr);
		
		}
	}
	//渲染文件的函数
	function addFile(){
		for(var i=0;i<curFileInfor.length;i++){
			if(curFileInfor[i].File_type==1){
				mainContentHtmlStr+=
					'<div class="file-row row-file">'+
						'<span class="glyphicon glyphicon-file" ></span><a class="link file" data-name='+curFileInfor[i].UFile_name+' data-id='+curFileInfor[i].id+'>'+curFileInfor[i].UFile_name+'</a> '+
						' <ul id="rowBtn"><li class="download btn btn-primary" >下载</li><li data-toggle="modal" data-target="#modalWin2" class="delate btn btn-primary" >删除</li><li data-toggle="modal" data-target="#modalWinRename" class="rename btn btn-primary" >重命名</li></ul> '+
						' <hr/></div>'
				for(var k=0;k<data.length;k++){
					if(data[k].id==curFileInfor[i].UF_parentid){
						document.getElementById("back").dataset.id=data[k].UF_parentid;
					}			
				}	
			}
			$("#main-content").html(mainContentHtmlStr);
		}
	}			


	//返回按钮的函数
	function backBtn(){	
		//将histor数组中的最后一个元素（该元素保存了上一次的html结构）
		$("#container").html(history[history.length-1]);
		//删除history数组中的最后一个元素
		history.pop();
	}
	//更新面包屑的函数
	function breadFun(){
		history.push($("#container").html());	
		/*var lastBreadId=$(".li:last").data("id");*/
		$("#bread").html("");
		var tempId=this.dataset.id;
		curPId=this.dataset.id;		
		function updateBread(){
			for(var i=0;i<data.length;i++){
				if(data[i].id==tempId){
					$("#bread").prepend(
						'<li class="li" data-id='+data[i].id+' data-name='+data[i].UFile_name+' >'+data[i].UFile_name+'</li>'
					);
				tempId=data[i].UF_parentid
				}			
			}	
			$(".li").removeClass("active")
			$(".li:last").addClass("active");
		}
		for(var i=0;i<data.length;i++){
			updateBread();
		}
		
			
		
		for(var i=data.length-1;i>=0;i--){
			if(data[i].UF_parentid==curPId)
			{curFileInfor.push(data[i]);}
		}
		
		//更新列表中的内容
		//将文件夹渲染到网页中
		addFolder();
		//渲染文件到网页中
		addFile();
		//清空mainContentHtmlStr、curFileInfor[]
		mainContentHtmlStr="";
		curFileInfor=[];
		//如果curPId=0，则隐藏返回按钮
		if(curPId==0){
			document.getElementById("back").style.display="none";
		}
		else{
			document.getElementById("back").style.display="inline-block";
		}
		
	}

	//新建文件夹的函数
	var newFolderName;
	function newFolder(){
		$("#modalWin1").css("display","none");
		$(".modal-backdrop").css("display","none");
		//获得curFileInfor数组
		for(var i=data.length-1;i>=0;i--){
			if(data[i].UF_parentid==curPId)
			{curFileInfor.push(data[i]);}
		}
		newFolderName=$("#give-name").val()
		function for_(){
			for(var i=0;i<curFileInfor.length;i++){
				if(curFileInfor[i].File_type==0&&curFileInfor[i].UFile_name==newFolderName){
					newFolderName='new&nbsp;&nbsp;'+newFolderName;
				}
			}
		}
		for(var i=0;i<curFileInfor.length;i++){
			for_();
		}
		curFileInfor=[];
		var max=0;
		for(var i=0;i<data.length;i++){
			max=max>Number(data[i].id)?max:Number(data[i].id);
		}
		var newObject  =
	 	{
	 		"id":max+1,
	     	"UFile_name" :newFolderName,
	    	"UF_parentid" :curPId,
	    	"File_type" :0
	 	}
	 	
	 	//将更新后的json数据上传至后台，如果失败，则将刚刚添加的数据删除回去
	 		//数据传往后台失败的话就弹出“新建文件夹失败”并且退出newfolder()函数
 		var newObjectStr=JSON.stringify(newObject);
 		$.ajax({
 			type:"post",
 			url:"updateData.php",
 			data:{SQLtype:'newFolder',newFolderRecord:newObjectStr},
 			dataType:"json",
 			success:function(_data){
 				//将新建的对象添加进data这个全局数组里
 				data.push(newObject);
 				//表象上添加文件夹
 				$("#main-content").prepend(
		 			'<div class="file-row row-folder">'+
						'<span class="glyphicon glyphicon-folder-open" ></span><a class="link folder" data-name='+newObject.UFile_name+' data-id='+newObject.id+'>'+newObject.UFile_name+'</a>'+
						' <ul id="rowBtn"><li data-toggle="modal" data-target="#modalWin2" class="delate btn btn-primary" >删除</li><li data-toggle="modal" data-target="#modalWinRename"  class="rename btn btn-primary" >重命名</li></ul>'+
					'<hr/></div>'
		 		);
		 		$('.alert-success').show(function(){
		 			$('.alert-success').text('新建文件夹成功！')
		 			setTimeout('$(".alert-success").hide("slow")',2000);
		 		});
 				console.log('add a record:{type:file  data-id:'+JSON.parse(_data)+'}');
 			},
 			error:function(){
 				$('.alert-danger').show(function(){
		 			$('.alert-danger').text('新建文件夹失败,请检查网络')
		 			setTimeout('$(".alert-danger").hide("slow")',2000);
		 		});
 			}
 		});
	}
	//删除文件夹的函数
	function delate(){
		var deleteArr=[];
		$("#modalWin2").css("display","none");
		$(".modal-backdrop").css("display","none");
		//将json中符合条件的对象删除
		var dataId=this.dataset.id;
		console.log(this)
		//更新json中的数据	
		for(var i=0;i<data.length;i++){
			if(data[i].id==dataId){
				deleteData=data.splice(i,1);
			}
			//如果删除的是文件夹，删除该文件夹下的数据
/*			if(data[i].UF_parentid==dataId){
				deleteArr.push(data.splice(i,1));
			}
			console.log(deleteArr)*/
		}			
		//用ajax将更改后的json数据上传到后台，如果成功，则继续执行下面的步骤，如果失败，则停止函数
		deleteData=JSON.stringify(deleteData);
		$.ajax({
            type: "POST",
            url: "updateData.php",
            data: {deleteData:deleteData,type:JSON.parse(deleteData)[0].File_type,SQLtype:'delete'},
            /*contentType: "application/json; charset=utf-8",*/
            dataType: "json",
            success: function (_data) {
 				//表象上删除html		
				$(".link[data-id="+dataId+"]").parent().detach();           	
                //添加删除成功的提醒框
                $('.alert-success').show(function(){
                	$('.alert-success').text('删除成功！')
		 			setTimeout('$(".alert-success").hide("slow")',2000);
                });
				data_=JSON.parse(_data)
				console.log('delete a record:data-id='+data_)
            },
            error: function (msg) {
                $('.alert-danger').show(function(){
		 			$('.alert-danger').text('删除失败,请检查网络')
		 			setTimeout('$(".alert-danger").hide("slow")',2000);
		 		});
                data.push(JSON.parse(deleteData)[0])
            }
      });		

		//清空删除模态框中“确定”按钮上的data-id属性
		$("#delate-modal-confirm").attr("data-id","");
	}
	function extra(){
		$("#delate-modal-confirm").attr("data-id",$(this).parent().prev().attr("data-id"));
		$("#delate-modal-confirm").attr("data-name",$(this).parent().prev().attr("data-name"));
		if($(this).parent().parent().hasClass("row-folder")){
			$("#delate-modal-confirm").attr("data-type","文件夹")
			$(".modal-body").find("p").html("您确定要删除"+'  ”'+$("#delate-modal-confirm").attr("data-name")+'”  '+$("#delate-modal-confirm").attr("data-type")+"吗？</br></br><b>该文件夹下的所有文件也将被删除!</b>")
		}
		else{
			$("#delate-modal-confirm").attr("data-type","文件")
			$(".modal-body").find("p").text("您确定要删除"+'  ”'+$("#delate-modal-confirm").attr("data-name")+'”  '+"该"+$("#delate-modal-confirm").attr("data-type")+"吗？")
		}
	}
	//重命名的函数
	function rename(){
		$('#modalWinRename #rename').val($(this).parent().prev().attr("data-name"))
		var oldName=$(this).parent().prev().attr("data-name");
		var $that=$(this).parent().prev();
		var thatId=$(this).parent().prev().attr("data-id");
		$('#modalWinRename #modal-confirm-renname').one('click',function(){
			$("#modalWinRename").css("display","none");
			$(".modal-backdrop").css("display","none");
			if(oldName===$('#modalWinRename #rename').val()){
				$('.alert-warning').show(function(){
	                	$('.alert-warning').text('名字重复！')
			 			setTimeout('$(".alert-warning").hide("slow")',2000);
	                });
	            $('#modalWinRename #modal-confirm-renname').off('click',rename2);
	            return false;
			}
			$.ajax({
	            type: "POST",
	            url: "updateData.php",
	            data: {SQLtype:'rename',id:thatId,newName:$('#modalWinRename #rename').val()},
	           /* dataType: "json",*/
	            success: function (_data) {
	            	$('#modalWinRename #modal-confirm-renname').off('click',rename2);
	 				//表象上重命名	
	 				$that.text($('#modalWinRename #rename').val());
	 				$that.attr('data-name',$('#modalWinRename #rename').val())
	 				for(var i=0;i<data.length;i++){
	 					if(data[i].id==thatId){
	 						data[i].UFile_name=$('#modalWinRename #rename').val();
	 					}
	 				}
	 				console.log(thatId);
	                //添加重命名成功的提醒框
	                $('.alert-success').show(function(){
	                	$('.alert-success').text('重命名成功！')
			 			setTimeout('$(".alert-success").hide("slow")',2000);
	                });
					data_=JSON.parse(_data)
					console.log('update a record:{new name:"'+data_+'"}')
	            },
	            error: function (msg) {
	            	$('#modalWinRename #modal-confirm-renname').off('click',rename2);
	                $('.alert-danger').show(function(){
			 			$('.alert-danger').text('重命名失败,请检查网络')
			 			setTimeout('$(".alert-danger").hide("slow")',2000);
			 		});
	            }
	   		});	
		});
		
	}
	function rename2(){
			
	}
	

});





//下载文件的函数
function downloadFile(){
	$('.alert-warning').show(function(){
    	$('.alert-warning').text('测试阶段才不让你下载呢')
		setTimeout('$(".alert-warning").hide("slow")',2000);
    });
}

