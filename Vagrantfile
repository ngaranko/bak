# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "ubuntu/trusty64"

    # Provisioning
    config.vm.provision "shell", path: "bin/setup/system_dependencies.sh"
    config.vm.provision "shell", path: "bin/setup/virtualenv.sh", privileged: false
    config.vm.provision "shell", path: "bin/setup/sync_db.sh", privileged: false
    config.vm.provision "shell", path: "bin/setup/update_bashrc.sh", privileged: false

    # Start server
    config.vm.provision "shell", path: "bin/setup/serve.sh", privileged: false, run: "always"

    config.vm.network "forwarded_port", guest: 8080, host: 20088

    config.vm.define "bak" do |bak|
    end
end
