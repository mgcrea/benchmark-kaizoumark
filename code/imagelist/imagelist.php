<?php
// 
//  imagelist.php
//  Author: David Corvoysier
//

  if(empty($_GET['tag'])){
    $tag = 'kaizou';
  }else{
    $tag = $_GET['tag'];
  }
  if(empty($_GET['size'])){
    $size = 10;
  }else{
    $size = $_GET['size'];
  }

  $target = "http://commons.wikimedia.org/w/api.php?action=query&list=allimages&aiprop=url|comment&format=json&aiminsize=100000&aimaxsize=1000000&ailimit=" . $size . "&aifrom=" . $tag;    
  // Open the Curl session
  $session = curl_init($target);

  // Tmp hack
  //curl_setopt ($session, CURLOPT_PROXY, "10.193.118.30:3128");
  //curl_setopt ($session, CURLOPT_PROXYTYPE, 'CURLPROXY_HTTP'); 

  // Don't return HTTP headers. 
  curl_setopt($session, CURLOPT_HEADER, false);
  // Do return the contents of the call
  curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
  // Follow redirections
  curl_setopt($session, CURLOPT_FOLLOWLOCATION, true);
  
  // Manually set headers
  $accept_language = substr($_SERVER["HTTP_ACCEPT_LANGUAGE"],0,2);
  if($accept_language != ""){
    $headers = array("Accept-language:" . $accept_language,
                     "User-agent:".$_SERVER["HTTP_USER_AGENT"]);
  }else{
    $headers = array("User-agent:".$_SERVER["HTTP_USER_AGENT"]);
  }
  curl_setopt($session, CURLOPT_HTTPHEADER, $headers);
          
  // Make the call
  $html = curl_exec($session);

  echo $html;  
  
  curl_close($session);

?>
