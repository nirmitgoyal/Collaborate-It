# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Code',
            fields=[
                ('code', models.TextField()),
                ('url', models.CharField(max_length=100, serialize=False, primary_key=True)),
                ('email', models.EmailField(unique=True, max_length=75)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
