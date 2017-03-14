/*
 * 自己做的jQuery插件模板，
 * 可以在外部更改插件默认参数设置
*/

(function($){
	$.fn.pluginName=function(options){
		$.fn.pluginName.defaults={
			//default options here
			width:'200px',
			height:'200px'
		};
		var opts=$.extend({},$.fn.pluginName.defaults,options);
		$(this).css({
			"width":opts.width,
			"height":opts.height
		})
	}
	
})(jQuery)
