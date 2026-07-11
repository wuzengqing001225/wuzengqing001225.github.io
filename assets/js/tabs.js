document.addEventListener('DOMContentLoaded', function () {
  var navItems = document.querySelectorAll('.section-nav .nav-item');
  var tabBiography = document.getElementById('tab-biography');
  var tabPublications = document.getElementById('tab-publications');

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
      initPublicationsTab();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // homepage
    tabBiography.style.display = 'block';
    tabPublications.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      showTab(this.getAttribute('data-target'));
    });
  });

  // --- Shared pagination helper ---
  function setupPagination(items, paginationEl, perPage) {
    if (!paginationEl || !items || items.length === 0) return;
    var totalPages = Math.ceil(items.length / perPage);
    var currentPage = 1;

    function showPage(page) {
      currentPage = page;
      items.forEach(function (item, i) {
        item.style.display = (i >= (page - 1) * perPage && i < page * perPage) ? '' : 'none';
      });
      if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }

      var html = '';
      html += '<a class="page-btn page-nav' + (page <= 1 ? ' is-disabled' : '') + '" data-page="' + (page - 1) + '" aria-label="Previous">‹</a>';
      for (var i = 1; i <= totalPages; i++) {
        if (i > 1) html += '<span class="page-sep">·</span>';
        html += '<a class="page-btn' + (i === page ? ' active' : '') + '" data-page="' + i + '">' + i + '</a>';
      }
      html += '<a class="page-btn page-nav' + (page >= totalPages ? ' is-disabled' : '') + '" data-page="' + (page + 1) + '" aria-label="Next">›</a>';
      paginationEl.innerHTML = html;

      paginationEl.querySelectorAll('.page-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.classList.contains('is-disabled')) return;
          var next = parseInt(btn.getAttribute('data-page'), 10);
          if (next >= 1 && next <= totalPages) showPage(next);
        });
      });
    }

    showPage(1);
  }

  // --- News Pagination ---
  var newsContainer = document.getElementById('news-list');
  var newsPaginationEl = document.getElementById('news-pagination');
  if (newsContainer && newsPaginationEl) {
    setupPagination(
      Array.prototype.slice.call(newsContainer.querySelectorAll('ul > li')),
      newsPaginationEl,
      8
    );
  }

  // --- Highlights Pagination ---
  var highlightsList = document.getElementById('highlights-list');
  var highlightsPaginationEl = document.getElementById('highlights-pagination');
  if (highlightsList && highlightsPaginationEl) {
    setupPagination(
      Array.prototype.slice.call(highlightsList.querySelectorAll('.highlight-item')),
      highlightsPaginationEl,
      3
    );
  }

  // =============================================
  // --- Publications Tab (tag filter only) ---
  // =============================================

  var pubTabInited = false;

  function filterByTag(tag) {
    document.querySelectorAll('#tab-publications .pub-item').forEach(function (item) {
      if (tag === '__all__') {
        item.style.display = '';
      } else {
        var tags = (item.getAttribute('data-tags') || '').split('|');
        item.style.display = tags.indexOf(tag) !== -1 ? '' : 'none';
      }
    });

    document.querySelectorAll('#tab-publications .pub-group').forEach(function (group) {
      var anyVisible = false;
      group.querySelectorAll('.pub-item').forEach(function (item) {
        if (item.style.display !== 'none') anyVisible = true;
      });
      group.style.display = anyVisible ? '' : 'none';
    });
  }

  function initPublicationsTab() {
    if (pubTabInited) return;
    pubTabInited = true;

    var bar = document.getElementById('pub-tag-bar');
    if (!bar) return;

    bar.querySelectorAll('.pub-tag').forEach(function (el) {
      el.addEventListener('click', function () {
        bar.querySelectorAll('.pub-tag').forEach(function (e) { e.classList.remove('active'); });
        el.classList.add('active');
        filterByTag(el.getAttribute('data-tag'));
      });
    });
  }

  // --- Back to top ---
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    function getScrollY() {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    function updateBackToTop() {
      if (getScrollY() > 200) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop);
    updateBackToTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
