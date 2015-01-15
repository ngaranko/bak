from django.db import models


class Project(models.Model):
    """
    Describes project information
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    host = models.CharField(max_length=255)
    base_dir = models.CharField(max_length=255)
    db_dump_dir = models.CharField(max_length=255, blank=True, null=True)
    db_name = models.CharField(max_length=255, blank=True, null=True)
    db_user = models.CharField(max_length=255, blank=True, null=True)
    db_pass = models.CharField(max_length=255, blank=True, null=True)
    dump_db = models.BooleanField(default=False)
    dump_base_dir = models.BooleanField(default=True)

    def __unicode__(self):
        return self.name
