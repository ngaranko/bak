#!/bin/bash

if [ ! -f /vagrant/etc/supervisor.pid ]; then
    /home/vagrant/.env/bin/python /vagrant/bin/manage.py supervisor --pidfile=/vagrant/etc/supervisor.pid --project-dir=/vagrant/bin --logfile=/vagrant/log/supervisor.log --daemonize
fi
