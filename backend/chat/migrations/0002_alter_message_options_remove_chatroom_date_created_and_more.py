# Generated by Django 4.1 on 2022-08-26 21:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ('-id',)},
        ),
        migrations.RemoveField(
            model_name='chatroom',
            name='date_created',
        ),
        migrations.AddField(
            model_name='chatroom',
            name='last_message',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='chat.message'),
        ),
        migrations.AddField(
            model_name='chatroom',
            name='timestamp',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
