/**
* Template Name: iPortfolio - v3.7.0
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.mobile-nav-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function (direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope, filter and paging
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      // Figures shown per page. One number to change if the grid should hold more
      const PAGE_SIZE = 6;

      const portfolioItems = select('.portfolio-container .portfolio-item', true);
      const prevBtn = select('.portfolio-nav-prev');
      const nextBtn = select('.portfolio-nav-next');
      const dotsBar = select('.portfolio-dots');

      let activeFilter = '*';
      let currentPage = 0;

      // Category and page compose instead of competing: the category narrows the
      // set, then the page takes a slice of whatever is left. Isotope accepts a
      // function here, so both live in the one filter it was already running
      function applyLayout() {
        const matching = activeFilter === '*' ?
          portfolioItems :
          portfolioItems.filter(el => el.matches(activeFilter));

        const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
        currentPage = Math.min(Math.max(currentPage, 0), pageCount - 1);

        const start = currentPage * PAGE_SIZE;
        const onPage = matching.slice(start, start + PAGE_SIZE);

        portfolioIsotope.arrange({
          filter: el => onPage.indexOf(el) !== -1
        });

        renderControls(pageCount);
      }

      function goToPage(page) {
        currentPage = page;
        applyLayout();
      }

      function renderControls(pageCount) {
        // A single page has nothing to page through, so the controls stay out of the way
        const idle = pageCount < 2;
        [prevBtn, nextBtn, dotsBar].forEach(function (el) {
          if (el) el.classList.toggle('portfolio-paging-idle', idle);
        });

        if (prevBtn) prevBtn.disabled = currentPage === 0;
        if (nextBtn) nextBtn.disabled = currentPage === pageCount - 1;

        if (!dotsBar) return;
        dotsBar.innerHTML = '';
        for (let i = 0; i < pageCount; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'portfolio-dot' + (i === currentPage ? ' portfolio-dot-active' : '');
          dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
          dot.addEventListener('click', function () {
            goToPage(i);
          });
          dotsBar.appendChild(dot);
        }
      }

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        activeFilter = this.getAttribute('data-filter');
        currentPage = 0;
        applyLayout();
      }, true);

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          goToPage(currentPage - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          goToPage(currentPage + 1);
        });
      }

      // Registered once. The original bound this inside the filter handler, which
      // added a fresh listener on every click
      portfolioIsotope.on('arrangeComplete', function () {
        AOS.refresh()
      });

      applyLayout();
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  // GLightbox's stock template puts the caption beside the image, inside a
  // container that spans the whole slide, so a caption pinned there never lines up
  // with the picture. This copy nests it inside the media box, which hugs the image
  // at any aspect ratio. Keep in sync with slideHTML in glightbox.min.js if that
  // vendor file is ever updated
  const portfolioSlideHTML = '<div class="gslide">' +
    '<div class="gslide-inner-content">' +
    '<div class="ginner-container">' +
    '<div class="gslide-media">' +
    '<div class="gslide-description">' +
    '<div class="gdesc-inner">' +
    '<h4 class="gslide-title"></h4>' +
    '<div class="gslide-desc"></div>' +
    '</div></div></div></div></div></div>';

  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox',
    slideHTML: portfolioSlideHTML
  });

  /**
   * Figure slider on the project pages
   */
  // The markup and the Swiper bundle were always here but nothing ever started
  // the slider, so every project page showed its first figure and no way to reach
  // the rest. Elements are passed straight in rather than as selectors because
  // the arrows live outside .swiper, which clips its own overflow
  const detailsSlider = select('.portfolio-details-slider');
  if (detailsSlider && typeof Swiper !== 'undefined') {
    new Swiper(detailsSlider, {
      speed: 500,
      loop: false,
      // Scientific figures come in all shapes, so let the frame follow the art
      autoHeight: true,
      pagination: {
        el: select('.portfolio-details-figure .swiper-pagination'),
        clickable: true
      },
      navigation: {
        prevEl: select('.details-nav-prev'),
        nextEl: select('.details-nav-next')
      }
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  });

})()