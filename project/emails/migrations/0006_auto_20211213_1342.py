# Generated by Django 3.2.9 on 2021-12-13 13:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('emails', '0005_alter_emaillist_emails'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Email',
        ),
        migrations.DeleteModel(
            name='EmailList',
        ),
    ]
