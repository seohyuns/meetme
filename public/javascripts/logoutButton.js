$(document).ready(function(){
	$("#logout").click(function(e) {
		console.log("logout");
        $.ajax({
            url: '/logout',
            type: 'GET',
            success: function(result) {
				redirect: true,
				redirectURL = "/login"
            // Do something with the result
        	},
        	error: function(err){
        		console.log(err);
        	}
    	});
	});
});

