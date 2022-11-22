<?php
  require('openDB.php');

  function debug_to_console($data) {
    $output = $data;
    if (is_array($output)) {
    $output = implode(',', $output);
    }
    echo "<script>console.log(`Debug Objects: " . $output . "`);</script>";
  }

  try {
    $theQuery = "CREATE TABLE IF NOT EXISTS randoCollection (
        pieceID INTEGER PRIMARY KEY NOT NULL,
        timeStamp TEXT,
        title TEXT,
        geoLoc TEXT,
        description TEXT,
        image TEXT
      )";
  
    $file_db ->exec($theQuery);
  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }

  //insert test
  /**
  $insertStatement =  "INSERT INTO randoCollection (
    timeStamp,
    geoLoc,
    title,
    description,
    image
  ) VALUES (
      '0',
      '45.50010142692955 -73.60675223772284',
      'Le Coeur Du Frère André',
      'La monté est pas trop rough.',
      'assets/images/coeurDuFrer.jpg'
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
  */
  $file_db = null;
?>