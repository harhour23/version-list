window.addEventListener("DOMContentLoaded", () => {
  console.log("Loaded mobile Scripts");



  let mobileInput = document.querySelector("#mobile-search-input");
  let mobileBox = document.querySelector("#mobile-search-overlay");

  mobileInput.addEventListener("focus", function(e){
     // console.log(e.target.value)

      mobileBox.classList.replace("invisible", 'visible');
      mobileBox.classList.replace("opacity-0", 'opacity-100');
      
      mobileBox.classList.add("ease-out", 'duration-300');

      // le mobileInput
      mobileInput.classList.replace("rounded-lg", 'rounded-t-lg');

  });

  mobileInput.addEventListener("focusout", function(e){
    console.log(e.target.value)


    mobileBox.classList.replace("opacity-100", 'opacity-0');
    mobileBox.classList.replace("visible", 'invisible');

    // le mobileInput

    mobileInput.classList.replace("rounded-t-lg", 'rounded-lg');
    //box.classList.add("ease-out duration-300");
  });



  // toggle logics


  var toggles = document.querySelectorAll('[data-toggle-open]');

  console.log("TOggles:", toggles);
  toggles.forEach(function(element, index) {
      // current DOM element
      // console.log("ELEMENT: ", element);

      console.log("Toggle:", index);

     var toggleBox = element.getAttribute('data-toggle-open');

     var arrowIcon = element.querySelector(".js-indicator");

     console.log("arrowIcon:", arrowIcon);

     console.log("Le box: ", toggleBox);

      element.addEventListener('click', function(){
        console.log("Toggle got licked!!!");
        var toggleBoxDiv = document.querySelector('[data-toggle='+toggleBox+']');

        // if(toggleBoxDiv){
        //   toggleBoxDiv = toggleBoxDiv[0];
        // }

        console.log("Le div:", toggleBoxDiv);

        if(toggleBoxDiv.classList.contains("opacity-0")){
          arrowIcon.classList.add("rotate-90");
          toggleBoxDiv.classList.replace("opacity-0", 'opacity-100');
          toggleBoxDiv.classList.replace("h-0", 'h-auto');
          toggleBoxDiv.classList.replace("invisible", 'visible');


        } else {
          arrowIcon.classList.remove("rotate-90");
          toggleBoxDiv.classList.replace("opacity-100", 'opacity-0');
          toggleBoxDiv.classList.replace("h-auto", 'h-0');
          toggleBoxDiv.classList.replace("visible", 'invisible');
        }
      });

      
      // let link = element.querySelector("a");
      // let submenu = element.querySelector("ul");

      // console.log("Link:, ", link);

    
      // if(submenu){
      //   console.log("submenu");
      //   link.addEventListener('click', function(){
      //     // console.log("YOP");
        

      //     if(element.classList.contains("active")){
      //       element.classList.remove("active");
      //       submenu.classList.add("hidden");
      //       submenu.classList.replace("visible", 'invisible');
      //       submenu.classList.replace("opacity-100", 'opacity-0');
           

      //     } else {
      //       element.classList.add("active");
      //       submenu.classList.remove("hidden");
      //       submenu.classList.replace("invisible", 'visible');
      //       submenu.classList.replace("opacity-0", 'opacity-100');


      //     }
      //   });
      // } else {
      //   // console.log("no submenu");
      // }

      // close all others ?
  });

  
});