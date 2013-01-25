<?php
ob_start();
$cache = "Cache-Control: no-cache";
header($cache);
$stats = stat('./cache.php');
$etag = sprintf('"%x-%x-%x"', $stats['ino'], $stats['size'], $stats['mtime']); // lowercase hexadecimal numbers separated by dashes
header('Etag: '.$etag);
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
