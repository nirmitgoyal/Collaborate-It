#!/usr/bin/env python
from django.conf.urls import url

from . import views

app_name = 'collaborateit'

urlpatterns = [
  # ex: /
  url(r'^$', views.index, name='index'),
  # ex: /compile/
  url(r'^compile/$', views.compileCode, name='compile'),
  # ex: /run/
  url(r'^run/$', views.runCode, name='run'),
  # ex: /code=ajSkHb/
  # url(r'(?P<code_id>\w{0,50})/$', views.savedCodeView, name='saved-code'),
]
