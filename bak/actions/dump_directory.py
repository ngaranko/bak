from django.conf import settings
from django.template.loader import render_to_string
from fabric.api import local
from fabric.api import settings as fab_settings
from bak.actions.exceptions import ActionError


def rsync_directory(project):
    """
    Rsync directory into settings.BACKUPS_DIR
    """
    command = render_to_string('actions/rsync.tpl', dict(
        project=project,
        BACKUPS_DIR=settings.BACKUPS_DIR))

    result = None
    with fab_settings(warn_only=True):
        result = local(command, capture=True)
        if result.failed:
            raise ActionError("rsync command failed: {result}".format(
                result=result))
    return result
