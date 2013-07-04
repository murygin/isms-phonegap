//Global variable
var bsi_controls_json_data;
var iso_27000_json_data;
var ip_address = "192.168.2.104";
var port = "8080";
var user = "";
var password = "";
var date = new Date();
var active_line;
var active_bsi_task_item;
var bsi_controls_active_line;
var login_unsuccessful = true;
var bsi_control_realization_number;



//Refresh the page
function refresh() {
	window.location.reload("index.html");
}

function handle_click_on_list_item(line){
	
	//Handle hover for lines
	if (bsi_controls_active_line != null){
		bsi_controls_active_line.removeClass("hover");
	}
	line.addClass("hover");
	bsi_controls_active_line = line;
	
	//Get bsi_object from name
	var bsi_task_name = line.children(".first_column").text();
	active_bsi_task_item = get_object_for_bsi_task_name(bsi_task_name);

	save_variables_for_page_change();
	$.mobile.changePage("#bsi_task_editor");
	
}

//Save variables in local Storage
function save_variables_for_page_change(){
	var userInfo = {
            "ip_address": ip_address,
            "port": port,
            "user": user,
            "password": password,
            "active_item": active_bsi_task_item,
    };
    localStorage.setItem('Credentials', JSON.stringify(userInfo));
}

//To make the values of these variables available in the other page
$(document).on( "pagebeforeshow", "#bsi_task_editor", function() {
	var userInfo = JSON.parse(localStorage.getItem("Credentials"));
	var userName = userInfo.user;
	user = userInfo.user;
	password = userInfo.password;
	ip_address = userInfo.ip_address;
	port = userInfo.port;
	active_bsi_task_item = userInfo.active_item;
	bsi_control_realization_number = umsetzung_mapping("id");
	$("#bsi_editor_realization_dropdown").val("3");
});

function load_bsi_editor(){
	$("#bsi_editor_realization_dropdown").val(bsi_control_realization_number).change();
	
	//Unbind and bind otherwise there would be more event handlers over time
	$("#bsi_editor_save").unbind();
	$("#bsi_editor_save").click(function() {
			
			//Save changes in Item
			active_bsi_task_item.umsetzung = $("#bsi_editor_realization_dropdown").val();
			var json_string = JSON.stringify(active_bsi_task_item);
			var address = "bsi_controls";
			alert("http://" + ip_address + ":" + port + "/veriniceserver/rest/json/" + address + "/post");
			
			$.ajax({ 
				type: "POST",   
		        url: "http://" + ip_address + ":" + port + "/veriniceserver/rest/json/" + address + "/post",
		        username: user,
		        password: password,
		        data: json_string,
		        dataType: "json",
		        async: false, 
		        success : function(data)
		        {		 
		       	 	alert("Saving: " + data.Saving);
		        },
		        error: function(jqXHR, exception) {
		        	alert('Uncaught Error.\n' + jqXHR.responseText);
		        }
			});	
			
			//Switch back to normal overview
			$.mobile.changePage("#bsi_controls");
	});
	
	//Unbind and bind otherwise there would be more event handlers over time
	$("#bsi_editor_cancel").unbind();
	$("#bsi_editor_cancel").click(function() {
		$.mobile.changePage("#bsi_controls");
	})
	
}



function umsetzung_mapping(name_or_id){
	var umsetzung = active_bsi_task_item.umsetzung;
	var umsetzung_id = null;
	var umsetzung_name = null;
	
	if (umsetzung == "mnums_umsetzung_entbehrlich")
	{
		umsetzung_id = 1;
		umsetzung_name = "Entbehrlich";
	}
	else if (umsetzung == "mnums_umsetzung_ja")
	{
		umsetzung_id = 2;
		umsetzung_name = "Ja";
	}
	else if (umsetzung == "mnums_umsetzung_nein")
	{
		umsetzung_id = 3;
		umsetzung_name = "Nein";
	}
	else if (umsetzung == "mnums_umsetzung_teilweise")
	{
		umsetzung_id = 4;
		umsetzung_name = "Teilweise";
	}
	else if (umsetzung == "mnums_umsetzung_unbearbeitet")
	{
		umsetzung_id = 5;
		umsetzung_name = "Unbearbeitet";
	}
	if (name_or_id == "id"){
		return umsetzung_id;
	} else{
		return umsetzung_name;
	}
}

