<?php
ob_start();
header("Last-Modified: ".gmdate("D, d M Y H:i:s", getlastmod())." GMT"); 
$offset = 5;
$expire = "Expires: " . gmdate("D, d M Y H:i:s", time() + $offset) . " GMT";
$cache = "Cache-Control: max-age=5";
header($expire);
header($cache);
$stats = stat('./cache.php');
$etag = sprintf('"%x-%x-%x"', $stats['ino'], $stats['size'], $stats['mtime']); // lowercase hexadecimal numbers separated by dashes
header('ETag: '.$etag);
?>
<html>
<head/>
<body onload="parent.test(<?php
echo time();
?>
);">
</body>
</html>
<?php
header('Content-Length: ' . ob_get_length());
ob_end_flush();
?>
