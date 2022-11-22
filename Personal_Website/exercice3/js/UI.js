//Function dealing with the user interface

//--Recipe input functions--

//hide all the popup elements on startup
$("#geoloc-popup").hide();
$("#username-popup").hide();
$("#title-popup").hide();
$("#description-popup").hide();
$("#recipe-popup").hide();

//There is a Next and Back button for every popup window.
function addRecipeStart() {
  if (popup !== undefined) {
    popup.remove()
  };
  $("#geoloc-popup").show();
  $("#geoloc-done").hide();
}

function geolocNext() {
  if (marker) {
    $("#geoloc-popup").hide();
    $("#title-popup").show();
  }
  else {
    $("#geoloc-popup").effect("shake", { times:3 }, 300);
  }
}

function geolocBack() {
  $("#geoloc-popup").hide();
}

function titleNext() {
  if ($('#name-input').val() === '') {
    $('#name-input').effect("shake", { times:3 }, 300);
  }
  else {
    $("#title-popup").hide();
    $("#description-popup").show();
  }
}

function titleBack() {
  $("#title-popup").hide();
  $("#geoloc-popup").show();
}

function descriptionNext() {
  if (fileToUpload === undefined) {
    $('#fileUpload').effect("shake", { times:3 }, 300);
  }
  else {
    let myFormData = new FormData();
    myFormData.append('pictureFile', fileToUpload);
    console.log(myFormData.values());
    $("#description-popup").hide();
    $("#recipe-popup").show();
  }
}

function descriptionBack() {
  $("#description-popup").hide();
  $("#title-popup").show();
}

$("#recipe-next-button").on('click', async (e) =>{
    await sendUserData() //publish data from the user!
    marker.remove();
    resetMap();
});

//dowload and refresh the data from the database including the one from the user
async function resetMap() {
  await requestData();
  displayDataOnMap();
  $("#recipe-popup").hide();
}

function recipeBack() {
  $("#recipe-popup").hide();
  $("#description-popup").show();
}
