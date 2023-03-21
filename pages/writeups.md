---
layout: page
title: Writeups
permalink: /writeups/
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/css/lil-bootstrap.css">

<div class="row">
{% for post in site.posts %}
  {% if post.categories contains 'writeups' %}
    <div class="mb-4">
      <div class="card h-100">
        <a href="{{ post.url }}"><img class="card-img-top" src="{{ post.image }}" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="{{ post.url }}">{{ post.title }}</a>
          </h4>
          <p class="card-text">{{ post.description }}</p>
          <p class="card-text"><small class="text-muted"><i class="far fa-calendar-alt"></i> {{ post.date | date: "%b %d, %Y" }} • <i class="fas fa-clock"></i><i> {{ post.reading }} reading</i> • <i class="fas fa-user"></i> {{ post.author }}</small>
          {% case post.difficulty %}
            {% when "easy" %}{% assign badge_color = "success" %}
            {% when "medium" %}{% assign badge_color = "warning" %}
            {% when "hard" %}{% assign badge_color = "danger" %}
          {% endcase %}
          {% if badge_color %}
          <div class='badge-section'>
            <span class="badge badge-{{ badge_color }}">{{ post.difficulty }}</span>
          {% endif %}
          {% if post.subject %}
            <span class="badge badge-primary">{{ post.subject }}</span>
          </div>
        {% endif %}
        </p>
        </div>
      </div>
    </div>
  {% endif %}
{% endfor %}
</div>
