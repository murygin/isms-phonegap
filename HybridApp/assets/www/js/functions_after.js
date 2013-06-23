$(document).ready(function() {
			var ip_address = $("#ip_address").val();
			var port = $("#port").val();
			var user = "";
			var password = "";
			
			$("#ip_address").change(function() {
				ip_address = $("#ip_address").val();
			})
			$("#port").change(function() {
				port = $("#port").val();
			})
		
	    	$("#button").click(function() {
	    		alert("Click");
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
	    	        	 	$('#line'+i).append("<div class='fourth_column'>"+item.umsetzungBis+"</div>");
	    	        	 });
	    	         }
	    		});
	    	})
	    	$(".first_column").click(function() {
				alert("click");
			})
			
			$("#signIn_save").click(function() {
				var user = $('#signIn_user').val();
				var password = $('#signIn_password').val();
				$("#signIn").hide();
				alert(user);
				alert(password);
			})

			$("#signIn_link").click(function() {
				$("#signIn").show();
			})
			$("#signIn_cancel").click(function() {
				$("#signIn").hide();
			})
			
			
			
			
			
			
			
			
			
			
			
			
})