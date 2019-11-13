<?php
//die();
if (isset($_POST['cells'])) {
    $cells = $_POST['cells'];

    $fp = fopen('cells.json', 'w');
    fwrite($fp, $cells);
    fclose($fp);
} else {
    die('Error');
}
