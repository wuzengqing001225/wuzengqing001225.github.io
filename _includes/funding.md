<div id="section-funding" style="margin-top: 2em;">
<h2 id="section-funding-heading">Funding</h2>
{% if site.data.funding and site.data.funding.size > 0 %}
<ul>
{% for item in site.data.funding %}
<li><strong>{{ item.year }}</strong> {{ item.title }}{% if item.agency %}, {{ item.agency }}{% endif %}{% if item.role %} ({{ item.role }}){% endif %}{% if item.amount %} — {{ item.amount }}{% endif %}{% if item.note %}<br/><em>{{ item.note }}</em>{% endif %}</li>
{% endfor %}
</ul>
{% else %}
<p><em>Coming soon.</em></p>
{% endif %}
</div>
