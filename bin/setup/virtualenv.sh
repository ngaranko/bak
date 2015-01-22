#!/bin/bash

if [ ! -f /home/vagrant/.provisioned ]; then
    virtualenv /home/vagrant/.env/
    /home/vagrant/.env/bin/pip install -r /vagrant/etc/requirements.txt
fi
