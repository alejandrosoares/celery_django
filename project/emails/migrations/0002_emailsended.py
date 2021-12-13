# Generated by Django 3.2.9 on 2021-12-10 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emails', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailSended',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='Date')),
            ],
        ),
    ]
