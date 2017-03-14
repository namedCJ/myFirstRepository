<?php
	
$DB_NAME="cj_personal_db";
$SEVER_NAME='localhost';
$MY_SQL_USERNAME='root';
$MY_SQL_PASSWORD='root';	
if ((($_FILES["uploadFiles"]["type"] == "image/gif")
|| ($_FILES["uploadFiles"]["type"] == "image/jpeg")
|| ($_FILES["uploadFiles"]["type"] == "image/pjpeg")
|| ($_FILES["uploadFiles"]["type"] == "image/png")
)

&& ($_FILES["uploadFiles"]["size"] < 2000000)){
  if ($_FILES["uploadFiles"]["error"] > 0){
    echo json_encode("Return Code: " . $_FILES["uploadFiles"]["error"] . "<br />");
  }
  else{
   /* echo json_encode("Upload: " . $_FILES["uploadFiles"]["name"] . "<br />"
    ."Type: " . $_FILES["uploadFiles"]["type"] . "<br />"
    ."Size: " . ($_FILES["uploadFiles"]["size"] / 1024) . " Kb<br />"
    ."Temp uploadFiles: " . $_FILES["uploadFiles"]["tmp_name"] . "<br />"
    );
*/
	$max=0;
	$pid=0;
	$type=$_POST['type'];
	$fileName=$_FILES["uploadFiles"]["name"];
	$tempFileName=$_FILES["uploadFiles"]["tmp_name"];
	$fileLink=urlencode("storedFiles\\".$_FILES["uploadFiles"]["name"]);
	$userTabName='userstoredfiles';
	$con = mysql_connect($SEVER_NAME,$MY_SQL_USERNAME,$MY_SQL_PASSWORD);
	mysql_select_db($DB_NAME, $con);
	mysql_query("SET NAMES 'utf8'"); 
	$res = mysql_query('select * from userstoredfiles');
	$resArr = array();
		while( $row = mysql_fetch_object($res) ) {
		    $resArr[] = $row;
		}
		for($i=0;$i<count($resArr);$i++){
			$max=$max>$resArr[$i]->id?$max:$resArr[$i]->id;
			
		}
		
		if(file_exists(iconv('UTF-8','GB2312','storedFiles/'.$fileName))){
			$exist;
			for($i=0;$i<count($resArr);$i++){
				if($resArr[$i]->UFile_name==$fileName){
					$exist =array("text"=>"exist","fileName"=>$fileName,"id"=>$resArr[$i]->id,"pid"=>$resArr[$i]->UF_parentid);
				}
			}
			echo json_encode($exist);
		}
  	else{
  		mysql_query("INSERT INTO ".$userTabName." (fileTabId,id, UFile_name, UF_parentid,File_type,fileLink,fileSize)"
			."VALUES ('1481021984','".($max+1)."', '".$fileName."', '".$pid."','".$type."', '".$fileLink." ','".($_FILES["uploadFiles"]["size"] / 1024)."')");
			$result = mysql_query("select * from userstoredfiles where id= ".($max+1));
			$rowRow = mysql_fetch_object($result);
			mysql_close($con);
    	move_uploaded_file($tempFileName,"storedFiles/" .mb_convert_encoding($_FILES["uploadFiles"]["name"],"gbk", "utf-8"));
    	echo json_encode($rowRow);
  	} 
    	
    
  }
}
else{
  echo json_encode("Invalid uploadFiles");
}
?>