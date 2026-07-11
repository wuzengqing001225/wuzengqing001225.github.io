<div id="section-services">
<h2>Experience & Services</h2>
{% for group in site.data.services %}
<h4 style="margin:0 10px 0;">{{ group.category }}</h4>
<ul style="margin:0 0 5px;">
{% for item in group.items %}
  <li>{{ item }}</li>
{% endfor %}
</ul>
{% endfor %}
</div>
