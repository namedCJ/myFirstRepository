<?php
$DB_NAME="cj_personal_db";
$SEVER_NAME="localhost";
$MY_SQL_USERNAME='root';
$MY_SQL_PASSWORD='root';	
	$id=(int)$_POST['id'];
/*	$fileName=json_decode($_POST['fileName']);*/
	$pid=(int)$_POST['pid'];
	$userTabName='userstoredfiles';
	$con = mysql_connect($SEVER_NAME,$MY_SQL_USERNAME,$MY_SQL_PASSWORD);
	mysql_select_db($DB_NAME, $con);
	mysql_query("SET NAMES 'utf8'");
	mysql_query("UPDATE ".$userTabName." SET UF_parentid ='".$pid."' WHERE id =".$id);
	$result = mysql_query("select * from userstoredfiles where id= ".$id);
	$rowRow = mysql_fetch_object($result);
	echo json_encode($rowRow);	
	/*$res = mysql_query('select * from userstoredfiles');
	$resArr = array();
		while( $row = mysql_fetch_object($res) ) {
		    $resArr[] = $row;
		}
	$r=true;
	for($i=count($resArr)-1;$i=0;$i--){
		//下面这个判断语句有问题啊！！！弄好这个就万事大吉了！！
		//就是如果同属一个pid的文件夹他们的的名字也相同的话就删掉后面一个记录
		if($resArr[$i]->UF_parentid==$pid || $resArr[$i]->UFile_name==json_encode($fileName)){
			//delate一条记录
			mysql_query('DELETE FROM '.$userTabName.' WHERE id='.$id);
			$r=false;
			//退出循环
			break;
		}
	}
	if($r==false){
		echo json_encode('exist');
	}else{
		$result = mysql_query("select * from userstoredfiles where id= ".$id);
		$rowRow = mysql_fetch_object($result);
		echo json_encode($rowRow);	
	}*/
	
		
	
	
?>