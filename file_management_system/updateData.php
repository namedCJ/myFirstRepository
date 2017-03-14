<?php
	
$DB_NAME="cj_personal_db";
$SEVER_NAME="localhost";
$MY_SQL_USERNAME='root';
$MY_SQL_PASSWORD='root';
	/*$userTabName=$_POST['fileTabName'];*/
	$userTabName='userstoredfiles';
	//链接数据库
	$con = mysql_connect($SEVER_NAME,$MY_SQL_USERNAME,$MY_SQL_PASSWORD);
	mysql_select_db($DB_NAME, $con);
	mysql_query("SET NAMES 'utf8'"); 
	//删除记录
	if($_POST['SQLtype']=='delete'){
		$deleteData=json_decode($_POST['deleteData']);
		if($_POST['type']=='1'){
			unlink(mb_convert_encoding(urldecode($deleteData[0]->fileLink),"gbk", "utf-8"));
		}
		$a=json_encode($deleteData[0]->id);
		if (!$con){
		  die('Could not connect: ' . mysql_error());
		}
		mysql_query('DELETE FROM '.$userTabName.' WHERE id='.$a);
		mysql_close($con);	
		$deleteData=null;
		echo $a;
	}
	//新建文件夹的记录
	if($_POST['SQLtype']=='newFolder'){
		$newFolderRecord=json_decode($_POST['newFolderRecord']);
		$id=$newFolderRecord->id;
		$folderName=$newFolderRecord->UFile_name;
		$pid=$newFolderRecord->UF_parentid;
		$type=$newFolderRecord->File_type;
		mysql_query("INSERT INTO ".$userTabName." (fileTabId,id, UFile_name, UF_parentid,File_type)"
		."VALUES ('1481021984','".$id."', '".$folderName."', '".$pid."','".$type."')");
		mysql_close($con);
		$newFolderRecord=null;
		echo json_encode($id);
	}
	//修改记录
	if($_POST['SQLtype']=='rename'){
		$newName=$_POST['newName'];
		$fileId=$_POST['id'];
		mysql_select_db($DB_NAME, $con);
		mysql_query("SET NAMES 'utf8'"); 
		mysql_query("UPDATE ".$userTabName." SET UFile_name ='".$newName."' WHERE id =".$fileId);
		mysql_close($con);
		echo json_encode($newName);
		$newName=null;
		$fileId=null;
	}

?>