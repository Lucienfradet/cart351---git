//Prep and send userData to the server to be posted to the database

async function sendUserData() { //async funtion to wait for the response
  let date = new Date().getTime();
  let form = $('#myForm')[0];

  let data = new FormData(form);
  data.append('date', date.toString());
  data.append('title', $('#name-input').val());
  data.append('geoLoc', marker._lngLat.lat + ' ' + marker._lngLat.lng);
  data.append('description', $('#recette-text').val());
  data.append('file', fileToUpload);

  for (let pair of data.entries()) {
    console.log(pair[0]+ ', ' + pair[1]);
  }

  try {
    result = await $.ajax({ 
      url: 'post.php',
      type: 'POST',
      enctype: 'multipart/form-data',
      processData: false, // important
      contentType: false, // important
      data: data,

      success: function (response) {
        //response is a STRING (not a JavaScript object -> so we need to convert)
        console.log("we had success!");
        console.log(response);
      },
      error: function() {
        console.error("error occured in ajax get token");
      }
    });
  }
  catch (error) {
    console.error(error);
  }
}
