<?php
    require('openDB.php');
    function debug_to_console($data) {
        $output = $data;
        if (is_array($output)) {
        $output = implode(',', $output);
        }
        echo "<script>console.log(`Debug Objects: " . $output . "`);</script>";
    }

    if($_SERVER['REQUEST_METHOD'] == 'POST') {

        $date = $_POST['date'];
        $geoLoc = $_POST['geoLoc'];
        $title = $_POST['title'];
        $description = $_POST['description'];
        
        if($_FILES) {
            $fname = $_FILES['filename']['name'];
            move_uploaded_file($_FILES['filename']['tmp_name'], "assets/images/".$fname);
            
        }//FILES

        //insert in DB
        $insertStatement =  "INSERT INTO randoCollection (
            timeStamp,
            geoLoc,
            title,
            description,
            image
        ) VALUES (
            '".$date."',
            '".$geoLoc."',
            '".$title."',
            '".$description."',
            'assets/images/".$fname."'
            )";
        try
        {
        $file_db->exec($insertStatement);
        // Close file db connection
        $file_db = null;
        }
        catch(PDOException $e) {
        // Print PDOException message
        echo $e->getMessage();
        }
        exit;
        echo "done";
    }//POST
?>