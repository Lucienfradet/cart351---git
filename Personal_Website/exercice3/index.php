<?php
  require('openDB.php');

  //used for debugging
  function debug_to_console($data) {
    $output = $data;
    if (is_array($output)) {
    $output = implode(',', $output);
    }
    echo "<script>console.log(`Debug Objects: " . $output . "`);</script>";
  }

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no>

    <title>Partage une Rando</title>

    <!-- CSS stylesheet(s) -->
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link href='css/mapbox-gl.css' rel="stylesheet" />
    <link rel="stylesheet" href="css/jquery-ui.min.css">

    <!-- Library script(s) -->
    <script src="js/libraries/p5.min.js"></script>
    <script src="js/libraries/jquery-3.6.0.min.js"></script>
    <script src="js/libraries/jquery-ui.min.js"></script>
    <script src="js/libraries/mapbox-gl.js"></script>

  </head>

  <body>
    <div class="image-container">
      <p class="image-holder">
      <img id="map-loader" src="assets/images/mapLoader.gif" />
      </p>
    </div>

    <div class="add-button-container">
      <button type="button" onclick="addRecipeStart();" id="add-button" key= "add-button">
        Ajouter une Randonnée?
      </button>
    </div>

    <div class="info-wrapper" id="intro-popup">
      <div class="info-container">
        <h1 key= "intro-title">
          Qu'est ce que cette bouillabaisse?
        </h1>
        <p key="intro-text">
          Sur cette carte, chaque point représente une randonnée partagé par un utilisateur.<br><br>
          Ajoute la tienne!
        </p>
        <button type="button" onclick="$('#intro-popup').hide();" id="close-intro-button" key= "close-intro-button">
          Ok c'est bon!
        </button>
      </div>
    </div>

    <div class="info-wrapper" id="geoloc-popup">
      <div class="info-container">
        <h1 key= "geoloc-title">
          Une application pour cartographier et partager ses randonnées préférées!
        </h1>
        <p key="geoloc-text">
          Assure toi d'avoir double-cliqué (ou 'toucher et tenir' sur mobile) sur la carte à l'endroit approximatif où se trouve ta randonnée préféré avant de continuer<br>
        </p>

        <button type="button" onclick="geolocNext();" id="geoloc-next-button" key= "geoloc-next-button">
          Allright!
        </button>

        <div class="arrow-left" id="back-button">
          <svg onclick="geolocBack()" version="1.1" id="arrow-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          	 viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
          <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
          	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
          	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
          	C255,161.018,253.42,157.202,250.606,154.389z"/>
          </svg>
        </div>

      </div>
    </div>

    <div class="info-wrapper" id="title-popup">
      <div class="info-container">
        <h1 key= "title-title">
          Le titre
        </h1>
        <p key="titre-text">
          Le nom de la montagne? Le nom de la trail? ou celui que tu lui donne dans ton p'ti coeur! :)<br>
          y'a rien de trop beau!
        </p>
        <input type="text" id="name-input" name="name-input" placeholder="Titre..">

        <button type="button" onclick="titleNext();" id="title-next-button" key= "title-next-button">
          Suivant!
        </button>


        <div class="arrow-left" id="back-button">
          <svg onclick="titleBack()" version="1.1" id="arrow-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
          <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
            c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
            C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
            C255,161.018,253.42,157.202,250.606,154.389z"/>
          </svg>
        </div>

      </div>
    </div>

    <div class="info-wrapper" id="description-popup">
      <div class="info-container">

        <form id="myForm">
        <p><label>Publie une photo:</label> <input type ="file" id="fileUpload" name = 'filename' size=10 onchange="return fileValidation()"/></p>
        </form>

        <button type="button" onclick="descriptionNext();" id="description-next-button" key= "description-next-button">
          Suivant!
        </button>


        <div class="arrow-left" id="back-button">
          <svg onclick="descriptionBack()" version="1.1" id="arrow-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
          <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
            c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
            C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
            C255,161.018,253.42,157.202,250.606,154.389z"/>
          </svg>
        </div>

      </div>
    </div>

    <div class="info-wrapper" id="recipe-popup">
      <div class="info-container">
        <h1 key= "recipe-title">
        Ajoute un commentaire ou une description!
        <br>(C'est Optionel là!)
        </h1>
        <textarea id="recette-text" name="recette-text" rows="4" cols="50" placeholder="recette.." maxlength="1000"></textarea>

        <button type="button" id="recipe-next-button" key= "recipe-next-button">
          C'est bon, on publie!
        </button>


        <div class="arrow-left" id="back-button">
          <svg onclick="recipeBack();" version="1.1" id="arrow-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
          <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
            c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
            C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
            C255,161.018,253.42,157.202,250.606,154.389z"/>
          </svg>
        </div>

      </div>
    </div>

    <div id="map"></div>
  </body>


  <!-- My script(s) -->
  <script src="js/script.js"></script>
  <script src="js/sendUserData.js"></script>
  <script src="js/requestData.js"></script>
  <script src="js/map.js"></script>
  <script src="js/UI.js"></script>
  

</html>