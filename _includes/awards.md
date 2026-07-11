<div id="section-awards">
<h2>Awards</h2>
<h3>Personal Awards</h3>
<ul>
{% for item in site.data.awards.personal %}
<li>{{ item.year }} {{ item.title }}{% if item.supervisor %}<br/>Supervised by Prof. <a href="{{ item.supervisor_url }}">{{ item.supervisor }}</a>{% endif %}</li>
{% endfor %}
</ul>

<h3>Supervised Student Awards</h3>
<ul>
{% for item in site.data.awards.supervised %}
<li>{{ item.year }} {{ item.title }}{% if item.co_supervisor %} with co-supervisor {{ item.co_supervisor }}{% endif %}</li>
{% endfor %}
</ul>
</div>
