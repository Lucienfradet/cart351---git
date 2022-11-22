"use strict";

//Stores the recipe data (usually an array);
let randoData;
let fileToUpload;

//hide the loaders by default
$("#map-loader").hide();

//This is legit only here because I used the p5.js random() function on an arry once or twice...
//Should have create a custom function instead...
function setup() {
  noCanvas();
}

function draw() {

}

//code found here: https://www.geeksforgeeks.org/file-type-validation-while-uploading-it-using-javascript/#:~:text=Using%20JavaScript%2C%20you%20can%20easily,complete%20file%20type%20validation%20code.
function fileValidation() {
  let fileInput = document.getElementById('fileUpload');
  let filePath = fileInput.value;
  
  //beautiful regex! :)
  let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    filePath = '';
    fileToUpload = undefined;
    return false;
  }
  else {
    fileToUpload = filePath;
  }
}

//browser detect
//This is not my code but I can't find the reference... :(
function browserDetect() {
   let userAgent = navigator.userAgent;
   let browserName;

   if(userAgent.match(/chrome|chromium|crios/i)){
       browserName = "chrome";
     }else if(userAgent.match(/firefox|fxios/i)){
       browserName = "firefox";
     }  else if(userAgent.match(/safari/i)){
       browserName = "safari";
     }else if(userAgent.match(/opr\//i)){
       browserName = "opera";
     } else if(userAgent.match(/edg/i)){
       browserName = "edge";
     }else{
       browserName="No browser detection";
     }

    return browserName;
}

//https://attacomsian.com/blog/javascript-detect-mobile-device#:~:text=To%20detect%20if%20the%20user,and%20platform%20of%20the%20browser.
function deviceTypeDetect() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

console.log(deviceTypeDetect());
