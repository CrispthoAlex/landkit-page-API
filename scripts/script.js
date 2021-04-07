// VARIABLES //

// Get class to show Mobile menu
let dynamicMenu;
// Get elements to modified active link
let hoverLinks;


$(function () {

  dynamicMenu =  $('.js-navigate');
  hoverLinks = document.querySelectorAll('.navigate-list__item--hover');

  //Calculate the height of <header> tag
  //Use outerHeight() instead of height() if have padding
  let aboveHeight = $('header').height();
  
  // Fix the navbar/header when user scrolls the page
  $(window).on('scroll', () => {
      //if scrolled down more than the header’s height
      if ($(window).scrollTop() > aboveHeight) {
        // if yes, add “fixed” class to the <nav>
        // add padding top to the #content (value is same as the height of the nav)
        $('.main-header').addClass('fixed');
      }
      else {
        // when scroll up or less than aboveHeight, remove the “fixed” class, and the padding-top
        $('.main-header').removeClass('fixed');
      }
    });

  // Toggle class from Small and Medium device menu
  $('.js-menu-button').on('click', function () {
      dynamicMenu.toggleClass('navigate--opened');

      this.classList.toggle('menu-button--opened');
      this.setAttribute('aria-expanded', this.classList.contains('menu-button--opened'));
    });

  // Loop through the links and add the active class to the current/clicked link
  hoverLinks.forEach(activelink => {
    activelink.addEventListener('click', function() {
      // Remove last element with active class
      hoverLinks.forEach(link => link.classList.remove('active'));
      // Add to current element the active class
      this.classList.add('active');
    });
  });
  
  /* Insert dynamically the blogs */
  // The global URL for the API
  const globalURL = 'https://api-json-server-deploy.herokuapp.com/';

  // Random date
  function randomDate (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  let start = new Date(2001, 0, 1)
  let end = new Date()
  let formatDate = months[randomDate(start, end).getMonth()].slice(0, 3) + ' ' + randomDate(start, end).getDate()
  
  let arrayfavorite = [];

  $.ajax({
    url: globalURL + 'posts', // Load the blogs
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    success: function (posts) {

      $.each(posts, function (idx, post) {
        let postUserId = post.userId;
        
        // Random genere
        let genere = Math.random(0, 1) === 0? 'men' : 'women'; 
        // Random image
        let imgCard = Math.floor(Math.random()*2) === 0? 'tech' : Math.floor(Math.random()*2) === 1?'arch' : 'nature';
        let price = Math.floor(Math.random()*100)
        
        $('.preview-blogs').append(
            `<article class="preview-blogs__card" id="post_${post.id}">
              <figure class="preview-blogs__card-img" title="Add to Favorites">
                <p class="pricing">$${price}/MO</p>
                <svg class="favorite js-favorite" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 6.2c0 .2-.1.4-.3.5l-3.4 3.6.8 5v.2c0 .3-.1.5-.4.5l-.4-.1L8 13.5l-4.3 2.4-.4.1c-.3 0-.4-.2-.4-.5v-.2l.8-5L.2 6.7 0 6.2c0-.3.3-.4.5-.5L5.4 5 7.5.4c.1-.2.3-.4.5-.4s.4.2.5.4L10.6 5l4.9.7c.2 0 .5.2.5.5z" fill="#B4C2D3"/></svg>
                <img  src="${post.imageBg + imgCard}" alt="">
              </figure>
              <div class="overview">
                <h3 class="overview__subtitle">${post.title}</h3>
                <p class="overview__paragraph overview__paragraph--preview-blogs">${post.body}</p>
              </div>
              <div class="preview-blogs__card-footer">
                <div class="profile">
                  <img class="profile__img" width="25px" src="https://randomuser.me/api/portraits/${genere}/${post.userId}.jpg" alt="" class="profile__userimg">
                  <h4 class="profile__username">${post.name}</h4>
                </div>
                <p class="card-date">${formatDate}</p>
              </div>
            </article>`
          );
      });
    } ,
    complete: function (posts) {
      // show first six elements
      $(".preview-blogs__card").slice(0, 6).show();

      /* Favorite blog */
      let cardlist = document.querySelectorAll('.preview-blogs__card');
      let jsfavlist = document.querySelectorAll('.js-favorite');

      let jsfavparent; // Save the clicked parent element
      $(jsfavlist).on('click', function() {
        
        this.classList.toggle('addfav');
        // Get the innerHTML from parents()
        jsfavparent = $( this ).parents('.preview-blogs__card')[0];

        if (this.classList.contains('addfav')) {
          $('.favorites-blogs').append( jsfavparent );
        } else {
          $('.preview-blogs').prepend( jsfavparent );
        }
      });
    }
  });
  let arrsearch = [];
  /**
   * Change section:
   * Click for favorite section, another click return to articles section
   */
  // Show only favorite section
  $('.js-navigate-list__item-favorite').on('click', function () {
    
    $('.preview-blogs').css('display','none');
    $('.favorites-blogs').css('display','flex');
    $('.main-content__load-more').css('display','none');
    $('.current-blog').css('display','none');
    if ( $('.favorites-blogs').children().length === 0 ) {
      $('.page404').css('display','flex');
    }

  });
  // Show only preview section
  $('.js-navigate-list__item-preview').on('click', function () {
    $('.preview-blogs').css('display','flex');
    $('.favorites-blogs').css('display','none');
    $('.main-content__load-more').css('display','flex');
    $('.current-blog').css('display','none');
    $('.page404').css('display','none');
  });
  

  /**
   * Searching content function
   * This function search for content on the blogs
  */
  $('.js-main-content__search-go').on('click', function () {
    
    let input = document.getElementById('search-content').value;
    input = input.toLowerCase();

    arrsearch = document.getElementsByClassName('overview__paragraph');

    let searchElparent; // save each element to display not
    for (i = 0; i < arrsearch.length ; i++) {
      
      if (!arrsearch[i].innerHTML.toLowerCase().includes(input)) {
        searchElparent = $( arrsearch[i] ).parents('.preview-blogs__card')[0];
        $(searchElparent).css('display', 'none') ;
      }
    }
    if (arrsearch.length === 0) {
      $('.page404').css('display','flex');
    }
  });

  /* Funtion to add the objects to the localstorage */
  function addlocalStorage (jsfavparent, arrayfavorite) {
    // push the new data
    arrayfavorite.push(jsfavparent);

    //localStorage.setItem("jsfavparent", JSON.stringify(jsfavparent));
    // Save entries back to local storage
    localStorage.setItem("arrayfavorite", JSON.stringify(arrayfavorite));
  };

  /* Load more event */

  $("body").on('click touchstart', '.js-main-content__load-more', function (e) {
    
    $(".preview-blogs__card:hidden").slice(0, 6).slideDown();
    if ($(".preview-blogs__card:hidden").length == 0) {
      $(".main-content__load-more").css('visibility', 'hidden');
    }
    $('html,body').animate({
      scrollTop: $(this).offset().top
    }, 1000);
  });

});

