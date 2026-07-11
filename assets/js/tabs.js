document.addEventListener('DOMContentLoaded', function () {
  var navItems = document.querySelectorAll('.section-nav .nav-item');
  var tabBiography = document.getElementById('tab-biography');
  var tabPublications = document.getElementById('tab-publications');

  var sectionTargetMap = {
    news: 'section-news',
    highlights: 'section-highlights',
    education: 'section-education',
    awards: 'section-awards',
    services: 'section-services',
    funding: 'section-funding'
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
      initPublicationsTab();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    tabBiography.style.display = 'block';
    tabPublications.style.display = 'none';

    var sectionId = sectionTargetMap[target];
    // Wait a frame so layout is ready after showing biography tab
    requestAnimationFrame(function () {
      setTimeout(function () {
        var el = null;
        if (sectionId) {
          el = document.getElementById(sectionId)
            || document.getElementById(sectionId + '-heading')
            || tabBiography.querySelector('#' + sectionId);
        }
        if (!el && sectionId) {
          var allH2 = tabBiography.querySelectorAll('h2, h3');
          for (var i = 0; i < allH2.length; i++) {
            var text = allH2[i].textContent.trim().toLowerCase();
            if (allH2[i].id === sectionId || text.indexOf(target) !== -1 || text === 'funding' && target === 'funding') {
              el = allH2[i];
              break;
            }
          }
        }
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    });
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

    function showPage(page) {
      items.forEach(function (item, i) {
        item.style.display = (i >= (page - 1) * perPage && i < page * perPage) ? '' : 'none';
      });
      if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }
      var html = '';
      for (var i = 1; i <= totalPages; i++) {
        html += '<a class="page-btn' + (i === page ? ' active' : '') + '" data-page="' + i + '">' + i + '</a>';
      }
      paginationEl.innerHTML = html;
      paginationEl.querySelectorAll('.page-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          showPage(parseInt(this.getAttribute('data-page'), 10));
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
      10
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
  // --- Publications Tab ---
  // =============================================

  var pubTabInited = false;

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatAuthors(authorsStr, correspondingStr) {
    var isMeCorresponding = /Wu,?\s*Z/i.test(correspondingStr || '');

    var raw = (authorsStr || '')
      .replace(/\s*&\s*/g, ', ')
      .replace(/\s+and\s+/gi, ', ');
    var parts = raw.split(', ');
    var authors = [];

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      if (/^\.\.\.$/.test(p)) {
        authors.push('...');
      } else if (i > 0 && /^[A-Za-z]{1,3}\.?$/.test(p) && authors.length > 0 && authors[authors.length - 1] !== '...') {
        authors[authors.length - 1] = authors[authors.length - 1] + ', ' + p;
      } else {
        authors.push(p);
      }
    }

    return authors.map(function (name) {
      if (name === '...') return '...';
      if (/Wu,?\s*Z/i.test(name)) {
        var html = '<strong>' + escHtml(name) + '</strong>';
        if (isMeCorresponding) {
          html = '<span class="author-corresponding">' + html + '</span>';
        }
        return html;
      }
      return escHtml(name);
    }).join(', ');
  }

  function formatAllAuthors() {
    document.querySelectorAll('#tab-publications .pub-authors[data-authors]').forEach(function (el) {
      el.innerHTML = formatAuthors(el.getAttribute('data-authors'), el.getAttribute('data-corresponding') || '');
    });
  }

  function filterByTag(tag) {
    var items = document.querySelectorAll('#tab-publications .pub-item');
    items.forEach(function (item) {
      if (tag === '__all__') {
        item.style.display = '';
      } else {
        var tags = (item.getAttribute('data-tags') || '').split('|');
        item.style.display = tags.indexOf(tag) !== -1 ? '' : 'none';
      }
    });

    // Hide empty groups
    document.querySelectorAll('#tab-publications .pub-group').forEach(function (group) {
      var visible = group.querySelectorAll('.pub-item:not([style*="display: none"])');
      // Also check computed style for items with display:''
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

    formatAllAuthors();

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
    function updateBackToTop() {
      if (window.scrollY > 280) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
