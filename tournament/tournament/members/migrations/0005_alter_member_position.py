# Generated by Django 5.0.4 on 2024-04-25 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0004_rename_firstname_member_username_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='member',
            name='position',
            field=models.IntegerField(default='0'),
        ),
    ]