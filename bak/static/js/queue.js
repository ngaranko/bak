
$(document).ready(function (){



    $('#clear-failed-tasks').click(function(e){
        e.preventDefault();
        var btn = $('#clear-failed-tasks');

        $.ajax({
            type: "GET",
            url: '/task_queue/delete_all_tasks_from_queue/',
            data: { queue_name: "failed"},
            beforeSend: function() {
                btn.text("Clearing...");
            },
            statusCode: {
                200: function() {
                    btn.text("Cleared failed tasks");
                    fill_failed_tasks();
                },
                404: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("404 error...");
                },
                500: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("500 error...");
                }
            }
        });
    });

    $('#requeue-all-failed-tasks').click(function(e){
        e.preventDefault();
        var btn = $('#requeue-all-failed-tasks');

        $.ajax({
            type: "GET",
            url: '/task_queue/reschedule_all_failed/',
            beforeSend: function() {
                btn.text("Re-queueing...");
            },
            statusCode: {
                200: function() {
                    btn.text("Re-queued failed tasks");
                    reload_task_queue_overview_table();
                    fill_failed_tasks();
                },
                404: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("404 error...");
                },
                500: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("500 error...");
                }
            }
        });
    });

    $('#clear-default-queue').click(function(e){
        e.preventDefault();
        var btn = $('#clear-default-queue');

        $.ajax({
            type: "GET",
            url: '/task_queue/delete_all_tasks_from_queue/',
            data: { queue_name: "default"},
            beforeSend: function() {
                btn.text("Clearing...");
            },
            statusCode: {
                200: function() {
                    btn.text("Cleared default queue");
                    fill_default_queue();
                },
                404: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("404 error...");
                },
                500: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("500 error...");
                }
            }
        });
    });

    $('#clear-parser-queue').click(function(e){
        e.preventDefault();
        var btn = $('#clear-parser-queue');

        $.ajax({
            type: "GET",
            url: '/task_queue/delete_all_tasks_from_queue/',
            data: { queue_name: "parser"},
            beforeSend: function() {
                btn.text("Clearing...");
            },
            statusCode: {
                200: function() {
                    btn.text("Cleared parser queue");
                    fill_parser_queue();
                },
                404: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("404 error...");
                },
                500: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("500 error...");
                }
            }
        });
    });



    $('select[name="new-schedule-task"]').change(function(){
        if ($(this).val() == "parse_all_not_parsed_in_x_days"){
            $('#add-scheduled-task-input-parameters-wrapper').show(500);
        } else {
            $("#add-scheduled-task-input-parameters-wrapper").hide(500);
        }
    });

    $('#new-schedule-submit').click(function(){

        var jobname = $('input[name="new-schedule-jobname"]').val();
        var task = $('select[name="new-schedule-task"]').val();
        var period = $('select[name="new-schedule-period"]').val();
        var parameters = null;

        if (task == "parse_all_not_parsed_in_x_days"){
            parameters = $('input[name="add-scheduled-task-default-parameters"]').val();
        }

        var btn = $('#new-schedule-submit');

        $.ajax({
            type: "GET",
            url: "/task_queue/add_scheduled_task/",
            data: {
                jobname: jobname,
                task: task,
                period: period,
                parameters: parameters
            },
            success: function (data) {
                fill_scheduled_tasks();
            },
            beforeSend: function() {
                btn.removeClass("btn-info");
                btn.addClass("btn-warning");
                btn.text("Adding");
            },
            statusCode: {
                200: function() {
                    btn.addClass("btn-info");
                    btn.text("Add");
                },
                404: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("404 error...");
                },
                500: function() {
                    btn.removeClass("btn-info");
                    btn.addClass("btn-danger");
                    btn.text("500 error...");
                }
            }

        });

    });

    function fill_scheduled_tasks(){

        $.ajax({
            type: "GET",
            url: "/task_queue/get_scheduled_tasks/",
            success: function (data) {

                scheduled_tasks_html = "";

                $.each(data, function( index, value ) {
                    scheduled_tasks_html += "<tr>";
                    scheduled_tasks_html += "<td>" + value.job_id + "</td>";
                    scheduled_tasks_html += "<td>" + seconds_to_time_names(value.period) + "</td>";
                    scheduled_tasks_html += "<td>" + value.task + "</td>";
                    scheduled_tasks_html += "<td>" + value.queue + "</td>";
                    scheduled_tasks_html += "<td>" + value.args + "</td>";
                    scheduled_tasks_html += '<td><a href="/task_queue/cancel_scheduled_task/?job_id=' + value.job_id + '" class="delete-scheduled-task">Delete</a></td>';
                    scheduled_tasks_html += "</tr>";
                });

                $('#scheduled-tasks-table tbody').html(scheduled_tasks_html);
                load_listeners();
            }
        });


    }

    function seconds_to_time_names(seconds){
        if (seconds == 3600){return "Hour";}
        if (seconds == 86400){return "Day";}
        if (seconds == 604800){return "Week";}
        if (seconds == 2624832){return "Month";}
        return seconds + " seconds";
    }

    fill_scheduled_tasks();



    function fill_failed_tasks(){

        $.ajax({
            type: "GET",
            url: "/task_queue/get_failed_tasks/",
            success: function (data) {

                scheduled_tasks_html = "";

                $.each(data, function( index, value ) {
                    scheduled_tasks_html += "<tr>";
                    scheduled_tasks_html += "<td>" + value.job_id + "</td>";
                    scheduled_tasks_html += "<td>" + value.func_name + "</td>";
                    scheduled_tasks_html += "<td>" + value.enqueued_at + "</td>";
                    scheduled_tasks_html += "<td>" + value.ended_at + "</td>";
                    scheduled_tasks_html += "<td><a href='#' class='error-details-link'>View error details</a></td>";
                    scheduled_tasks_html += '<td><a href="/task_queue/delete_task_from_queue/?job_id=' + value.job_id + '" class="delete-failed-task">Delete</a></td>';
                    scheduled_tasks_html += "</tr>";
                    scheduled_tasks_html += "<tr class='error-details-tr'>";
                    scheduled_tasks_html += "<td colspan='5' style='background-color: #fcf8e3; padding-bottom: 2em; padding-top: 2em;'>" + value.error_message.replace(/\n/g, "<br>") + "</td>";
                    scheduled_tasks_html += "</tr>";
                });

                $('#failed-tasks-table tbody').html(scheduled_tasks_html);
                load_listeners();
            }
        });

    }

    fill_failed_tasks();


    function fill_default_queue(){

        $.ajax({
            type: "GET",
            url: "/task_queue/get_queue/",
            data: {
                "queue": "default"
            },
            success: function (data) {

                scheduled_tasks_html = "";

                $.each(data, function( index, value ) {
                    scheduled_tasks_html += "<tr>";
                    scheduled_tasks_html += "<td>" + value.job_id + "</td>";
                    scheduled_tasks_html += "<td>" + value.created_at + "</td>";
                    scheduled_tasks_html += "<td>" + value.enqueued_at + "</td>";
                    scheduled_tasks_html += "<td>" + value.status + "</td>";
                    scheduled_tasks_html += "<td>" + value.function + "</td>";
                    scheduled_tasks_html += "<td>" + value.args + "</td>";
                    scheduled_tasks_html += '<td><a href="/task_queue/delete_task_from_queue/?job_id=' + value.job_id + '" class="delete-default-task">delete</a></td>';
                    scheduled_tasks_html += "</tr>";
                });

                $('#default-tasks-table tbody').html(scheduled_tasks_html);
                load_listeners();
            }
        });

    }

    fill_default_queue();








    function fill_workers(){

        $.ajax({
            type: "GET",
            url: "/task_queue/get_workers/",
            success: function (data) {

                workers_html = "";

                $.each(data, function( index, value ) {
                    console.log(value);
                    workers_html += "<tr>";
                    workers_html += "<td>" + value.pid + "</td>";
                    workers_html += "<td>" + value.name + "</td>";
                    workers_html += "<td>" + value.state + "</td>";

                    if (value.current_job == null){
                        description = "None";
                    } else {
                        description = value.current_job.description;
                    }

                    workers_html += "<td>" + description + "</td>";
                    workers_html += "</tr>";
                });

                $('#workers-table tbody').html(workers_html);
                load_listeners();
            }
        });

    }

    fill_workers();

