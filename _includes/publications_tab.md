{% comment %} Publications tab content — rendered by Liquid, filtered by JS {% endcomment %}

<div id="tab-publications" class="tab-content" style="display:none;">

  <h2>Publications</h2>
  <p class="pub-note"><em>Underline indicates corresponding author.</em></p>

  {% comment %} Collect unique tags {% endcomment %}
  {% assign all_tags = "" %}
  {% for p in site.data.publication.publications %}
    {% for t in p.tag %}
      {% unless all_tags contains t %}
        {% if all_tags != "" %}{% assign all_tags = all_tags | append: "||" %}{% endif %}
        {% assign all_tags = all_tags | append: t %}
      {% endunless %}
    {% endfor %}
  {% endfor %}
  {% assign tag_list = all_tags | split: "||" %}

  {% comment %} Build sortable keys: (1000+count)::tag::count for descending count sort {% endcomment %}
  {% assign sort_blob = "" %}
  {% for t in tag_list %}
    {% assign count = 0 %}
    {% for p in site.data.publication.publications %}
      {% if p.tag contains t %}{% assign count = count | plus: 1 %}{% endif %}
    {% endfor %}
    {% assign sort_key = count | plus: 1000 %}
    {% if sort_blob != "" %}{% assign sort_blob = sort_blob | append: "||" %}{% endif %}
    {% assign sort_blob = sort_blob | append: sort_key | append: "::" | append: t | append: "::" | append: count %}
  {% endfor %}
  {% assign sorted_tags = sort_blob | split: "||" | sort | reverse %}

  <div id="pub-tag-bar" class="tag-bar">
    <a class="pub-tag active" data-tag="__all__" href="javascript:void(0)">All <span class="tag-count">{{ site.data.publication.publications.size }}</span></a>
    {% for entry in sorted_tags %}
      {% assign parts = entry | split: "::" %}
      {% assign t = parts[1] %}
      {% assign count = parts[2] %}
      <a class="pub-tag" data-tag="{{ t }}" href="javascript:void(0)">{{ t }} <span class="tag-count">{{ count }}</span></a>
    {% endfor %}
  </div>

  {% assign type_order = "Conference,Local Conference,Journal,Local Journal,Preprint" | split: "," %}
  {% assign type_labels = "Conference Papers,Journal Articles,Preprints,Local Conference Papers,Local Journal Articles" | split: "," %}

  <div id="pub-groups">
  {% for type_name in type_order %}
    {% assign type_label = type_labels[forloop.index0] %}
    {% assign type_pubs = site.data.publication.publications | where: "type", type_name %}
    {% assign type_pubs = type_pubs | sort: "date" | reverse %}
    {% if type_pubs.size > 0 %}
    <div class="pub-group" data-type="{{ type_name }}">
      <h3 class="pub-group-title">{{ type_label }}</h3>
      <ol class="pub-list">
      {% for p in type_pubs %}
        <li class="pub-item" data-tags="{{ p.tag | join: '|' }}">
          <div class="pub-entry">
            <div class="pub-title">{% if p.link %}<a href="{{ p.link }}" target="_blank" rel="noopener">{{ p.title }}</a>{% else %}{{ p.title }}{% endif %}</div>
            <div class="pub-authors">
              {% assign corr = p.corresponding_author | default: "" %}
              {% assign me_is_corr = false %}
              {% if corr contains "Wu, Z" %}{% assign me_is_corr = true %}{% endif %}
              {% if me_is_corr %}
                {{ p.authors | replace: "Wu, Z.", '<span class="author-corresponding"><strong>Wu, Z.</strong></span>' }}
              {% else %}
                {{ p.authors | replace: "Wu, Z.", '<strong>Wu, Z.</strong>' }}
              {% endif %}
            </div>
            <div class="pub-meta">
              {% if p.venue %}<em>{{ p.venue }}</em>{% endif %}{% if p.venue and p.date %}, {% endif %}{% if p.date %}{{ p.date }}{% endif %}
              {% if p.tag %}
                <span class="pub-item-tags">{% for t in p.tag %}<span class="pub-item-tag">{{ t }}</span>{% endfor %}</span>
              {% endif %}
            </div>
          </div>
        </li>
      {% endfor %}
      </ol>
    </div>
    {% endif %}
  {% endfor %}
  </div>

  <h2 class="talks-heading">Talks</h2>
  <ul class="talks-list">
  {% for t in site.data.publication.presentations %}
    <li class="talk-item">
      <span class="talk-type talk-type-{{ t.type | downcase }}">{{ t.type }}</span>
      <strong>{{ t.title }}</strong>
      <br/><span class="talk-meta">{{ t.venue }}{% if t.place %} · {{ t.place }}{% endif %}{% if t.date %} · {{ t.date }}{% endif %}</span>
    </li>
  {% endfor %}
  </ul>

</div>
