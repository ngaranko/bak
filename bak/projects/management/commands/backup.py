from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from bak.projects.models import Project
from bak.actions.dump_db import dump_database
from bak.actions.dump_directory import rsync_directory
from bak.actions.exceptions import ActionError


class Command(BaseCommand):
    can_import_settings = True

    def handle(self, *args, **options):
        for project in Project.objects.all():
            self.stdout.write("Project: {name}".format(name=project.name))
            if project.dump_db:
                self.stdout.write(" - Dump DB!")

                # TODO: Wrap this call
                dump_database(project)

            if project.dump_base_dir:
                self.stdout.write(" - Dump base dir!")

                try:
                    result = rsync_directory(project)
                except ActionError, e:
                    raise CommandError(e)
                else:
                    self.stdout.write('  - rsync result: {result}'.format(
                        result=result))