$('#django-rq-add-task-link').click(function(e){
    e.preventDefault();
    $('.django-rq-block.block-add-new-task').show(500);
});

$('#django-rq-add-scheduled-task-link').click(function(e){
    e.preventDefault();
    $('.django-rq-block.block-schedule-new-task').show(500);
});


$('#close-schedule-new-task').click(function(e){
    e.preventDefault();
    $('.block-schedule-new-task').hide(500);
});

$('#close-add-new-task').click(function(e){
    e.preventDefault();
    $('.block-add-new-task').hide(500);
});


function reload_task_queue_overview_table(){
    $( "#task-queue-overview-table-wrapper" ).load( "/queue/ #task-queue-overview-table",function(){

        // $( "#task-queue-overview-table-wrapper tbody" ).animate({
        //     opacity: 0.5
        // }, {
        //     duration: 100,
        //     easing: "easeOutQuad",
        //     complete: function() {
        //         $( "#task-queue-overview-table-wrapper tbody" ).animate({
        //             opacity: 1
        //         }, {
        //             duration: 400,
        //             easing: "easeOutQuad"
        //         });
        //     }
        // });
        reload_worker_buttons();
    });
}

function reload_worker_buttons(){

    // check amount of workers default
    var default_worker_count = $('#default-amount-workers').text();

    if (default_worker_count > 0){
        $('#add-worker-for-default-queue').text("Stop worker for default queue");
    } else {
        $('#add-worker-for-default-queue').text("Start worker for default queue");
    }


    // check amount of workers parser
    var parser_worker_count = $('#parser-amount-workers').text();

    if (parser_worker_count > 0){
        $('#add-worker-for-parser-queue').text("Stop worker for parser queue");
    } else {
        $('#add-worker-for-parser-queue').text("Start worker for parser queue");
    }

    if (parser_worker_count > 1){
        $('#add-second-worker-for-parser-queue').text("Stop second worker for parser queue");
    } else {
        $('#add-second-worker-for-parser-queue').text("Start second worker for parser queue");
    }
}




