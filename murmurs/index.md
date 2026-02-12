---
layout: page
title: 独り言
description: エッセイ、日記、思いつき。
---

<p class="muted">
ここには、エッセイ・日記などを静かに置いていきます。
</p>

<ul class="post-list">
{% assign murmurs = site.murmurs | sort: "date" | reverse %}
{% for post in murmurs %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="muted small">— {{ post.date | date: "%Y-%m-%d" }}</span>
  </li>
{% endfor %}
</ul>
