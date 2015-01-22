from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    '',
    url(r'^', include(admin.site.urls)),
    url(r'^queue/', include('django_rq.urls')),
    url(r'^task_queue/', include('task_queue.urls')),
)
