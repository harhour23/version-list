  
// Vivre utils

  let VivreBoxAppear = (function (parent, input, overlay) {

    // console.log("Vivre");
    // console.log( a + 100);

    input.addEventListener("click", function(e){
        // console.log(e.target.value)

        input.classList.add("active");

        overlay.classList.replace("invisible", 'visible');
        overlay.classList.replace("opacity-0", 'opacity-100');
        overlay.classList.add("ease-out", 'duration-300');

    });


    // I'm using "click" but it works with any event
    document.addEventListener('click', event => {
      const isClickInside5 = parent.contains(event.target)

      const isActive = overlay.classList.contains("opacity-100");

      if(isActive){

        // console.log("sidebar box is visible (opacity 100)");

        if (!isClickInside5) {
          // The click was OUTSIDE the specifiedElement, do something

          // console.log("click not insidee");
          input.classList.remove("active");
          
          overlay.classList.replace("opacity-100", 'opacity-0');
          overlay.classList.replace("visible", 'invisible');
        }
      }
    })
    
  });