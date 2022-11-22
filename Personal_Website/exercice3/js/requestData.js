//request all data from a timeStamp and timeStamp - range
async function requestData() {
  $("#map-loader").show();

  try {
    const response = await $.get(
      "request.php", (data) => {
        console.log("get success");
        
        $("#map-loader").hide();
      }
    ); //await the response
    
    //array with the required data
    console.log(response);
    randoData = JSON.parse(response);
    console.log(JSON.parse(response));
    return; //GET OUT
  }
  catch (error) {
    console.error(error);
  }
}
