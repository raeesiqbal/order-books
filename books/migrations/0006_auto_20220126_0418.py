# Generated by Django 3.1.11 on 2022-01-25 23:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0005_auto_20220126_0417'),
    ]

    operations = [
        migrations.AlterField(
            model_name='books',
            name='cover',
            field=models.ImageField(upload_to='books'),
        ),
    ]
