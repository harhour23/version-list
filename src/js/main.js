

var gliderFeatures;
var isGliderAlreadyLoaded;



window.addEventListener("DOMContentLoaded", () => {
  console.log("Loaded Scripts");

  let input = document.querySelector("#sidebar-search-input");
  let box = document.querySelector("#sidebar-search-overlay");

  input.addEventListener("focus", function(e){
      console.log(e.target.value)

      box.classList.replace("invisible", 'visible');
      box.classList.replace("opacity-0", 'opacity-100');
      
      box.classList.add("ease-out", 'duration-300');

      // le input
      input.classList.replace("rounded-lg", 'rounded-t-lg');

  });

  input.addEventListener("focusout", function(e){
    console.log(e.target.value)


    box.classList.replace("opacity-100", 'opacity-0');
    box.classList.replace("visible", 'invisible');

    // le input

    input.classList.replace("rounded-t-lg", 'rounded-lg');
    //box.classList.add("ease-out duration-300");
  });

  // header

  let headerRegionInput = document.querySelector("#header-region-input");
  let headerRegionBox = document.querySelector("#header-region-overlay");
  let headerRegionFull = document.querySelector(".header-region");

  headerRegionInput.addEventListener("click", function(e){
      // console.log(e.target.value)


      headerRegionInput.classList.add("active");
      headerRegionInput.classList.add("z-20");

      headerRegionBox.classList.replace("invisible", 'visible');
      headerRegionBox.classList.replace("opacity-0", 'opacity-100');
      headerRegionBox.classList.add("ease-out", 'duration-300');

  });

  headerRegionInput.addEventListener("blur", function(e){
    // console.log(e.target.value)


    headerRegionBox.classList.replace("opacity-100", 'opacity-0');
    headerRegionBox.classList.replace("visible", 'invisible');
    //headerRegionBox.classList.add("ease-out duration-300");
  });

  // Secteurs
  let headerSecteurInput = document.querySelector("#header-secteur-input");
  let headerSecteurBox = document.querySelector("#header-secteur-overlay");
  let headerSecteurFull = document.querySelector(".header-secteur");

  headerSecteurInput.addEventListener("click", function(e){
      // console.log(e.target.value)

      headerSecteurInput.classList.add("active");

      headerSecteurBox.classList.replace("invisible", 'visible');
      headerSecteurBox.classList.replace("opacity-0", 'opacity-100');
      headerSecteurBox.classList.add("ease-out", 'duration-300');

  });


   // I'm using "click" but it works with any event
   document.addEventListener('click', event => {
    const isClickInside = headerSecteurFull.contains(event.target)

    const isActive = headerSecteurBox.classList.contains("opacity-100");

    if(isActive){

      console.log("header box is visible (opacity 100)");

      if (!isClickInside) {
        // The click was OUTSIDE the specifiedElement, do something

         console.log("click not inside");
        headerSecteurInput.classList.remove("active");
        
        headerSecteurBox.classList.replace("opacity-100", 'opacity-0');
        headerSecteurBox.classList.replace("visible", 'invisible');
      }
    }
  })

  document.addEventListener('click', event => {
    const isClickInside = headerRegionFull.contains(event.target)

    const isActive = headerRegionBox.classList.contains("opacity-100");

    if(isActive){

      console.log("header box is visible (opacity 100)");

      if (!isClickInside) {
        // The click was OUTSIDE the specifiedElement, do something

         console.log("click not inside");
         headerRegionInput.classList.remove("active");
         headerRegionInput.classList.remove("z-20");
         headerRegionBox.classList.replace("opacity-100", 'opacity-0');
         headerRegionBox.classList.replace("visible", 'invisible');
      }
    }
  })



  // Les checkbox all villes
  let toggleCities = document.querySelector("#toggle-cities-checkbox");

  toggleCities.addEventListener("click", function(e){

    checkboxes = document.getElementsByName('ville');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = toggleCities.checked;
    }

  });

  let toggleRegions = document.querySelector("#toggle-regions-checkbox");

  toggleRegions.addEventListener("click", function(e){

    checkboxes = document.getElementsByName('region');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = toggleRegions.checked;
    }

  });


  let funct = (function (a, b, c) {
    console.log( a + 100);
  });

  // console.log("Glider always init 430");


  // funct(2);

  var screenWidth = window.innerWidth;

  console.log("ScreenWidth:", screenWidth);

  if(screenWidth <= 768){

    console.log("Init glider");
    initGlider();

  }

  function initGlider(){
    gliderFeatures = new Glider(document.querySelector('.js-glider-features'), {
      slidesToScroll: 1,
      slidesToShow: 2.5,
      draggable: true,
      // dots: '.dots',
      // arrows: {
      //   prev: '.glider-prev',
      //   next: '.glider-next'
      // }
    });


    document.addEventListener('glider-loaded', function(){
        // console.log("GLIDER LOADED!!");
        isGliderAlreadyLoaded = true;

    });

  }

  // On first load
  // homeGliderFeaturesInit();

  // and on resize
  window.addEventListener('resize', function(event){

    var screenWidth = window.innerWidth;

    console.log("Screenwidth on resize:", screenWidth);

    if(screenWidth <= 768){

      console.log("Screenwidth plus petit que 768");

      // console.log("Glider features", gliderFeatures);

      if(!isGliderAlreadyLoaded){
        initGlider();
      }
     

      // if(gliderFeatures.loaded){
      //   console.log("Glider loaded!");
      // } else {
      //   console.log("Glider not loaded");


      // }
    } else {
      // check to destroy glider

      console.log("Almost destroy called");
      if(isGliderAlreadyLoaded){
        gliderFeatures.destroy();

        console.log("destroy called");

        isGliderAlreadyLoaded = false;
      }
    }

    // do stuff here
     console.log("Reize called");
    // homeGliderFeaturesInit();
  });




  function homeGliderFeaturesInit(){
    console.log("homeGliderFeaturesInit called ");
  }






  // window.addEventListener("orientationchange", function() {
  //     // Generate a resize event if the device doesn't do it
  //     window.dispatchEvent(new Event("resize"));
  // }, false);


  // screen.orientation.addEventListener("change", (event) => {
  //   const type = event.target.type;
  //   const angle = event.target.angle;
  //   console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
  // });



  // btn-mobile-menu

  let btnMobileNavigation = document.querySelector(".btn-mobile-navigation");
  let overlayMobileNavigation = document.querySelector(".mobile-navigation");

  
  let body = document.querySelector("body");
  let html = document.querySelector("html");

  btnMobileNavigation.addEventListener("click", function(e){
    console.log(e.target.value)

    const isActive = overlayMobileNavigation.classList.contains("opacity-100");

    if(isActive){

      overlayMobileNavigation.classList.replace("visible", 'invisible');
      overlayMobileNavigation.classList.replace("opacity-100", 'opacity-0');
      
      overlayMobileNavigation.classList.remove("ease-out", 'duration-300');

      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");

    } else {

      overlayMobileNavigation.classList.replace("invisible", 'visible');
      overlayMobileNavigation.classList.replace("opacity-0", 'opacity-100');
      
      overlayMobileNavigation.classList.add("ease-out", 'duration-300');  

      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");

    }


    // 

    var li = document.querySelectorAll('.mobile-navigation > ul > li');
    li.forEach(function(element, index) {
        // current DOM element
        // console.log("ELEMENT: ", element);

        console.log(index);

        
        let link = element.querySelector("a");
        let submenu = element.querySelector("ul");

        // console.log("Link:, ", link);

      
        if(submenu){
          console.log("submenu");
          link.addEventListener('click', function(){
            // console.log("YOP");
          
  
            if(element.classList.contains("active")){
              element.classList.remove("active");
              submenu.classList.add("hidden");
              submenu.classList.replace("visible", 'invisible');
              submenu.classList.replace("opacity-100", 'opacity-0');
             
  
            } else {
              element.classList.add("active");
              submenu.classList.remove("hidden");
              submenu.classList.replace("invisible", 'visible');
              submenu.classList.replace("opacity-0", 'opacity-100');
  
  
            }
          });
        } else {
          console.log("no submenu");
        }
        
         

      

        // close all others ?
    });

    // le input
   // input.classList.replace("rounded-lg", 'rounded-t-lg');

});


});
