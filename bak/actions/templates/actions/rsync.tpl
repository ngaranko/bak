mkdir -p {{ BACKUPS_DIR }}/{{ project.slug }}/{% now "Y/m/d" %}/
rsync -avzP -e ssh {{ project.host }}:{{ project.base_dir }}/ {{ BACKUPS_DIR }}/{{ project.slug }}/{% now "Y/m/d" %}/