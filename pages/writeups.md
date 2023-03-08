---
layout: page
title: Writeups
permalink: /writeups/
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">

<div class="row">
{% for post in site.posts %}
  {% if post.categories contains 'writeups' %}
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card h-100">
        <a href="{{ post.url }}"><img class="card-img-top" src="{{ post.image }}" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="{{ post.url }}">{{ post.title }}</a>
          </h4>
          <p class="card-text">{{ post.description }}</p>
          <p class="card-text"><small class="text-muted"><i class="far fa-calendar-alt"></i> {{ post.date | date: "%b %d, %Y" }} • {{ post.author }}</small></p>
        </div>
      </div>
    </div>
  {% endif %}
{% endfor %}
</div>