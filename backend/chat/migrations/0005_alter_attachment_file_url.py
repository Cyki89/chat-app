# Generated by Django 4.1 on 2022-08-31 02:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_attachment_file_url_attachment_messages_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachment',
            name='file_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
