# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='email',
            field=models.EmailField(max_length=75),
            preserve_default=True,
        ),
    ]
