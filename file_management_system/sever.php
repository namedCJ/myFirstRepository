<?php

$DB_NAME="cj_personal_db";
$SEVER_NAME="localhost";
$MY_SQL_USERNAME='root';
$MY_SQL_PASSWORD='root';
function connectDB($severName,$mySQLUsername,$mySQLPsw){
	$con = mysql_connect($severName,$mySQLUsername,$mySQLPsw);
	if (!$con){
		echo('Could not connect: ' . mysql_error());
		return false;
	}
}
function openDB($DBName){
	//If database isn't exists,Create database
	if(!mysql_select_db($DBName)){
		mysql_query("CREATE DATABASE ".$DBName,$con);
	}	
	mysql_select_db($DBName);
}
/*	// Create table in my_db database
	mysql_select_db($DBName, $con);
	$sql="CREATE TABLE userInfo
	(
	userID int NOT NULL AUTO_INCREMENT, 
	PRIMARY KEY(userID),
	fileTabName varchar(30),
	accountNum varchar(30),
	passWord varchar(30)
	)";
	mysql_query($sql,$con);*/
header("Content-Type:text/html;   charset=utf8"); 
connectDB($SEVER_NAME,$MY_SQL_USERNAME,$MY_SQL_PASSWORD);
openDB($DB_NAME);
/*$now=$_SERVER["REQUEST_TIME"] ;
mysql_query("INSERT INTO userInfo (accountNum, passWord,fileTabId) 
VALUES ('5404314028', 'cj953861612','{$now}')");
*/
mysql_query("SET NAMES 'utf8'"); 
$sqlString = "select * from userstoredfiles";
$res = mysql_query($sqlString);
$resArr = array();
// $res 为mysql_query()从数据库中取的数据
while( $row = mysql_fetch_object($res) ) {
    $resArr[] = $row;
}
mysql_free_result($res);
$resultJson= json_encode($resArr);
echo $resultJson
?>