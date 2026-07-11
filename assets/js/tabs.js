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

  // =============================================
  // --- Publications Tab Rendering ---
  // =============================================

  var pubTabInited = false;
  var activeTag = null;

  // Group order for publications
  var TYPE_ORDER = ['Conference', 'Local Conference', 'Journal', 'Local Journal', 'Preprint'];
  var TYPE_LABELS = {
    'Conference': 'Conference Papers',
    'Local Conference': 'Local Conference Papers',
    'Journal': 'Journal Articles',
    'Local Journal': 'Local Journal Articles',
    'Preprint': 'Preprints'
  };

  function formatAuthors(authorsStr, correspondingStr) {
    // correspondingStr may be "Wu, Z. & Xiao, C." or "Wu, Z."
    var correspondingNames = correspondingStr
      ? correspondingStr.split(/[,&]/).map(function(s){ return s.trim(); }).filter(Boolean)
      : [];

    // Split authors by comma, but keep "Lastname, F." together
    // Authors format: "Wu, Z., Peng, R., ..."  each author = "Lastname, Initial."
    // Strategy: split on ", " then re-join pairs (Lastname + Initial)
    var raw = authorsStr;
    // Replace " & " with ", " for uniform splitting
    raw = raw.replace(/\s*&\s*/g, ', ');
    // Replace " and " with ", "
    raw = raw.replace(/\s+and\s+/gi, ', ');
    // Split on ", "
    var parts = raw.split(', ');
    // Re-join as "Lastname, Initial." pairs
    var authors = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      // If this part ends with a period or looks like an initial (1-2 chars + optional dot),
      // it's the second half of "Lastname, Initial." — merge with previous
      if (i > 0 && /^[A-Z]{1,2}\.?$/.test(p) && authors.length > 0) {
        authors[authors.length - 1] = authors[authors.length - 1] + ', ' + p;
      } else if (/^\.\.\.$/.test(p)) {
        authors.push('...');
      } else {
        authors.push(p);
      }
    }

    var result = authors.map(function(name) {
      if (name === '...') return '...';
      var isMe = /Wu,?\s*Z/.test(name);
      var isCorresponding = correspondingNames.some(function(cn) {
        return /Wu,?\s*Z/.test(cn) && isMe;
      });
      if (isMe) {
        var html = '<strong>' + escHtml(name) + '</strong>';
        if (isCorresponding) {
          html = '<span class="author-corresponding">' + html + '</span>';
        }
        return html;
      }
      return escHtml(name);
    });

    return result.join(', ');
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTagBar(publications) {
    var tagCount = {};
    publications.forEach(function(p) {
      (p.tag || []).forEach(function(t) {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });
    });
    var tags = Object.keys(tagCount).sort();
    var bar = document.getElementById('pub-tag-bar');
    var html = '<div class="tag-bar">';
    html += '<a class="pub-tag active" data-tag="__all__">All <span class="tag-count">' + publications.length + '</span></a>';
    tags.forEach(function(t) {
      html += '<a class="pub-tag" data-tag="' + escHtml(t) + '">' + escHtml(t) + ' <span class="tag-count">' + tagCount[t] + '</span></a>';
    });
    html += '</div>';
    bar.innerHTML = html;

    bar.querySelectorAll('.pub-tag').forEach(function(el) {
      el.addEventListener('click', function() {
        bar.querySelectorAll('.pub-tag').forEach(function(e){ e.classList.remove('active'); });
        el.classList.add('active');
        activeTag = el.getAttribute('data-tag');
        renderPubGroups(publications);
      });
    });
  }

  function renderPubGroups(publications) {
    var filtered = activeTag && activeTag !== '__all__'
      ? publications.filter(function(p){ return (p.tag || []).indexOf(activeTag) !== -1; })
      : publications;

    // Sort within each type by date descending
    var grouped = {};
    filtered.forEach(function(p) {
      var t = p.type || 'Other';
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(p);
    });
    TYPE_ORDER.forEach(function(t) {
      if (grouped[t]) {
        grouped[t].sort(function(a, b) { return String(b.date).localeCompare(String(a.date)); });
      }
    });

    var container = document.getElementById('pub-groups');
    var html = '';
    var counter = 1;

    TYPE_ORDER.forEach(function(type) {
      if (!grouped[type] || grouped[type].length === 0) return;
      html += '<div class="pub-group">';
      html += '<h3 class="pub-group-title">' + escHtml(TYPE_LABELS[type] || type) + '</h3>';
      html += '<ol class="pub-list">';
      grouped[type].forEach(function(p) {
        var authorsHtml = formatAuthors(p.authors || '', p.corresponding_author || '');
        html += '<li class="pub-item">';
        html += '<div class="pub-entry">';
        // Title with link
        if (p.link) {
          html += '<div class="pub-title"><a href="' + escHtml(p.link) + '" target="_blank">' + escHtml(p.title) + '</a></div>';
        } else {
          html += '<div class="pub-title">' + escHtml(p.title) + '</div>';
        }
        html += '<div class="pub-authors">' + authorsHtml + '</div>';
        var meta = [];
        if (p.venue) meta.push('<em>' + escHtml(p.venue) + '</em>');
        if (p.date) meta.push(escHtml(String(p.date)));
        if (meta.length) html += '<div class="pub-meta">' + meta.join(', ') + '</div>';
        html += '</div>';
        html += '</li>';
        counter++;
      });
      html += '</ol></div>';
    });

    if (!html) html = '<p><em>No publications match this tag.</em></p>';
    container.innerHTML = html;
  }

  function renderTalks(presentations) {
    var container = document.getElementById('talks-list');
    if (!presentations || presentations.length === 0) {
      container.innerHTML = '<p><em>Coming soon.</em></p>';
      return;
    }
    // Sort by date descending (date strings like "Oct. 2025")
    var sorted = presentations.slice().sort(function(a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    var html = '<ul class="talks-list">';
    sorted.forEach(function(t) {
      html += '<li class="talk-item">';
      html += '<span class="talk-type talk-type-' + (t.type || '').toLowerCase() + '">' + escHtml(t.type || '') + '</span> ';
      html += '<strong>' + escHtml(t.title) + '</strong>';
      var meta = [];
      if (t.venue) meta.push(escHtml(t.venue));
      if (t.place) meta.push(escHtml(t.place));
      if (t.date) meta.push(escHtml(t.date));
      if (meta.length) html += '<br/><span class="talk-meta">' + meta.join(' · ') + '</span>';
      html += '</li>';
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  function initPublicationsTab() {
    if (pubTabInited) return;
    pubTabInited = true;

    var dataEl = document.getElementById('pub-data');
    if (!dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch(e) { return; }

    activeTag = '__all__';
    renderTagBar(data.publications || []);
    renderPubGroups(data.publications || []);
    renderTalks(data.presentations || []);
  }
});
