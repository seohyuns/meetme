var trigger = {}; 
$(document).ready(function(){

    console.log(trigger.user);

    // $.ajax({
    //     url:'/landing',
    //     type: 'GET',
    //     data : {
    //         user : trigger.user
    //     },
    //     success: function(result){
    //         $('#your-meetings').html(JSON.stringify(result));
    //     }
    // })

    $("#add-form").submit(function(e) {
        console.log("hit add-form");
        e.preventDefault();
        var meeting_name = $('#meeting_name').val();
        var date = $('#date').val().replace("/","-");
            date = date.replace("/","-");
        var time = $('#time').val();
        var location = $('#location').val();
        var description = $('#description').val();
        $.ajax({
            url: '/put' + '/' + meeting_name + '/'  + date + '/' + time + '/' + location + '/' + description , 
            type: 'PUT',
            success: function(result) {
                console.log(result);
                $("#add").html("<h2>Horray, a new meetme was created!</h2>");
                $("#add").fadeOut(5000);
        }
        });
    return false;
    });

    $("#delete-form").submit(function(e) {
        e.preventDefault();
        var player_name = $('#meeting_name_delete').val();
        $.ajax({

            url: '/delete' + '/' + meeting_name, 
            type: 'DELETE',
            success: function(result) {
                console.log(result);
                $('#response-area-delete').html(JSON.stringify(result));
            // Do something with the result
        }
        });
    return false;
    });
    $("#get-form").submit(function(e) {
        console.log("hit get-form");
        e.preventDefault();
        var meeting_name = $('#meeting_name_get').val();
        $.ajax({
            url: '/get'+ '/' + meeting_name, 
            type: 'GET',
            success: function(result) {
                if (meeting_name){
                    $('#response-area-get').html(result);
                }else {
                    $('#response-area-get').html(result);
                    console.log(result);
                }
            }
        });
        return false;
    });
    $("#update-form").submit(function(e) {
        e.preventDefault();
        var meeting_name = $('#meeting_name_update').val();
        var date = $('#date').val();
        var time = $('#time').val();
        var location = $('#location').val();
        var description = $('#description').val();
        $.ajax({
            url: '/post' + '/' + meeting_name + '/'  + date + '/' + time + '/' + location + '/' + description + '/' , 
            type: 'POST',
            success: function(result) {
                console.log(result);
               // $('#response-area-update').html(JSON.stringify(result));
            // Do something with the result
        }
        });
        return false;
    });

    $("#meeting_name_from_table").click(function(e){
        var meeting_name = $('#meeting_name_from_table').attr('value');
        $.ajax({
            url: '/get' + '/' + 'page' + '/'  + meeting_name, 
            type: 'GET',
            success: function(result) {
                console.log(result);
                $('#response-area-table').html(JSON.stringify(result));
            // Do something with the result
            }
        });
    });

});


