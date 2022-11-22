<?php
    require('openDB.php');
    function debug_to_console($data) {
      $output = $data;
      if (is_array($output)) {
      $output = implode(',', $output);
      }
      echo "<script>console.log(`Debug Objects: " . $output . "`);</script>";
    }

    //secure post fetch to provide the map token... I think lol
    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        // need to process
        if ($_POST["type"] == "getToken") {
            $mapBox = new stdClass();
            $mapBox->token = 'pk.eyJ1IjoibHVjaWVuZnJhZGV0IiwiYSI6ImNsMmM4cXh2bDA0eDUzaW9mNmR6YWpuaHMifQ.K2ygmN3MjODPxC9LX5Asow';
            
            $response = json_encode($mapBox);
            echo $response;
            exit;
            echo "done";
        }
    }//POST

    if (isset($_GET)) {
        try {
            //query everything
            $sql_select = 'SELECT * FROM randoCollection';
            
            //$result is asigned the specific query
            $result = $file_db->query($sql_select);
            if (!$result) die("Cannot execute query.");

            while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $json[] = $row;
            }
            echo json_encode($json);
        }
        catch(PDOException $e) {
            // Print PDOException message
            echo $e->getMessage();
        }
    }
    $file_db = null;
?>