#!/bin/bash

if grep -Fxq "cd /vagrant" /home/vagrant/.bashrc; then
    echo "Skip: .bashrc already updated"
else
    echo "Updating .bashrc..."
    echo "cd /vagrant" >> /home/vagrant/.bashrc
    echo "source /home/vagrant/.env/bin/activate" >> /home/vagrant/.bashrc
    echo " - Done."
fi
