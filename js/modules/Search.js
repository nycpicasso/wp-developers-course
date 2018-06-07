import $ from 'jquery';

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    this.resultsDiv = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $("#js-search-term");
    this.searchFieldPrev;
    this.searchTimer;
    this.events();
    this.searchActive = false;
    this.spinnerActive = false;
  }

  // 2. events
  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispatcher.bind(this));
    this.searchField.on("keyup", this.liveSearch.bind(this));
  }

  // 3. methods (function, action...)
  
  keyPressDispatcher(e) {
    if ( e.keyCode === 83 && !this.searchActive && !$("input, textarea").is(':focus') ) { // lowercase s
      this.openOverlay();
    }
    if ( e.keyCode === 27 && this.searchActive ) { // escape key
      this.closeOverlay();
    }
  }
  
  liveSearch(){
    if ( this.searchField.val() !== this.searchFieldPrev ) {
      clearTimeout(this.searchTimer);
      
      // Display a spinner when typing in unique search criteria
      if (this.searchField.val()) {
        if ( !this.spinnerActive ) {
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.spinnerActive = true;
        }
        this.searchTimer = setTimeout( this.getResults.bind(this), 300 );
      } else {
        this.resultsDiv.html(''); // clear search results if search field empty
        this.spinnerActive = false;
      }
    }
    this.searchFieldPrev = this.searchField.val();
  }
  
  getResults() {
    $.getJSON('http://wp-university.local/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => {
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
        <ul class="link-list min-list">
          ${posts.map( item=>`<li><a href="${item.link}">${item.title.rendered}</a></li>` ).join('')}
        </ul>
      `);
    });
  }
  
  openOverlay() {
    this.searchActive = true;
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
  }

  closeOverlay() {
    this.searchActive = false;
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
  }
}

export default Search;