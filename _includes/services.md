<div id="section-services">
<h2>Experience & Services</h2>
{% for group in site.data.services %}
<h4 class="services-category">{{ group.category }}</h4>
<ul class="services-list">
{% for item in group.items %}
  <li>{{ item }}</li>
{% endfor %}
</ul>
{% endfor %}
</div>
