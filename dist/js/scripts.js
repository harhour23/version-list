//libraries like jquery etc
/* @preserve
    _____ __ _     __                _
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/

  Version: 1.7.4
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018

*/

/* global define */

(function (factory) {
  typeof define === 'function' && define.amd
    ? define(factory)
    : typeof exports === 'object'
      ? (module.exports = factory())
      : factory()
})(function () {
  ('use strict') // eslint-disable-line no-unused-expressions

  /* globals window:true */
  var _window = typeof window !== 'undefined' ? window : this

  var Glider = (_window.Glider = function (element, settings) {
    var _ = this

    if (element._glider) return element._glider

    _.ele = element
    _.ele.classList.add('glider')

    // expose glider object to its DOM element
    _.ele._glider = _

    // merge user setting with defaults
    _.opt = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesToShow: 1,
        resizeLock: true,
        duration: 0.5,
        // easeInQuad
        easing: function (x, t, b, c, d) {
          return c * (t /= d) * t + b
        }
      },
      settings
    )

    // set defaults
    _.animate_id = _.page = _.slide = 0
    _.arrows = {}

    // preserve original options to
    // extend breakpoint settings
    _._opt = _.opt

    if (_.opt.skipTrack) {
      // first and only child is the track
      _.track = _.ele.children[0]
    } else {
      // create track and wrap slides
      _.track = document.createElement('div')
      _.ele.appendChild(_.track)
      while (_.ele.children.length !== 1) {
        _.track.appendChild(_.ele.children[0])
      }
    }

    _.track.classList.add('glider-track')

    // start glider
    _.init()

    // set events
    _.resize = _.init.bind(_, true)
    _.event(_.ele, 'add', {
      scroll: _.updateControls.bind(_)
    })
    _.event(_window, 'add', {
      resize: _.resize
    })
  })

  var gliderPrototype = Glider.prototype
  gliderPrototype.init = function (refresh, paging) {
    var _ = this

    var width = 0

    var height = 0

    _.slides = _.track.children;

    [].forEach.call(_.slides, function (_, i) {
      _.classList.add('glider-slide')
      _.setAttribute('data-gslide', i)
    })

    _.containerWidth = _.ele.clientWidth

    var breakpointChanged = _.settingsBreakpoint()
    if (!paging) paging = breakpointChanged

    if (
      _.opt.slidesToShow === 'auto' ||
      typeof _.opt._autoSlide !== 'undefined'
    ) {
      var slideCount = _.containerWidth / _.opt.itemWidth

      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth
        ? slideCount
        : Math.max(1, Math.floor(slideCount))
    }
    if (_.opt.slidesToScroll === 'auto') {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow)
    }

    _.itemWidth = _.opt.exactWidth
      ? _.opt.itemWidth
      : _.containerWidth / _.opt.slidesToShow;

    // set slide dimensions
    [].forEach.call(_.slides, function (__) {
      __.style.height = 'auto'
      __.style.width = _.itemWidth + 'px'
      width += _.itemWidth
      height = Math.max(__.offsetHeight, height)
    })

    _.track.style.width = width + 'px'
    _.trackWidth = width
    _.isDrag = false
    _.preventClick = false
    _.move = false

    _.opt.resizeLock && _.scrollTo(_.slide * _.itemWidth, 0)

    if (breakpointChanged || paging) {
      _.bindArrows()
      _.buildDots()
      _.bindDrag()
    }

    _.updateControls()

    _.emit(refresh ? 'refresh' : 'loaded')
  }

  gliderPrototype.bindDrag = function () {
    var _ = this
    _.mouse = _.mouse || _.handleMouse.bind(_)

    var mouseup = function () {
      _.mouseDown = undefined
      _.ele.classList.remove('drag')
      if (_.isDrag) {
        _.preventClick = true
      }
      _.isDrag = false
    }

    const move = function () {
      _.move = true
    }

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function (e) {
        e.preventDefault()
        e.stopPropagation()
        _.mouseDown = e.clientX
        _.ele.classList.add('drag')
        _.move = false
        setTimeout(move, 300)
      },
      touchstart: function (e) {
        _.ele.classList.add('drag')
        _.move = false
        setTimeout(move, 300)
      },
      mousemove: _.mouse,
      click: function (e) {
        if (_.preventClick && _.move) {
          e.preventDefault()
          e.stopPropagation()
        }
        _.preventClick = false
        _.move = false
      }
    }

    _.ele.classList.toggle('draggable', _.opt.draggable === true)
    _.event(_.ele, 'remove', events)
    if (_.opt.draggable) _.event(_.ele, 'add', events)
  }

  gliderPrototype.buildDots = function () {
    var _ = this

    if (!_.opt.dots) {
      if (_.dots) _.dots.innerHTML = ''
      return
    }

    if (typeof _.opt.dots === 'string') {
      _.dots = document.querySelector(_.opt.dots)
    } else _.dots = _.opt.dots
    if (!_.dots) return

    _.dots.innerHTML = ''
    _.dots.setAttribute('role', 'tablist')
    _.dots.classList.add('glider-dots')

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i) {
      var dot = document.createElement('button')
      dot.dataset.index = i
      dot.setAttribute('aria-label', 'Page ' + (i + 1))
      dot.setAttribute('role', 'tab')
      dot.className = 'glider-dot ' + (i ? '' : 'active')
      _.event(dot, 'add', {
        click: _.scrollItem.bind(_, i, true)
      })
      _.dots.appendChild(dot)
    }
  }

  gliderPrototype.bindArrows = function () {
    var _ = this
    if (!_.opt.arrows) {
      Object.keys(_.arrows).forEach(function (direction) {
        var element = _.arrows[direction]
        _.event(element, 'remove', { click: element._func })
      })
      return
    }
    ['prev', 'next'].forEach(function (direction) {
      var arrow = _.opt.arrows[direction]
      if (arrow) {
        if (typeof arrow === 'string') arrow = document.querySelector(arrow)
        if (arrow) {
          arrow._func = arrow._func || _.scrollItem.bind(_, direction)
          _.event(arrow, 'remove', {
            click: arrow._func
          })
          _.event(arrow, 'add', {
            click: arrow._func
          })
          _.arrows[direction] = arrow
        }
      }
    })
  }

  gliderPrototype.updateControls = function (event) {
    var _ = this

    if (event && !_.opt.scrollPropagate) {
      event.stopPropagation()
    }

    var disableArrows = _.containerWidth >= _.trackWidth

    if (!_.opt.rewind) {
      if (_.arrows.prev) {
        _.arrows.prev.classList.toggle(
          'disabled',
          _.ele.scrollLeft <= 0 || disableArrows
        )

        _.arrows.prev.setAttribute(
          'aria-disabled',
          _.arrows.prev.classList.contains('disabled')
        )
      }
      if (_.arrows.next) {
        _.arrows.next.classList.toggle(
          'disabled',
          Math.ceil(_.ele.scrollLeft + _.containerWidth) >=
            Math.floor(_.trackWidth) || disableArrows
        )

        _.arrows.next.setAttribute(
          'aria-disabled',
          _.arrows.next.classList.contains('disabled')
        )
      }
    }

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth)
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth)

    var middle = _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2)

    var extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1
    if (Math.floor(_.opt.slidesToShow) === 1) {
      extraMiddle = 0
    }

    // the last page may be less than one half of a normal page width so
    // the page is rounded down. when at the end, force the page to turn
    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)) {
      _.page = _.dots ? _.dots.children.length - 1 : 0
    }

    [].forEach.call(_.slides, function (slide, index) {
      var slideClasses = slide.classList

      var wasVisible = slideClasses.contains('visible')

      var start = _.ele.scrollLeft

      var end = _.ele.scrollLeft + _.containerWidth

      var itemStart = _.itemWidth * index

      var itemEnd = itemStart + _.itemWidth;

      [].forEach.call(slideClasses, function (className) {
        /^left|right/.test(className) && slideClasses.remove(className)
      })
      slideClasses.toggle('active', _.slide === index)
      if (middle === index || (extraMiddle && extraMiddle === index)) {
        slideClasses.add('center')
      } else {
        slideClasses.remove('center')
        slideClasses.add(
          [
            index < middle ? 'left' : 'right',
            Math.abs(index - (index < middle ? middle : extraMiddle || middle))
          ].join('-')
        )
      }

      var isVisible =
        Math.ceil(itemStart) >= Math.floor(start) &&
        Math.floor(itemEnd) <= Math.ceil(end)
      slideClasses.toggle('visible', isVisible)
      if (isVisible !== wasVisible) {
        _.emit('slide-' + (isVisible ? 'visible' : 'hidden'), {
          slide: index
        })
      }
    })
    if (_.dots) {
      [].forEach.call(_.dots.children, function (dot, index) {
        dot.classList.toggle('active', _.page === index)
      })
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock)
      _.scrollLock = setTimeout(function () {
        clearTimeout(_.scrollLock)
        // dont attempt to scroll less than a pixel fraction - causes looping
        if (Math.abs(_.ele.scrollLeft / _.itemWidth - _.slide) > 0.02) {
          if (!_.mouseDown) {
            // Only scroll if not at the end (#94)
            if (_.trackWidth > _.containerWidth + _.ele.scrollLeft) {
              _.scrollItem(_.getCurrentSlide())
            }
          }
        }
      }, _.opt.scrollLockDelay || 250)
    }
  }

  gliderPrototype.getCurrentSlide = function () {
    var _ = this
    return _.round(_.ele.scrollLeft / _.itemWidth)
  }

  gliderPrototype.scrollItem = function (slide, dot, e) {
    if (e) e.preventDefault()

    var _ = this

    var originalSlide = slide
    ++_.animate_id

    var prevSlide = _.slide
    var position

    if (dot === true) {
      slide = Math.round((slide * _.containerWidth) / _.itemWidth)
      position = slide * _.itemWidth
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev'

        // use precise location if fractional slides are on
        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1) {
          slide = _.getCurrentSlide()
        } else {
          slide = _.slide
        }

        if (backwards) slide -= _.opt.slidesToScroll
        else slide += _.opt.slidesToScroll

        if (_.opt.rewind) {
          var scrollLeft = _.ele.scrollLeft
          slide =
            backwards && !scrollLeft
              ? _.slides.length
              : !backwards &&
                scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)
                ? 0
                : slide
        }
      }

      slide = Math.max(Math.min(slide, _.slides.length), 0)

      _.slide = slide
      position = _.itemWidth * slide
    }

    _.emit('scroll-item', { prevSlide, slide })

    _.scrollTo(
      position,
      _.opt.duration * Math.abs(_.ele.scrollLeft - position),
      function () {
        _.updateControls()
        _.emit('animated', {
          value: originalSlide,
          type:
            typeof originalSlide === 'string' ? 'arrow' : dot ? 'dot' : 'slide'
        })
      }
    )

    return false
  }

  gliderPrototype.settingsBreakpoint = function () {
    var _ = this

    var resp = _._opt.responsive

    if (resp) {
      // Sort the breakpoints in mobile first order
      resp.sort(function (a, b) {
        return b.breakpoint - a.breakpoint
      })

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i]
        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = Object.assign({}, _._opt, size.settings)
            _.breakpoint = size.breakpoint
            return true
          }
          return false
        }
      }
    }
    // set back to defaults in case they were overriden
    var breakpointChanged = _.breakpoint !== 0
    _.opt = Object.assign({}, _._opt)
    _.breakpoint = 0
    return breakpointChanged
  }

  gliderPrototype.scrollTo = function (scrollTarget, scrollDuration, callback) {
    var _ = this

    var start = new Date().getTime()

    var animateIndex = _.animate_id

    var animate = function () {
      var now = new Date().getTime() - start
      _.ele.scrollLeft =
        _.ele.scrollLeft +
        (scrollTarget - _.ele.scrollLeft) *
          _.opt.easing(0, now, 0, 1, scrollDuration)
      if (now < scrollDuration && animateIndex === _.animate_id) {
        _window.requestAnimationFrame(animate)
      } else {
        _.ele.scrollLeft = scrollTarget
        callback && callback.call(_)
      }
    }

    _window.requestAnimationFrame(animate)
  }

  gliderPrototype.removeItem = function (index) {
    var _ = this

    if (_.slides.length) {
      _.track.removeChild(_.slides[index])
      _.refresh(true)
      _.emit('remove')
    }
  }

  gliderPrototype.addItem = function (ele) {
    var _ = this

    _.track.appendChild(ele)
    _.refresh(true)
    _.emit('add')
  }

  gliderPrototype.handleMouse = function (e) {
    var _ = this
    if (_.mouseDown) {
      _.isDrag = true
      _.ele.scrollLeft +=
        (_.mouseDown - e.clientX) * (_.opt.dragVelocity || 3.3)
      _.mouseDown = e.clientX
    }
  }

  // used to round to the nearest 0.XX fraction
  gliderPrototype.round = function (double) {
    var _ = this
    var step = _.opt.slidesToScroll % 1 || 1
    var inv = 1.0 / step
    return Math.round(double * inv) / inv
  }

  gliderPrototype.refresh = function (paging) {
    var _ = this
    _.init(true, paging)
  }

  gliderPrototype.setOption = function (opt, global) {
    var _ = this

    if (_.breakpoint && !global) {
      _._opt.responsive.forEach(function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = Object.assign({}, v.settings, opt)
        }
      })
    } else {
      _._opt = Object.assign({}, _._opt, opt)
    }

    _.breakpoint = 0
    _.settingsBreakpoint()
  }

  gliderPrototype.destroy = function () {
    var _ = this

    var replace = _.ele.cloneNode(true)

    var clear = function (ele) {
      ele.removeAttribute('style');
      [].forEach.call(ele.classList, function (className) {
        /^glider/.test(className) && ele.classList.remove(className)
      })
    }
    // remove track if it was created by glider
    if (!_.opt.skipTrack) {
      replace.children[0].outerHTML = replace.children[0].innerHTML
    }
    clear(replace);
    [].forEach.call(replace.getElementsByTagName('*'), clear)
    _.ele.parentNode.replaceChild(replace, _.ele)
    _.event(_window, 'remove', {
      resize: _.resize
    })
    _.emit('destroy')
  }

  gliderPrototype.emit = function (name, arg) {
    var _ = this

    var e = new _window.CustomEvent('glider-' + name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    })
    _.ele.dispatchEvent(e)
  }

  gliderPrototype.event = function (ele, type, args) {
    var eventHandler = ele[type + 'EventListener'].bind(ele)
    Object.keys(args).forEach(function (k) {
      eventHandler(k, args[k])
    })
  }

  return Glider
})



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