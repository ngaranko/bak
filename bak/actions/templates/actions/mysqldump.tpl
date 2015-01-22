mkdir -p {{ project.db_dump_dir }}
mysqldump{% if project.db_user %} -u {{ project.db_user }}{% endif %}{% if project.db_pass %} -p'{{ project.db_pass|safe }}'{% endif %}{% if project.db_name %} {{ project.db_name }}{% else %} --all-databases{% endif %} > {{ project.db_dump_dir }}/{{ project.slug }}.{% now "Y.m.d" %}-dump.sql
