# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField()),
                ('host', models.CharField(max_length=255)),
                ('base_dir', models.CharField(max_length=255)),
                ('db_dump_dir', models.CharField(max_length=255, null=True, blank=True)),
                ('db_name', models.CharField(max_length=255, null=True, blank=True)),
                ('db_user', models.CharField(max_length=255, null=True, blank=True)),
                ('db_pass', models.CharField(max_length=255, null=True, blank=True)),
                ('dump_db', models.BooleanField(default=False)),
                ('dump_base_dir', models.BooleanField(default=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
