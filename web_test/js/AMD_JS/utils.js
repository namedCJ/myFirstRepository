define(function (){
	//public property
	var publicProp='This is public property';
	//public methods
	function publicFun (){
　　　　　　console.log('This is public function')
　　　　};
	//private property
	var privateProp='This is private property';
	//private methods
	var privateFun = function (){
　　　　　　console.log('This is private function')
　　　　};
	return {
		publicProp:publicProp,
		publicFun: publicFun
	};
　　});