# Generated by Django 2.1.7 on 2019-09-17 02:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('servicios', '0005_auto_20190917_0223'),
    ]

    operations = [
        migrations.RenameField(
            model_name='servicio',
            old_name='Proveedor',
            new_name='proveedor',
        ),
    ]
