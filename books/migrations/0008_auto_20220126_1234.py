# Generated by Django 3.1.11 on 2022-01-26 07:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0007_auto_20220126_1227'),
    ]

    operations = [
        migrations.RenameField(
            model_name='images',
            old_name='book',
            new_name='page',
        ),
    ]
