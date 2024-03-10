window.addEventListener("DOMContentLoaded", () => {

  console.log("Listing-content.js")

  let mainContentText =  document.querySelector("#main-content-text-content");
  let mainContentTextButton = document.querySelector("#main-content-text-btn");

  mainContentTextButton.addEventListener("click", function(e){

    e.preventDefault();
    

    if(mainContentTextButton.classList.contains("active")){

      mainContentTextButton.classList.remove("active");

      mainContentText.classList.remove("ease-in", 'duration-300');
      
      mainContentText.classList.replace("opacity-100", 'opacity-0');
      mainContentText.classList.replace("h-auto", 'h-0');
      mainContentText.classList.replace("visible", 'invisible');
      
    } else {

      mainContentTextButton.classList.add("active");

      mainContentText.classList.add("ease-in", 'duration-300');

      mainContentText.classList.replace("opacity-0", 'opacity-100');
      mainContentText.classList.replace("h-0", 'h-auto');
      mainContentText.classList.replace("invisible", 'visible');
    }
    

  });

});