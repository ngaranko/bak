#!/bin/bash

if [ ! -f /home/vagrant/.provisioned ]; then
    /home/vagrant/.env/bin/python /vagrant/bin/manage.py syncdb --noinput
    /home/vagrant/.env/bin/python /vagrant/bin/manage.py loaddata /vagrant/etc/superuser.json
fi


touch /home/vagrant/.provisioned
