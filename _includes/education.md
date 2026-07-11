<div id="section-education">
<h2>Education</h2>
<ul>
{% for item in site.data.education %}
<li>{{ item.degree }}, {{ item.school }}, {{ item.year }}<br/>
Supervised by {% for sup in item.supervisors %}{% if forloop.index > 1 %} and {% endif %}Prof. <a href="{{ sup.url }}">{{ sup.name }}</a>{% endfor %}</li>
{% endfor %}
</ul>
</div>
