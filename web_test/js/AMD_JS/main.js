　　require.config({
		shim:{
			'jquery-2.1.0':{
				exports:'$'
			}
		}
　　});
require(['jquery-2.1.0','utils'],function ($,utils){
　　　　$('#cli').text('fdfd');
		console.log(utils.publicProp)
		utils.publicFun();
});