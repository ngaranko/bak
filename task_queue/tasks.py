from django_rq import job
import django_rq

from rq import cancel_job
from rq import Connection
from bak.projects.models import Project
from bak.actions.dump_db import dump_database
from bak.actions.dump_directory import rsync_directory
from bak.actions.exceptions import ActionError


@job
def backup():
    """
    Run backup for all projects
    """
    for project in Project.objects.all():
        print("Project: {name}".format(name=project.name))
        if project.dump_db:
            print(" - Dump DB!")

            # TODO: Wrap this call
            dump_database(project)

        if project.dump_base_dir:
            print(" - Dump base dir!")

            try:
                result = rsync_directory(project)
            except ActionError, e:
                pass
            else:
                print('  - rsync result: {result}'.format(
                    result=result))


def delete_task_from_queue(job_id):
    """
    Remove task from queue
    """
    with Connection():
        cancel_job(job_id)


def delete_all_tasks_from_queue(queue_name):
    """
    Clean queue
    """
    if queue_name == "failed":
        q = django_rq.get_failed_queue()
    elif queue_name == "parser":
        q = django_rq.get_queue("parser")
    else:
        q = django_rq.get_queue("default")

    while True:
        job = q.dequeue()
        if not job:
            break
        job.delete()
