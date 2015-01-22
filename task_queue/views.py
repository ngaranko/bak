from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required

import django_rq
import json
from time import strftime
from task_queue import tasks
from rq import use_connection
from rq_scheduler import Scheduler
from datetime import datetime


@staff_member_required
def add_task(request):
    import django_rq
    task = request.GET.get('task')
    parameters = request.GET.get('parameters')
    queue_to_be_added_to = request.GET.get('queue')
    queue = django_rq.get_queue(queue_to_be_added_to)

    if parameters:
        queue.enqueue(getattr(tasks, task), args=(parameters,), timeout=7200)
    else:
        queue.enqueue(getattr(tasks, task), timeout=7200)
    return HttpResponse('Success')


@staff_member_required
def start_worker_with_supervisor(request):
    from django.core.management import call_command

    action = request.GET.get('action')
    worker_program = request.GET.get('worker_program')

    list = [action, worker_program]
    call_command('supervisor', *list)

    return HttpResponse('Success')


@staff_member_required
def get_workers(request):
    from rq import Worker, push_connection
    import redis
    import json

    connection = redis.Redis()
    push_connection(connection)
    workers = Worker.all(connection=connection)

    workerdata = list()
    # serialize workers
    for w in workers:
        cj = w.get_current_job()

        if cj:
            cjinfo = {'id' : cj.id, 'args' : cj.args, 'enqueued_at' : cj.enqueued_at.strftime("%a, %d %b %Y %H:%M:%S +0000"), 'description' : cj.description}
        else:
            cjinfo = None

        worker_dict = {'pid': w.pid, 'name': w.name, 'state': w.get_state(), 'current_job': cjinfo}
        workerdata.append(worker_dict)
    data = json.dumps(workerdata)
    return HttpResponse(data, content_type='application/json')


@staff_member_required
def delete_task_from_queue(request):
    job_id = request.GET.get('job_id')
    tasks.delete_task_from_queue(job_id)
    return HttpResponse('Success')


@staff_member_required
def delete_all_tasks_from_queue(request):
    queue_name = request.GET.get('queue_name')
    tasks.delete_all_tasks_from_queue(queue_name)
    return HttpResponse('Success')


@staff_member_required
def get_current_job(request):
    from rq import get_current_job
    from rq import use_connection
    from redis import Redis
    from rq import Queue
    use_connection()
    redis_conn = Redis()
    q = Queue(connection=redis_conn)
    job = get_current_job(q)
    import json
    data = json.dumps(job)
    return HttpResponse(data, content_type='application/json')


@staff_member_required
def test(request):
    from rq import get_current_job
    job = get_current_job()
    import json
    return json.dumps(job)


@staff_member_required
def start_scheduler(request):
    from rq_scheduler.scripts import rqscheduler
    rqscheduler.main()
    return HttpResponse('Success')


@staff_member_required
def add_scheduled_task(request):
    task = request.GET.get('task')
    period = request.GET.get('period')
    queue = request.GET.get('queue')
    parameters = request.GET.get('parameters')

    scheduler = django_rq.get_scheduler('default')

    if parameters:
        scheduler.schedule(
            scheduled_time=datetime.now(),   # Time for first execution
            func=getattr(tasks, task),       # Function to be queued
            args=[int(parameters)],
            interval=period,  # Time before the function is called again, in seconds
            repeat=None  # Repeat this number of times (None means repeat forever)
        )
    else:
        scheduler.schedule(
            scheduled_time=datetime.now(),   # Time for first execution
            func=getattr(tasks, task),           # Function to be queued
            interval=period,                 # Time before the function is called again, in seconds
            repeat=None                      # Repeat this number of times (None means repeat forever)
        )
    return HttpResponse('Success')


@staff_member_required
def get_queue(request):
    current_queue = request.GET.get('queue', 'default')
    queue = django_rq.get_queue(current_queue)
    jobdata = list()

    count_jobs = 0
    for job in queue.jobs:
        count_jobs += 1
        if count_jobs == 20:
            break

        job_dict = { 'job_id': job._id, 'created_at':job.created_at.strftime("%a, %d %b %Y %H:%M:%S +0000"), 'enqueued_at':job.enqueued_at.strftime("%a, %d %b %Y %H:%M:%S +0000"), 'status': job.get_status(), 'function': job.func_name, 'args': job.args}
        jobdata.append(job_dict)
    data = json.dumps(jobdata)
    return HttpResponse(data, content_type='application/json')


@staff_member_required
def get_scheduled_tasks(request):
    scheduler = django_rq.get_scheduler('default')
    list_of_job_instances = scheduler.get_jobs()

    jobdata = list()
    for job in list_of_job_instances:
        if "interval" in job.meta:
            interval = job.meta["interval"]
        else:
            interval = 0
        job_dict = { 'job_id': job._id, 'task': job.description, 'period': interval, 'args': job.args, 'queue': "default" }
        jobdata.append(job_dict)

    # scheduler = Scheduler('parser') # Get a scheduler for the "parser" queue
    # list_of_job_instances = scheduler.get_jobs()
    #
    # for job in list_of_job_instances:
    #     if "interval" in job.meta:
    #         interval = job.meta["interval"]
    #     else:
    #         interval = 0
    #     job_dict = { 'job_id': job._id, 'task': job.description, 'period': interval, 'queue': "parser" }
    #     jobdata.append(job_dict)

    data = json.dumps(jobdata)
    return HttpResponse(data, content_type='application/json')


@staff_member_required
def cancel_scheduled_task(request):
    job_id = request.GET.get('job_id')

    scheduler = django_rq.get_scheduler('default')
    scheduler.cancel(job_id)
    return HttpResponse('Success')


def get_failed_tasks(request):
    queue = django_rq.get_failed_queue()

    jobdata = list()
    for job in queue.jobs:
        job_dict = {
            'job_id': job.id,
            'func_name': job.func_name,
            'error_message': job.exc_info,
            'ended_at': job.ended_at.strftime("%a, %d %b %Y %H:%M:%S +0000"),
            'enqueued_at' : job.enqueued_at.strftime(
                "%a, %d %b %Y %H:%M:%S +0000"),
        }
        jobdata.append(job_dict)

    data = json.dumps(jobdata)
    return HttpResponse(data, content_type='application/json')



@staff_member_required
def reschedule_all_failed(request):

    from rq import requeue_job
    from rq import get_failed_queue
    from django_rq import get_connection

    queue = get_failed_queue(get_connection())

    for job in queue.jobs:
        requeue_job(job.id, connection=queue.connection)

    return HttpResponse('Success')
