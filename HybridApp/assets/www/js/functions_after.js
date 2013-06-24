//Refresh the page
function refresh() {
	window.location.reload("index.html");
}

$( document ).bind( 'mobileinit', function(){
  $.mobile.loader.prototype.options.text = "loading";
  $.mobile.loader.prototype.options.textVisible = false;
  $.mobile.loader.prototype.options.theme = "a";
  $.mobile.loader.prototype.options.html = "";
});

$(document).ready(function() {
			
			var ip_address = "192.168.2.104";
			var port = "8080";
			var user = "";
			var password = "";
			var date = new Date();
			var active_line;
			

	    	$("#connection_button").click(function() {

	    		$.ajax({ 
	    			 type: "GET",   
	    	         url: "http://" + ip_address + ":" + port + "/veriniceserver/rest/json/metallica/todo",
	    	         username: user,
	    	         password: password,
	    	         async: false, 
	    	         success : function(data)
	    	         {		 
	    	        	 $.each(data, function(i,item){
	    	        	 	//alert(item.title);	    	        	 	
	    	        	 	$('#bsi_controls').append("<div id='line"+i+"' style='display:table-row'></div>");
	    	        	 	$('#line'+i).append("<div class='first_column'>"+item.title+"</div>");
	    	        	 	$('#line'+i).append("<div class='second_column'>"+item.url+"</div>");
	    	        	 	$('#line'+i).append("<div class='third_column'>"+item.umsetzung+"</div>");
	    	        	 	formattedDate = new Date(item.umsetzungBis);
	    	        	 	$('#line'+i).append("<div class='fourth_column'>"+formattedDate.toString('dddd, MMMM ,yyyy')+"</div>");
	    	        	 	
	    	        	 	$('#line'+i).click(function() {
	    	        	 		active_line = $(this);
	    	        	 		alert(active_line.children('.first_column').html());
	    	        	 	});
	    	        	 });
	    	         },
	    	         error: function(jqXHR, exception) {
	    	        	 if (jqXHR.status === 0) {
	    	                 alert('Not connect.\n Verify Network.');
	    	             } else if (jqXHR.status == 404) {
	    	                 alert('Requested page not found. [404]');
	    	             } else if (jqXHR.status == 500) {
	    	                 alert('Internal Server Error [500].');
	    	             } else if (exception === 'parsererror') {
	    	                 alert('Requested JSON parse failed.');
	    	             } else if (exception === 'timeout') {
	    	                 alert('Time out error.');
	    	             } else if (exception === 'abort') {
	    	                 alert('Ajax request aborted.');
	    	             } else if (jqXHR.responseText.indexOf("This request requires HTTP authentication") != -1){
	    	                 alert("Der Server benötigt eine Authentifizierung! - Ihre Zugangsdaten sind falsch!");
	    	             } else {
	    	                 alert('Uncaught Error.\n' + jqXHR.responseText);
	    	             }

	    	         }
	    		});	
	    		
	    	})
	    	
	    	
	    	$(".first_column").click(function() {
				alert("click");
			})
	    	
	    	//Error Box
	    	$("#connection_error_button").click(function() {
	    		$("#connection_error").popup("close");
	    	})
	    	
	    	$("#connection_error").click(function() {	    		
	    		 $("#connection_error").popup("open");	
	    	})
			
			//Login button clicked
			$("#signIn_save").click(function() {
				user = $('#signIn_user').val();
				password = $('#signIn_password').val();
				$("#signIn").popup("close");
				alert(user);
				alert(password);
			})

			$("#signIn_cancel").click(function() {
				$("#signIn").popup("close");
			})
			
			//Connection button clicked
			$("#connection_save").click(function() {
				var ip_address = $('#connection_ip_address').val();
				var port = $('#connection_port').val();
				$("#connection_box").popup("close");
				alert(ip_address);
				alert(port);
			})

			$("#connection_cancel").click(function() {
				$("#connection_box").popup("close");
			})
			
			//Panel height setter
			$( "#panel_right" ).on({
			    popupbeforeposition: function() {
			        var h = $( window ).height();

			        $( "#panel_right" ).css( "height", h );
			    }
			});

})