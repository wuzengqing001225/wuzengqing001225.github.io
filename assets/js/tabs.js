document.addEventListener('DOMContentLoaded', function () {
  var navItems = document.querySelectorAll('.section-nav .nav-item');
  var tabBiography = document.getElementById('tab-biography');
  var tabPublications = document.getElementById('tab-publications');

  var sectionTargetMap = {
    biography: 'biography',
    news: 'section-news',
    highlights: 'section-highlights',
    education: 'section-education',
    awards: 'section-awards',
    services: 'section-services'
  };

  function setActiveNav(target) {
    navItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-target') === target);
    });
  }

  function showTab(target) {
    setActiveNav(target);

    if (target === 'publications') {
      tabBiography.style.display = 'none';
      tabPublications.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    tabBiography.style.display = 'block';
    tabPublications.style.display = 'none';

    var sectionId = sectionTargetMap[target];
    if (sectionId) {
      var el = document.getElementById(sectionId);
      if (!el) {
        var allH2 = tabBiography.querySelectorAll('h2, h3');
        for (var i = 0; i < allH2.length; i++) {
          if (allH2[i].id === sectionId || allH2[i].textContent.trim().toLowerCase().indexOf(target) !== -1) {
            el = allH2[i];
            break;
          }
        }
      }
      if (target === 'biography') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      showTab(this.getAttribute('data-target'));
    });
  });

  // --- News Pagination ---
  var NEWS_PER_PAGE = 10;
  var newsContainer = document.getElementById('news-list');
  var newsPaginationEl = document.getElementById('news-pagination');

  if (newsContainer && newsPaginationEl) {
    var newsItems = newsContainer.querySelectorAll('ul > li');
    var totalNewsPages = Math.ceil(newsItems.length / NEWS_PER_PAGE);

    function showNewsPage(page) {
      newsItems.forEach(function (item, i) {
        item.style.display = (i >= (page - 1) * NEWS_PER_PAGE && i < page * NEWS_PER_PAGE) ? '' : 'none';
      });
      renderNewsPagination(page);
    }

    function renderNewsPagination(current) {
      if (totalNewsPages <= 1) { newsPaginationEl.innerHTML = ''; return; }
      var html = '';
      for (var i = 1; i <= totalNewsPages; i++) {
        html += '<a class="page-btn' + (i === current ? ' active' : '') + '" data-page="' + i + '">' + i + '</a>';
      }
      newsPaginationEl.innerHTML = html;
      newsPaginationEl.querySelectorAll('.page-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          showNewsPage(parseInt(this.getAttribute('data-page')));
        });
      });
    }

    showNewsPage(1);
  }

  // --- Highlights Pagination ---
  var HIGHLIGHTS_PER_PAGE = 3;
  var highlightsList = document.getElementById('highlights-list');
  var highlightsPaginationEl = document.getElementById('highlights-pagination');

  if (highlightsList && highlightsPaginationEl) {
    var highlightItems = highlightsList.querySelectorAll('.highlight-item');
    var totalHighlightsPages = Math.ceil(highlightItems.length / HIGHLIGHTS_PER_PAGE);

    function showHighlightsPage(page) {
      highlightItems.forEach(function (item, i) {
        var br = item.nextElementSibling;
        var visible = (i >= (page - 1) * HIGHLIGHTS_PER_PAGE && i < page * HIGHLIGHTS_PER_PAGE);
        item.style.display = visible ? '' : 'none';
        if (br && br.tagName === 'BR') {
          br.style.display = visible ? '' : 'none';
        }
      });
      renderHighlightsPagination(page);
    }

    function renderHighlightsPagination(current) {
      if (totalHighlightsPages <= 1) { highlightsPaginationEl.innerHTML = ''; return; }
      var html = '';
      for (var i = 1; i <= totalHighlightsPages; i++) {
        html += '<a class="page-btn' + (i === current ? ' active' : '') + '" data-page="' + i + '">' + i + '</a>';
      }
      highlightsPaginationEl.innerHTML = html;
      highlightsPaginationEl.querySelectorAll('.page-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          showHighlightsPage(parseInt(this.getAttribute('data-page')));
        });
      });
    }

    showHighlightsPage(1);
  }
});