function get_object_for_bsi_task_name(bsi_task_name){
	var data = bsi_controls_json_data;
	var match;
	$.each(data, function(i,item){
		if (item.title == bsi_task_name){
			match = item;
			return false;
		}
	});
	return match;
}

function ajax_request(address) {
	alert("http://" + ip_address + ":" + port + "/veriniceserver/rest/json/" + address + "/get");
	
	$.ajax({ 
		type: "GET",   
        url: "http://" + ip_address + ":" + port + "/veriniceserver/rest/json/" + address + "/get",
        username: user,
        password: password,
        async: false, 
        success : function(data)
        {		 
       	 if (address == "bsi_controls"){
       		bsi_controls_json_data = data;
       		append_table(data);
       	 } else if ((address == "iso_27000")){
       		iso_27000_json_data = data;
       		alert(iso_27000_json_data);
       	 } else if ((address == "auth")){
       		alert("Authentifizierung erfolgreich!");
       		login_unsuccessful = false;
       	 }
       	 
        },
        error: function(jqXHR, exception) {
       	 if (jqXHR.status === 0) {
                alert('Keine Verbindung möglich.\n Bitte Verbindungseinstellungen prüfen!');
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
}

function append_table(data){
	
	 //Empty table for refresh
	 $('#bsi_controls_table').empty();

	 // Add heading
	 $('#bsi_controls_table').append("<div id='bsi_controls_table_heading' style='display:table-row'></div>");
	 $('#bsi_controls_table_heading').append("<div class='first_column'>Name des Tasks</div>");
	 $('#bsi_controls_table_heading').append("<div class='second_column'>URL</div>");
	 $('#bsi_controls_table_heading').append("<div class='third_column'>Umsetzung</div>");
	 $('#bsi_controls_table_heading').append("<div class='fourth_column'>Umsetzung Bis</div>");
	 	
	//Fill new table with new data
	$.each(data, function(i,item){
   	 	//alert(item.title);	    	        	 	
   	 	$('#bsi_controls_table').append("<div id='line"+i+"' style='display:table-row'></div>");
   	 	$('#line'+i).append("<div class='first_column'>"+item.title+"</div>");
   	 	$('#line'+i).append("<div class='second_column'>"+item.url+"</div>");
   	 	active_bsi_task_item = item;
   	 	$('#line'+i).append("<div class='third_column'>"+ umsetzung_mapping("name") +"</div>");
   	 	formattedDate = new Date(item.umsetzungBis);
   	 	$('#line'+i).append("<div class='fourth_column'>"+formattedDate.toString('dddd, MMMM ,yyyy')+"</div>");
   	 	
   	 	$('#line'+i).click(function() {
   	 		handle_click_on_list_item($(this));
   	 	});
   	 	
   	 	if (i%2 == 0){
   	 		$('#line'+i).addClass("even");
   	 	} else{
   	 		$('#line'+i).addClass("odd");
   	 	}
   	 });
}


$(document).ready(function() {
			
			// Insert data from active item to BSI_Task_Editor 
			$(document).bind( "pagechange", "#bsi_task_editor", function() {
				if ($.mobile.activePage.attr('id') == "bsi_task_editor"){
					load_bsi_editor();	
				}			
			});
			
			
			//Force new load when index is called - data might have been changed
			$(document).bind( "pagechange", "#bsi_controls", function() {
				if ($.mobile.activePage.attr('id') == "bsi_controls"){
					ajax_request("bsi_controls");
				}			
			});
			
			$(document).bind( "pagechange", "#iso_27000", function() {
				if ($.mobile.activePage.attr('id') == "iso_27000"){
					ajax_request("iso_27000");
				}			
			});
	
	    	$("#connection_button").click(function() {
	    		ajax_request("bsi_controls");
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
				ajax_request("auth");
				if (!login_unsuccessful){
					$("#signIn").popup("close");
					ajax_request("bsi_controls");
				}
			})

			$("#signIn_cancel").click(function() {
				$("#signIn").popup("close");
			})
			
			//Connection button clicked
			$("#connection_save").click(function() {
				ip_address = $('#connection_ip_address').val();
				port = $('#connection_port').val();
				$("#connection_box").popup("close");
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