function notification_animation(div){
    
}

$('#add-task-button-parser').click(function(e){
    e.preventDefault();
    var taskname = $('select[name="add-task-select-parser"]').val();
    var btn = $('#add-task-button-parser');
    var parameters = $('input[name="add-task-parser-parameters"]').val();

    $.ajax({
        type: "GET",
        url: "/task_queue/add_task/",
        data: {
            task: taskname,
            parameters: parameters,
            queue: "parser"
        },
        beforeSend: function() {
            btn.removeClass("btn-info");
            btn.addClass("btn-warning");
            btn.text("Adding");
        },
        statusCode: {
            200: function() {
                btn.addClass("btn-info");
                btn.text("Task added");
                fill_parser_queue();
                notification_animation($("#add-task-parser-notification"));

            },
            404: function() {
                btn.removeClass("btn-info");
                btn.addClass("btn-danger");
                btn.text("404 error...");
            },
            500: function() {
                btn.removeClass("btn-info");
                btn.addClass("btn-danger");
                btn.text("500 error...");
            }
        }
    });

});

$('select[name="add-task-select-default"]').change(function(){
    if ($(this).val() == "parse_all_not_parsed_in_x_days" || $(this).val() == "delete_sources_not_found_in_registry_in_x_days"){
        $('#add-task-input-parameters').show(500);
    } else {
        $("#add-task-input-parameters").hide(500);
    }
});

$('#add-task-button-default').click(function(e){
    e.preventDefault();
    var taskname = $('select[name="add-task-select-default"]').val();
    var btn = $('#add-task-button-default');
    var parameters = $('input[name="add-task-default-parameters"]').val();


    $.ajax({
        type: "GET",
        url: "/task_queue/add_task/",
        data: {
            task: taskname,
            queue: "default",
            parameters: parameters
        },
        beforeSend: function() {
            btn.removeClass("btn-info");
            btn.addClass("btn-warning");
            btn.text("Adding");
        },
        statusCode: {
            200: function() {
                btn.addClass("btn-info");
                btn.text("Add");
                fill_default_queue();
                notification_animation($("#add-task-default-notification"));
            },
            404: function() {
                btn.removeClass("btn-info");
                btn.addClass("btn-danger");
                btn.text("404 error...");
            },
            500: function() {
                btn.removeClass("btn-info");
                btn.addClass("btn-danger");
                btn.text("500 error...");
            }
        }
    });

})


$('#add-worker-for-default-queue').click(function(e){
    e.preventDefault();
    var btn = $(this);
    var worker_count = $('#default-amount-workers').text();
    var action = "stop";
    if (worker_count == 0){
        action = "start";
    }
    var worker_program = "rq-worker-default";

    $.ajax({
        type: "GET",
        url: "/task_queue/start_worker_with_supervisor/",
        data: {
            action: action,
            worker_program: worker_program
        },
        success: function (data) {

        },
        beforeSend: function() {
            btn.removeClass("btn-info");
            btn.addClass("btn-warning");
            btn.text("Starting/stopping worker...");
        },
        statusCode: {
            200: function() {
                btn.removeClass("btn-warning");
                btn.addClass("btn-info");
                reload_task_queue_overview_table();
            },
            404: function() {
                btn.removeClass("btn-warning");
                btn.addClass("btn-danger");
                btn.text("404 error...");
            },
            500: function() {
                btn.removeClass("btn-warning");
                btn.addClass("btn-danger");
                btn.text("500 error...");
            }
        }
    });
});

