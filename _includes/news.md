<div id="section-news">
<h2>News</h2>
<div id="news-list" class="paginated-list">
<ul>
{% for item in site.data.news %}
<li><strong>[{{ item.date }}]</strong> {{ item.content }}{% if item.links %}{% for link in item.links %} <a href="{{ link.url }}">[{{ link.label }}]</a>{% endfor %}{% endif %}</li>
{% endfor %}
</ul>
</div>
<div class="pagination" id="news-pagination"></div>
</div>
