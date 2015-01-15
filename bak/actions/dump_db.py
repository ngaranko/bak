from django.conf import settings
from django.template.loader import render_to_string
from fabric.api import env
from fabric.api import run
from bak.actions.exceptions import ActionError


def dump_database(project):
    """
    Dumps database for a project
    """
    env.use_ssh_config = True
    env.host_string = str(project.host)

    command = render_to_string('actions/mysqldump.tpl', dict(
        project=project,
        BACKUPS_DIR=settings.BACKUPS_DIR))

    result = run(command)
    if result.failed:
        raise ActionError("mysqldump command failed: {result}".format(
                result=result))
    return result
