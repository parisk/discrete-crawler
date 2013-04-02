<?php
header('Content-type: text/html; charset=utf-8');
$page = file_get_contents('http://www.softlab.ntua.gr/~fotakis/discrete_math/');
$page = iconv('iso-8859-7', 'utf-8', $page);
echo $page;
?>
