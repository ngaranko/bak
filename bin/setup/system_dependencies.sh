#!/bin/bash

if [ ! -f /home/vagrant/.provisioned ]; then
    apt-get install -y python-dev
    apt-get install -y python-setuptools
    apt-get install -y redis-server

    # pip and virtualenv
    easy_install pip
    pip install virtualenv
fi
