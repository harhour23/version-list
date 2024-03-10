window.addEventListener("DOMContentLoaded", () => {
  console.log("Loaded Sidebar Scripts");

  // Criterias
  let sidebarCriterias =  document.querySelector("#js-sidebar-criterias");
  let sidebarCriteriasButton = document.querySelector("#js-show-sidebar-criterias");

  let sidebarCriteriasButtonTextActive = document.querySelector("#js-show-sidebar-criterias span.active");
  let sidebarCriteriasButtonTextInactive = document.querySelector("#js-show-sidebar-criterias span.inactive");

  // Categories
  let SidebarCategoriesInput = document.querySelector("#sidebar-categories-input");
  let SidebarCategoriesBox = document.querySelector("#sidebar-categories-overlay");
  let SidebarCategories = document.querySelector(".sidebar-categories");

  // regions
  let SidebarRegionsInput = document.querySelector("#sidebar-regions-input");
  let SidebarRegionsBox = document.querySelector("#sidebar-regions-overlay");
  let SidebarRegions = document.querySelector(".sidebar-regions");

  // regions
  let SidebarSecteursInput = document.querySelector("#sidebar-secteurs-input");
  let SidebarSecteursBox = document.querySelector("#sidebar-secteurs-overlay");
  let SidebarSecteurs = document.querySelector(".sidebar-secteurs");

  // regions
  let SidebarUnitesInput = document.querySelector("#sidebar-unites-input");
  let SidebarUnitesBox = document.querySelector("#sidebar-unites-overlay");
  let SidebarUnites = document.querySelector(".sidebar-unites");

  let SidebarReconnaissanceInput = document.querySelector("#sidebar-reconnaissance-input");
  let SidebarReconnaissanceBox = document.querySelector("#sidebar-reconnaissance-overlay");
  let SidebarReconnaissance = document.querySelector(".sidebar-reconnaissance");

  let SidebarServicesEssentielsInput = document.querySelector("#sidebar-servicesessentiels-input");
  let SidebarServicesEssentielsBox = document.querySelector("#sidebar-servicesessentiels-overlay");
  let SidebarServicesEssentiels = document.querySelector(".sidebar-servicesessentiels");

  let SidebarPromotionsInput = document.querySelector("#sidebar-promotions-input");
  let SidebarPromotionsBox = document.querySelector("#sidebar-promotions-overlay");
  let SidebarPromotions = document.querySelector(".sidebar-promotions");


  sidebarCriteriasButton.addEventListener("click", function(e){

    e.preventDefault();

    if(sidebarCriterias.classList.contains("active")){

      sidebarCriterias.classList.remove("active");

      sidebarCriteriasButtonTextActive.classList.add("hidden");
      sidebarCriteriasButtonTextInactive.classList.remove("hidden");

      sidebarCriterias.classList.remove("ease-in", 'duration-300');
      
      sidebarCriterias.classList.replace("opacity-100", 'opacity-0');
      sidebarCriterias.classList.replace("h-auto", 'h-0');
      sidebarCriterias.classList.replace("visible", 'invisible');

      // Le bouton
      
    } else {

      sidebarCriterias.classList.add("active");

      sidebarCriteriasButtonTextInactive.classList.add("hidden");
      sidebarCriteriasButtonTextActive.classList.remove("hidden");

      sidebarCriterias.classList.add("ease-in", 'duration-300');

      sidebarCriterias.classList.replace("opacity-0", 'opacity-100');
      sidebarCriterias.classList.replace("h-0", 'h-auto');
      sidebarCriterias.classList.replace("invisible", 'visible');
    }


  });


  // Categories
  VivreBoxAppear(SidebarRegions, SidebarRegionsInput, SidebarRegionsBox);
  VivreBoxAppear(SidebarSecteurs, SidebarSecteursInput, SidebarSecteursBox);
  VivreBoxAppear(SidebarCategories, SidebarCategoriesInput, SidebarCategoriesBox);

  VivreBoxAppear(SidebarUnites, SidebarUnitesInput, SidebarUnitesBox);

  VivreBoxAppear(SidebarReconnaissance, SidebarReconnaissanceInput, SidebarReconnaissanceBox);
  VivreBoxAppear(SidebarServicesEssentiels, SidebarServicesEssentielsInput, SidebarServicesEssentielsBox);
  VivreBoxAppear(SidebarPromotions, SidebarPromotionsInput, SidebarPromotionsBox);
  // Regions



});