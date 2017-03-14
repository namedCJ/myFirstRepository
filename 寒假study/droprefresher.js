/*
 * 自己做的jQuery插件，
 * 可以在外部更改插件默认参数设置
*/

(function($){
	$.fn.dropRefresher=function(options){
		$.fn.dropRefresher.defaults={
			//default options here
			//width:'200px',
			//height:'200px'
		};
		var opts=$.extend({},$.fn.dropRefresher.defaults,options);
		var a,b;
		$(this).wrap("<div id='container' ></div>").before("<div id='showRefreshStatus' style='border:solid 2px red;height:0px'></div>")
		
	}
	
})(jQuery)