$('#add-worker-for-parser-queue').click(function(e){
    e.preventDefault();
    var btn = $(this);
    var worker_count = $('#parser-amount-workers').text();
    var action = "stop";
    if (worker_count == 0){
        action = "start";
    }
    var worker_program = "rq-worker-parser";

    $.ajax({
        type: "GET",
        url: "/task_queue/start_worker_with_supervisor/",
        data: {
            action: action,
            worker_program: worker_program
        },
        success: function (data) {

        },
        beforeSend: function() {
            btn.removeClass("btn-info");
            btn.addClass("btn-warning");
            btn.text("Starting/stopping worker...");
        },
        statusCode: {
            200: function() {
                btn.removeClass("btn-warning");
                btn.addClass("btn-info");
                reload_task_queue_overview_table();
            },
            404: function() {
                btn.removeClass("btn-warning");
                btn.addClass("btn-danger");
                btn.text("404 error...");
            },
            500: function() {
                btn.removeClass("btn-warning");
                btn.addClass("btn-danger");
                btn.text("500 error...");
            }
        }
    });
});


$('#add-second-worker-for-parser-queue').click(function(e){
    e.preventDefault();
    var btn = $(this);
    var worker_count = $('#parser-amount-workers').text();
    var action = "stop";
    if (worker_count == 1){
        action = "start";
    }

    if (worker_count != 0){
        var worker_program = "rq-worker-parser-2";

        $.ajax({
            type: "GET",
            url: "/task_queue/start_worker_with_supervisor/",
            data: {
                action: action,
                worker_program: worker_program
            },
            success: function (data) {

            },
            beforeSend: function() {
                btn.removeClass("btn-info");
                btn.addClass("btn-warning");
                btn.text("Starting/stopping worker...");
            },
            statusCode: {
                200: function() {
                    btn.removeClass("btn-warning");
                    btn.addClass("btn-info");
                    reload_task_queue_overview_table();
                },
                404: function() {
                    btn.removeClass("btn-warning");
                    btn.addClass("btn-danger");
                    btn.text("404 error...");
                },
                500: function() {
                    btn.removeClass("btn-warning");
                    btn.addClass("btn-danger");
                    btn.text("500 error...");
                }
            }
        });
    } else {
        btn.text("First worker for parser queue not started.");
    }
});






function load_listeners(){

    reload_task_queue_overview_table();

    $('.error-details-link').click(function(e){
        e.preventDefault();
        $('.error-details-tr').hide(500);
        $(this).closest('tr').next('tr').show(500);

    });


    $(".delete-parser-task").click(function(e){
        e.preventDefault();
        var btn = $(this);
        var url = $(this).attr("href");

        $.ajax({
            type: "GET",
            url: url,
            beforeSend: function() {
                btn.text("Deleting");
            },
            statusCode: {
                200: function() {
                    fill_parser_queue();
                },
                404: function() {
                    btn.text("404 error...");
                },
                500: function() {
                    btn.text("500 error...");
                }
            }
        });

    });


    $(".delete-default-task").click(function(e){
        e.preventDefault();
        var btn = $(this);
        var url = $(this).attr("href");

        $.ajax({
            type: "GET",
            url: url,
            beforeSend: function() {
                btn.text("Deleting");
            },
            statusCode: {
                200: function() {
                    fill_default_queue();
                },
                404: function() {
                    btn.text("404 error...");
                },
                500: function() {
                    btn.text("500 error...");
                }
            }
        });

    });

    $(".delete-scheduled-task").click(function(e){
        e.preventDefault();
        var btn = $(this);
        var url = $(this).attr("href");

        $.ajax({
            type: "GET",
            url: url,
            beforeSend: function() {
                btn.text("Deleting");
            },
            statusCode: {
                200: function() {
                    fill_scheduled_tasks();
                },
                404: function() {
                    btn.text("404 error...");
                },
                500: function() {
                    btn.text("500 error...");
                }
            }
        });

    });


    $(".delete-failed-task").click(function(e){
        e.preventDefault();
        var btn = $(this);
        var url = $(this).attr("href");

        $.ajax({
            type: "GET",
            url: url,
            beforeSend: function() {
                btn.text("Deleting");
            },
            statusCode: {
                200: function() {
                    fill_failed_tasks();
                },
                404: function() {
                    btn.text("404 error...");
                },
                500: function() {
                    btn.text("500 error...");
                }
            }
        });

    });






}

load_listeners();




var auto_refresh = setInterval(function (){
    reload_task_queue_overview_table();
    fill_default_queue();
    fill_failed_tasks();
    fill_workers();
}, 20000);


});
