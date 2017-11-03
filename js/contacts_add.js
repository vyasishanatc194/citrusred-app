function contact_add(id_attr) {

  $('.contact_upload_tabs').show('fast');
  $('.contact_type').removeClass('active');
  $('#button').hide('fast');
  $('.contact_frm').hide();
  $('.import_contact').hide();
  $('.paste_contact').hide();
  $('.import_conact_mailserver').hide();
  $('#subscription_menu').hide();
  $('.' + id_attr).show();
  $('#' + id_attr).addClass('active');
  $('#form_subscriber_import').show();
  $('#subscribercopyfrm').show();

  if (id_attr == "contact_frm") {
    $("#tbl_subscriber_frm tr:last").find('input:text').val("");
    $('.contact_frm').find('.terms_condition').show();
    $('.contact_frm').find('#terms').val('true');
  }
  $('.subscriber_msg').html('');
  $('.subscriber_msg').removeClass('info');
}

function ajaxSubscriberFrm(frm, action) {
  var send_request = true;
  var block_data = "";
  var selected_list_id = memid * (-1);
  if (action == "copycsv") {
    var terms_condition_copy = "";
    if (frm.terms_condition_copy.checked) {
      terms_condition_copy = 1;
    }
    var copy_csv_content = frm.copy_csv.value.replace(/(\t)/gm, ",");
    var copy_arr = copy_csv_content.split('\n');
    if (copy_arr.length <= 0) {
      copy_arr = copy_csv_content.split('\r');
    }
    if (copy_arr.length <= 0) {
      copy_arr = copy_csv_content.split('\r\n');
    }
    if (copy_arr.length > 500) {
      send_request = false;
    }
    var copy_csv_content = copy_csv_content.replace(/"/g, "");
    copy_csv_content = escape(copy_csv_content);
    block_data += "action=copycsv&copy_csv=" + copy_csv_content + "&terms_condition=" + terms_condition_copy;
    selected_list_id = $('#subscription_select_copy').val();
    $('#delete_subscriber').attr('href', base_url + 'newsletter/subscriber/subscriber_delete/' + selected_list_id);
  } else if (action == "copyemail") {
    block_data += "action=copycsv&copy_csv=" + frm.email_addresses.value;
  } else {
    selected_list_id = $('#subscription_contact_one').val();
    block_data += "subscription_id=" + selected_list_id + "&action=submit&" + $("#subscriberfrm").serialize();
    //$('#delete_subscriber').attr('href',base_url+'newsletter/subscriber/subscriber_delete/'+document.form1.subscription_selected_id.value);
  }
  if (send_request) {
    $.blockUI({
      message: '<h3 style="z-index:2000;">Please wait...</h3>'
    });
    $.ajax({
      url: base_url + "newsletter/subscriber/create/" + selected_list_id,
      type: "POST",
      data: block_data,
      success: function(data){
        var data_arr = data.split(":", 2);
        if (data_arr[0] == "error") {
          $('.subscriber_msg').html('');
          $('.subscriber_msg').show();
          $('.subscriber_msg').html(data_arr[1]);
          $('.subscriber_msg').addClass('info');
          $.unblockUI();
        } else if (data_arr[0] == "copy_success") {
          $('.subscriber_msg').show();
          $('.subscriber_msg').html('While your contacts are uploading, we wanted to share that your contact list will be graded for deliverability before your first campaign is released, helping us maintain sending reputation for you and our other customers. If for some reason your contact list does not pass our deliverability grade, our support team will reach out to you for next steps.  In the meantime, please feel free to create and schedule your campaign(s). Navigating away from this page will not interrupt the upload. After completion of process, you will be informed by email.');
          $('.subscriber_msg').addClass('info');
          window.location.href = base_url + 'newsletter/contacts/index/' + selected_list_id;
        } else if (data_arr[0] == "success") {
          $('.subscriber_msg').show();
          $('.subscriber_msg').html('Contacts added successfully.');
          $('.subscriber_msg').addClass('info');
          setTimeout(function() {
            $('.subscriber_msg').fadeOut();
          }, 4000);
          if (action == 'save_add_more') {
            $('#terms_condition_save').parents('.terms_condition').hide();
            $('#terms').val('false');
            $("#tbl_subscriber_frm tr:last").find('input:text').val("");
            $('table#tbl_subscriber_frm').find("input").each(function() {
              $(this).val("");
            });
            $('#add_row').show();
          } else {
            window.location.href = base_url + 'newsletter/contacts/index/' + selected_list_id;
          }
          $.unblockUI();

        }
      }
    });
  } else {
    $('.subscriber_msg').html("Maximum 500 records can be imported at a time.");
    $('.subscriber_msg').addClass('info');
  }
  return false;
}

function ajaxFileUpload() {
  $.blockUI({
    message: '<h3 style="z-index:2000;">Please wait...</h3>'
  });
  var terms_condition = 0;
  if (document.form_subscriber_import.terms_condition.checked) {
    terms_condition = 1;
  } 
  $.ajaxFileUpload({
    url: base_url + 'newsletter/subscriber/importcsv/' + $('#subscription_select').val() + '/' + terms_condition,
    secureuri: false,
    fileElementId: 'subscriber_csv_file',
    dataType: 'json',
	error: function (data, status, e){		 
                    $(".subscriber_msg").html(e);
					$('.subscriber_msg').addClass('info');
    },
    success: function(data, status) {

      if (typeof(data.error) != 'undefined') {
        if (data.error != '') {
			var msg = data.error;			
			$('.subscriber_msg').html(decodeURIComponent((msg+'').replace(/\+/g, '%20')));		  
			$('.subscriber_msg').addClass('info');
			$.unblockUI();
        } else {

          var msg = "While your contacts are uploading, we wanted to share that your contact list will be graded for deliverability before your first campaign is released, helping us maintain sending reputation for you and our other customers. If for some reason your contact list does not pass our deliverability grade, our support team will reach out to you for next steps.  In the meantime, please feel free to create and schedule your campaign(s). Navigating away from this page will not interrupt the upload. After completion of process, you will be informed by email.";
          $('.subscriber_msg').html(msg);
          $('.subscriber_msg').addClass('info');


          var data_msg = data.msg;
          var data_arr = data_msg.split(":", 2); 
          //setTimeout( function(){$('.subscriber_menus').fadeOut();} , 30000);
          //var delay = function() { display_contacts(data_arr[1]); };
          //setTimeout(delay, 30000);
          //var delay1 = function() { display_subscription(data_arr[1]); };
          //setTimeout(delay1, 30000);
          //$('#form_subscriber_import').hide();
          //$('.contact_upload_tabs').hide();
          //$('#form1').show();
          //$('.right-side').show();
          $.unblockUI();

          window.location.href = base_url + 'newsletter/contacts/index/' + $('#subscription_select').val();
        }
      }
    }
  });
  return false;
}

function checkImportStatus() {
  $.ajax({
    url: base_url + 'newsletter/subscriber/checkImportStatus/',
    success: function(data) {
      if (data == 0) {
        window.location.reload();
        return;
      }
    }
  });
}

function contact_add_dropdown(id_attr) {
  contact_add(id_attr);
}

function reinit() {
  $(".fancybox").fancybox({
    'autoDimensions': false,
    'transitionIn': 'fade',
    'transitionOut': 'fade',
    'height': 'auto',
    'width': '600',
    'centerOnScroll': true,
    'scrolling': false
  });
  $(".fancybox_delete").fancybox({
    'autoDimensions': false,
    'transitionIn': 'fade',
    'transitionOut': 'fade',
    'height': 'auto',
    'width': '600'
  });
}

function add_table_row() {
  if ($("#tbl_subscriber_frm").find("tr").length == 10) {
    $("#add_row").css("display", "none");
  }
  $("#tbl_subscriber_frm tr:last").clone(true).insertAfter("#tbl_subscriber_frm tr:last");
  $("#tbl_subscriber_frm tr:last").find('input:text').val("");
}

/*
	fancyAlert to display message
*/

function fancyAlert(msg) {
  $.fancybox({
    'content': "<div style=\"margin:20px;width:240px;font-weight:bold;\">" + msg + "</div>"
  });
}
// Removes leading whitespaces


function LTrim(value) {
  var re = /\s*((\S+\s*)*)/;
  return value.replace(re, "$1");
}
// Removes ending whitespaces


function RTrim(value) {
  var re = /((\s*\S+)*)\s*/;
  return value.replace(re, "$1");
}
