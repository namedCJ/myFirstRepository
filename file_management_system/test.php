<?php

$userTabName='userstoredfiles';
$con = mysql_connect("localhost","root","root");
mysql_select_db("cj_personal_db", $con);
mysql_query("SET NAMES 'utf8'"); 
$res = mysql_query('select * from `userstoredfiles`');
	$resArr = array();
		while( $row = mysql_fetch_object($res) ) {
		    $resArr[] = $row;
		}
if($resArr){
	for($i=0;$i<count($resArr);$i++){
		echo $resArr[$i]->id;
	}

}else{
echo'no';
}
?>