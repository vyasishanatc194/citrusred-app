
/****** function to display contatcs list using ajax************/
	function display_contacts(subscription_id,srch_email,order_by,order_by_column,unsubscribe,bounce,page_start,copied_or_moved){
	
		if(!page_start){
			page_start=0;
		}
		$('#action').val('');
		$('.list').show();
		$('.move_-'+memid).hide();
		$('.copy_-'+memid).hide();
		$('.move_'+subscription_id).hide();
		$('.copy_'+subscription_id).hide();
		$('#checked').val('');
		$('.select_list').css('background-color','#CCCCCC');
		$('.select_list').css('border-color','#CCCCCC');
		$('.select_page').css('background-color','#CCCCCC');
		$('.select_page').css('border-color','#CCCCCC');
		document.getElementById('select_page').onclick = function(){updateChecked('page',true);}
		document.getElementById('select_list').onclick = function(){updateChecked('list',true);}
		document.form1.subscription_selected_id.value=subscription_id;
		$('#delete_subscriber').attr('href',base_url+'newsletter/subscriber/subscriber_delete/'+subscription_id);
		var block_data="";
		if(document.getElementById('email_search').value){
			block_data+="srch_email="+document.getElementById('email_search').value;
		}else if(srch_email){
			block_data+="srch_email="+srch_email;
		}
		if(order_by){
			block_data+="&order_by="+order_by;
			block_data+="&order_by_column="+order_by_column;
		}
		if(unsubscribe==5){
			block_data+="&unsubscribe=5&";
			$('#action_notmail').val('removed');
		}
		if(unsubscribe==1){
			block_data+="&unsubscribe=1&";
			$('#action_notmail').val('unsubscribe');
		}		
		if(unsubscribe==2){
			block_data+="&complaints="+unsubscribe;
			$('#action_notmail').val('complaints');
		}
		if(bounce==1){
			block_data+="&bounce="+bounce;
			$('#action_notmail').val('bounce');
		}

		$('.tbl-contacts').addClass("loading-table").append($(".loading").html());

		$.ajax({
		  url: base_url+"newsletter/subscriber/subscriber_list/"+subscription_id+'/'+page_start,
		  type:"POST",
		  data:block_data,
		  success: function(data) { 
				var data_arr=data.split("|");
				$('.contacts_change').remove();
				$('.tbl-contacts').removeClass("loading-table").html(data_arr[1]);
				$('.pagination_div').html(data_arr[0]);
				$('.editing-theme-box').removeClass("active");
				if((unsubscribe!=5)&&(unsubscribe!=1)&&(unsubscribe!=2)&&(bounce!=1)){
					$('#'+subscription_id).addClass("active");
				}
				if(unsubscribe==5){
					$('#DNM_msg').show();
					$('.move_subscriber').parent().addClass('disabled');
					$('.delete_subscriber').addClass('disabled_select');
					$('.select_page').addClass('disabled_select');
					$('.select_list').addClass('disabled_select');
					$('#action_notmail').val('removed');
					$('.list_title').find('span').html('Removed');
				}else if(unsubscribe==1){
					$('#DNM_msg').show();
					$('.move_subscriber').parent().addClass('disabled');
					$('.delete_subscriber').addClass('disabled_select');
					$('.select_page').addClass('disabled_select');
					$('.select_list').addClass('disabled_select');
					$('#action_notmail').val('unsubscribe');
					$('.list_title').find('span').html('Unsubscribed');
				}else if(unsubscribe==2){
					$('#DNM_msg').show();
					$('.move_subscriber').parent().addClass('disabled');
					$('.delete_subscriber').addClass('disabled_select');
					$('.select_page').addClass('disabled_select');
					$('.select_list').addClass('disabled_select');
					$('#action_notmail').val('complaints');
					$('.list_title').find('span').html('Complaints');
				}else if(bounce==1){
					$('#DNM_msg').show();
					$('.move_subscriber').parent().addClass('disabled');
					$('.delete_subscriber').addClass('disabled_select');
					$('.select_page').addClass('disabled_select');
					$('.select_list').addClass('disabled_select');
					$('#action_notmail').val('bounce');
					$('.list_title').find('span').html('Bounced');
				}else{
					$('#DNM_msg').hide();
					if(subscription_id<0){
						$('.move_subscriber_list').parent().removeClass('disabled');
						$('.move_list').find('.list').hide();
						$('.copy_subscriber_list').parent().removeClass('disabled');
						$('.delete_subscriber').removeClass('disabled_select');
						$('.select_page').removeClass('disabled_select');
						$('.select_list').removeClass('disabled_select');
					}else{
						$('.move_subscriber').parent().removeClass('disabled');
						$('.delete_subscriber').removeClass('disabled_select');
						$('.select_page').removeClass('disabled_select');
						$('.select_list').removeClass('disabled_select');
					}
					$('#action_notmail').val('');
					$('.list_title').find('span').html($('#subscription_title_'+subscription_id).val());
				}
				//$('#action').val('');//
				reinit();
				$('.do_not_mail_list').slideUp();
				$('.move_list').slideUp();
				$('.copy_list').slideUp();
				$('.pagination_div').show(); 
				if(copied_or_moved === undefined || copied_or_moved == '')				
				setTimeout(function() {   $('#msg').html('');}, 5000);
				
				$('#removed_count').html('Removed ('+data_arr[6]+')');
				$('#unsubscribe_count').html('Unsubscribed ('+data_arr[2]+')');
				$('#bounce_count').html('Bounced ('+data_arr[3]+')');
				$('#complaint_count').html('Complaints ('+data_arr[4]+')');
				$('#visible_contacts_count').val(data_arr[5]);

		  }
		});

		$('.tbl-contacts').removeClass('donotmaillist');
	}

/***********Function to call paging using ajax**************/
  // ajax request
$(".pagination a").live('click',function(event){
	if(!$(this).hasClass('selected')){
		var block_data="";
		if($('#checked').val()!=""){
			block_data="action="+$('#action').val()+"&checked="+$('#checked').val();
		}else{
			block_data="action="+$('#action').val();
		}
		if($('#action_notmail').val()=="unsubscribe"){
			block_data+="&unsubscribe=1";
		}if($('#action_notmail').val()=="bounce"){
			block_data+="&bounce=1";
		}if($('#action_notmail').val()=="complaints"){
			block_data+="&complaints=2";
		}
		block_data+="&srch_email="+$('#email_search').val();
		if($('.order_by_paging').val()){
			block_data+="&order_by="+$('.order_by_paging').val()+"&order_by_column="+$('.order_by_column').val();
		}
		$('.tbl-contacts').addClass("loading-table").append($(".loading").html());
		$.ajax({
		   type: "POST",
		   data: block_data,
		   url: $(this).attr('href'),
		   success: function(data){
				var data_arr=data.split("|");
				$('.contacts_change').remove();
				$('.tbl-contacts').removeClass("loading-table").html(data_arr[1]);
				$('.pagination_div').html(data_arr[0]);
				reinit();
		   }
		});
	}
    return false; // don't let the link reload the page
});


function updateChecked(type,is_check){

	if($('.select_'+type).hasClass('disabled_select')){
		return false;
	}
	if(type=='page'){
		 
		if($('#action').val()!=type){
			$('#msg').html($('#visible_contacts_count').val()+' Contacts selected');
			$('#action').val(type);
			$('#checked').val('');
			$('.check-boxalign').attr('checked',true);
			$('.check-boxalign').attr('disabled',true);
			
			//$('#select_page').onclick = function(){updateChecked('page',false);}
			//$('#select_list').onclick = function(){updateChecked('list',true);}
		}else{
			$('#msg').html('');
			$('#action').val('');
			$('.check-boxalign').attr('checked',false);
			$('.check-boxalign').attr('disabled',false);
			
			//$('#select_page').onclick = function(){updateChecked('page',true);}
			//$('#select_list').onclick = function(){updateChecked('list',true);}
		}		

	}else{
	 
		if($('#action').val()!=type){
		
			$('#msg').html($('.check-boxalign').length+' Contacts selected');
			$('#action').val(type);
			$('.check-boxalign').attr('checked',true);
			//$('.check-boxalign').attr('disabled',true);			
		}else{
			$('#msg').html('');			
			$('#action').val('');
			$('.check-boxalign').attr('checked',false);
			//$('.check-boxalign').attr('disabled',false);			
		}	
	}
}

function change_color_td(cl){
	if($('#action').val()=="page"){
		if(cl.checked){
			var uncheck_list_arr=$('#uncheck_list').val().split(',');
			var index=Search_Array(uncheck_list_arr,$(cl).val())-1;
			uncheck_list_arr.splice(index,1);
			$('#uncheck_list').val(uncheck_list_arr.join());
		}else{
			$(cl).parent().parent().css('background-color','');
			if($('#uncheck_list').val()==""){
				$('#uncheck_list').val($(cl).val());
			}else{
				var uncheck_list_arr=$('#uncheck_list').val().split(',');
				if(!Search_Array(uncheck_list_arr,$(cl).val()))
				$('#uncheck_list').val($('#uncheck_list').val()+","+$(cl).val());
			}
		}
	}else{
		if(cl.checked){
			$('#msg').html($("input[type=checkbox]:checked").length+' Contacts selected');
		}else{
			$(cl).parent().parent().css('background-color','');
			var length = $("input[type=checkbox]:checked").length;
			if(length == 0) {
				$('#msg').html("");
			} else {
				$('#msg').html(length+' Contacts selected');
			}
		}
	}
}
function Search_Array(ArrayObj, SearchFor){
  var Found = false;
  for (var i = 0; i < ArrayObj.length; i++){
    if (ArrayObj[i] == SearchFor){
      return (++i);
      var Found = true;
      break;
    }
    else if ((i == (ArrayObj.length - 1)) && (!Found)){
      if (ArrayObj[i] != SearchFor){
        return false;
      }
    }
  }
}
function submit_frm(subscription_id,action){
	var page_id=0;
	if(($('.check-boxalign').length>1)&&($('.pagination').find('.selected').html()>1)){
		page_id=25*($('.pagination').find('.selected').html()-1);
	}
	var block_data="";
	if(action=="copy"){
		document.form1.contact_list_action.value='copy_to_list';
		block_data+="select_subscription="+subscription_id+"&action_from="+document.form1.subscription_selected_id.value+"&+action="+$('#action').val()+"&";
		$('.copy_list').slideUp();
	}else if(action=="move"){
		document.form1.contact_list_action.value='move_to_list';
		block_data+="select_subscription="+subscription_id+"&action_from="+document.form1.subscription_selected_id.value+"&+action="+$('#action').val()+"&";
		$('.move_list').slideUp();
	}else if(action=="unsubscribe"){
		document.form1.contact_list_action.value='unsubscribe_list';
		block_data+="action_from="+document.form1.subscription_selected_id.value+"&+action="+$('#action_notmail').val()+"&";
		$('.move_list').slideUp();
	}
	block_data+=$('#form1').serialize();
	$('.tbl-contacts').addClass("loading-table").append($(".loading").html());

		$.ajax({
		  url: base_url+"newsletter/subscriber/subscriber_action/",
		  type:"POST",
		  data:block_data,
		  success: function(data){
			var data_arr=data.split("|");
			$('.contacts_change').remove();
			$('.move_list').hide();
			$('.copy_list').hide();
			//$('#msg').html(data_arr[6]);
			var thisMsg = data_arr[6];
			if(thisMsg !== undefined && thisMsg.indexOf('copied')=== -1 &&  thisMsg.indexOf('moved')=== -1)
			var copied_or_moved = '';
			else
			var copied_or_moved = 'yes';

			$('#uncheck_list').val('');
			$('#unsubscribe_count').html('Unsubscribed ('+data_arr[2]+')');
			$('#bounce_count').html('Bounced ('+data_arr[3]+')');
			display_subscription(document.form1.subscription_selected_id.value);
			display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,'','','','',page_id,copied_or_moved);			
		  }
		});
	return false;
}
function unsubscribe_list(subscription_id,action){
	if($('#action').val() == 'page')
	$('#total_unsubscribe_count').html($("#visible_contacts_count").val());
	else
	$('#total_unsubscribe_count').html($("input[type=checkbox]:checked").length);

	$('#unsubscriber_subscription_id').val(subscription_id);
	var unsubscriber_box=$('.unsubscriber_box').html();
	$.fancybox({
			'content': unsubscriber_box,
			'autoDimensions':false,
			'transitionIn'  : 'fade',
			'transitionOut' : 'fade',
			'centerOnScroll':true,
			'scrolling':true,
			'width':'600',
			'height':'auto'
	});
}
function submit_unsubscribe_form(){
	var subscription_id=$('#unsubscriber_subscription_id').val();
	var action="unsubscribe";
	submit_frm(subscription_id,action);
	$.fancybox.close();
}
function search_form(){
	$('#search_key').val($('#email_search').val());
	if($('#action_notmail').val()=="unsubscribe"){ 
		display_contacts(document.form1.subscription_selected_id.value, document.getElementById('email_search').value,'','',1,0,0,'');
	}else if($('#action_notmail').val()=="bounce"){
		display_contacts(document.form1.subscription_selected_id.value, document.getElementById('email_search').value,'','',0,1);
	}else if($('#action_notmail').val()=="complaints"){		
		display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,"","",2);
	}else{
		display_contacts(document.form1.subscription_selected_id.value, document.getElementById('email_search').value);
	}
	//$('.tbl-contacts').addClass('searchmaillist');
	if($('#action_notmail').val() == 'unsubscribe' || $('#action_notmail').val() == 'complaints' || $('#action_notmail').val() == 'bounce'){
		$('.tbl-contacts').addClass('donotmaillist');
		$('.move_subscriber').parent().addClass('disabled');
		$('.delete_subscriber').addClass('disabled_select');
		$('.select_page').addClass('disabled_select');
		$('.select_list').addClass('disabled_select');  
	}
	return false;
}
function clear_form(){
	$('#email_search').val('');
	$('#search_key').val($('#email_search').val());
	if($('#action_notmail').val()=="unsubscribe"){
		display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,'','',1);
	}else if($('#action_notmail').val()=="bounce"){
		display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,'','',0,1);
	}else{
		display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value);
	}
	$('.tbl-contacts').removeClass('searchmaillist');
	if($('#action_notmail').val() == 'unsubscribe' || $('#action_notmail').val() == 'complaints' || $('#action_notmail').val() == 'bounce'){
		$('.tbl-contacts').addClass('donotmaillist');
		$('.move_subscriber').parent().addClass('disabled');
		$('.delete_subscriber').addClass('disabled_select');
		$('.select_page').addClass('disabled_select');
		$('.select_list').addClass('disabled_select');  
	}
	return false;
}


function displayRemoved(){
	$('#action_notmail').val("removed");
	display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,"","",5);
	$('#delete_subscriber').attr('href',base_url+'newsletter/subscriber/subscriber_delete/-'+memid);
	$('.do_not_mail_list').slideToggle();
	//$('.list_title').find('span').html('Do Not Mail List');
	$('.tbl-contacts').addClass('donotmaillist');
	$('.move_subscriber').parent().addClass('disabled');
	$('.delete_subscriber').addClass('disabled_select');
	$('.select_page').addClass('disabled_select');
	$('.select_list').addClass('disabled_select');
	return false;
}


function displayUnsubscribe(){
	$('#action_notmail').val("unsubscribe");
	display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,"","",1);
	$('#delete_subscriber').attr('href',base_url+'newsletter/subscriber/subscriber_delete/-'+memid);
	$('.do_not_mail_list').slideToggle();
	//$('.list_title').find('span').html('Do Not Mail List');
	$('.tbl-contacts').addClass('donotmaillist');
	$('.move_subscriber').parent().addClass('disabled');
	$('.delete_subscriber').addClass('disabled_select');
	$('.select_page').addClass('disabled_select');
	$('.select_list').addClass('disabled_select');
	return false;
}
/**
	Display Complaints Contacts
**/
function displayComplaints(){
	$('#action_notmail').val("complaints");
	display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,"","",2);
	$('#delete_subscriber').attr('href',base_url+'newsletter/subscriber/subscriber_delete/-'+memid);
	$('.do_not_mail_list').slideToggle();
	$('.list_title').find('span').html('Do Not Mail List');
	$('.tbl-contacts').addClass('donotmaillist');
	$('.move_subscriber').parent().addClass('disabled');
	$('.delete_subscriber').addClass('disabled_select');
	$('.select_page').addClass('disabled_select');
	$('.select_list').addClass('disabled_select');
	return false;
}
function displayBounces(){
	display_contacts(document.form1.subscription_selected_id.value,document.getElementById('email_search').value,"","",0,1);
	$('#delete_subscriber').attr('href',base_url+'newsletter/subscriber/subscriber_delete/-'+memid);
	$('.do_not_mail_list').slideToggle();
	$('.tbl-contacts').addClass('donotmaillist');
	$('.move_subscriber').parent().addClass('disabled');
	$('.delete_subscriber').addClass('disabled_select');
	$('.select_page').addClass('disabled_select');
	$('.select_list').addClass('disabled_select');
	return false;
}
function openSubscriptionForm(){
	if( $('#subscription_menu').is(':hidden') ){
		$('.contact_frm').hide();
		$('.import_contact').hide();
		$('.paste_contact').hide();
		$('.import_conact_mailserver').hide();
		var msg=$("#add-list").html();
  	$.fancybox({'content' : "<div style=\"width:400px;\">"+msg+"</div>"});
		$('.subscription_msg').html("");
		$('.drop_img').attr('src',webappassets+"images/down.png?v=6-20-13");
	}else if($('#subscription_menu').is(':visible')){
		$('.contact_frm').hide();
		$('.import_contact').hide();
		$('.paste_contact').hide();
		$('.import_conact_mailserver').hide();
		$('#subscription_menu').hide();
		$('.drop_img').attr('src',webappassets+"images/login-up.png?v=6-20-13");
	}
	closeSubscriberForm('contact_frm');
}
function ajaxSubscriptionFrm(frm){
	//var frm=document.frmLogin;
		 var block_data="";
		block_data+="action=submit&"+'&subscription_title='+escape(frm.subscription_title.value);
		   $.ajax({
		  url: base_url+"newsletter/contacts/create/",
		   type:"POST",
			data:block_data,
		  success: function(data) {
		  var data_arr=data.split(":", 2);
		  if(data_arr[0]=="error"){
			$('.subscription_msg').html(data_arr[1]);
			$('.subscription_msg').addClass('info');
		  }else if(data_arr[0]=="success"){
			display_subscription(data_arr[1]);
			display_contacts(data_arr[1]);
			frm.subscription_title.value="";
			$('.subscription_msg').html("List created successfully.");
			setTimeout(function(){$.fancybox.close();} , 2000);
			setTimeout( function(){$('#subscription_menu').hide();} , 2000);
		  }
		  }
		});
		//alert(block_data);
		return false;
}
function exportcsv(){
	var search_key = $('#search_key').val();
	var sid = $('#subscription_selected_id').val();
	
	document.form1.action=base_url+"newsletter/subscriber/exportcsv/"+sid+'/'+search_key;
	
	document.form1.submit();
}
function exportcsv_0(){
	var search_key = $('#search_key').val();
	window.location = base_url+"newsletter/subscriber/exportcsv/"+ document.form1.subscription_selected_id.value +'/'+search_key+'/';
}
function exportcsv_do_not_mail_list(){
	window.location = base_url+"newsletter/subscriber/exportcsv_do_not_mail_list/"+$('#action_notmail').val();
}
 
 function checkImportStatus() {


      $.ajax({
        url:  base_url+'newsletter/subscriber/checkImportStatus/',
        success: function (data) {
          if (data == 0) {
            window.location.reload();
			return;
          }
        }
      });

}


function reinit() {
	$(".fancybox").fancybox({'autoDimensions':false,'height':'183','width':'420','centerOnScroll':true,'scrolling':false});
	$(".fancybox_delete").fancybox({'autoDimensions':false,'height':'184','width':'420'});
}

function order_by(order_by_column){
	var order_by=$('.order_by').val();
	$('.order_by_paging').val(order_by);
	if(order_by=="asc"){
		$('.order_by').val('desc');
	}else{
		$('.order_by').val('asc');
	}
	$('.order_by_column').val(order_by_column);
	var subscription_id=$('#subscription_selected_id').val();
	if($('#action_notmail').val()=="unsubscribe"){
		display_contacts(subscription_id,"",order_by,order_by_column,1);
	}else if($('#action_notmail').val()=="complaints"){
		display_contacts(subscription_id,"",order_by,order_by_column,2);
	}else if($('#action_notmail').val()=="bounce"){
		display_contacts(subscription_id,"",order_by,order_by_column,0,1);
	}else{
		display_contacts(subscription_id,"",order_by,order_by_column);
		$('#action_notmail').val('');
	}
}
/*
		ajax call to delete contact
*/
$(".delete-row").live('click',function(event){
	$(this).fastConfirm({
		position: "top",
		questionText: "Are you sure you want <br/>to delete Contact?",
		onProceed: function(trigger) {
			var subscriber_id=$(trigger).attr('name');
			 $.ajax({
				url: base_url+"newsletter/subscriber/delete/"+subscriber_id,
				type:"POST",
				success: function(data) {
					$(trigger).parents('.contacts_change').remove();
				}
			});
		},
		onCancel: function(trigger) {
		}
	});
});
/*
	checked checkbox on click of delete link
*/
$(".fancybox_delete").live('click',function(event){
	$('#action').val('');
	$('.check-boxalign').attr('checked','');
	$('.check-boxalign').removeAttr('disabled');
	$('.contacts_change').css("background-color","");
	$(this).parents(".contacts_change").find('.check-boxalign').attr('checked','checked');
});
/*
		export csv confirmation
*/
$(".export_csv").live('click',function(event){
	$(this).fastConfirm({
		position: "top",
		questionText: "Are you sure you want to export this list?",
		onProceed: function(trigger) {
			if($('#action_notmail').val()!=""){
				exportcsv_do_not_mail_list();
			}else{
				exportcsv();
			}
		},
		onCancel: function(trigger) {
		}
	});
});
/*
	edit subscription title
*/
$(".subscriber_edit").live('click',function(event)
{
	var subscription_id=$(this).attr('name');
	$('.list-icons').show();
	$('.subscription_text').hide();
	$('.subscription_strong').show();
	$('.right-no').show();
	$('.edit_subscription').hide();
	$(this).parents('.editing-theme-box').find('.list-icons').hide();
	$(this).parents('.editing-theme-box').find('.right-no').hide();
	$(this).parents('.editing-theme-box').find('.edit_subscription').show();
	$('#subscription_id_'+subscription_id).hide();
	$('#subscription_text_'+subscription_id).show();
	$('#subscription_text_'+subscription_id).focus();
});

/*
	fancyAlert to display message
*/
function fancyAlert(msg){
  $.fancybox({
  'content' : "<div style='width:400px;'><h5>Confirm</h5><p style='text-align:left'>"+msg+"</p><div class='btn-group'><span class='btn cancel' onclick='$.fancybox.close();'>Close</span></div></div>"
  });
}
function saveSubscriptionTitle(subscription_id){
	var new_title = $('#subscription_text_'+subscription_id).val();
	var block_data="subscription_title="+escape(new_title)+"&action=submit&subscription_id="+subscription_id;
	$.ajax({
		url: base_url+"newsletter/contacts/edit/"+subscription_id,
		type:"POST",
		data:block_data,
		success: function(data) {
			data_arr=data.split(":");
			if(data_arr[0]=="error"){				
				$('#subscription_text_'+subscription_id).val(data_arr[2]);
				$('#subscription_text_'+subscription_id).focus();
			}else{
				$('#subscription_id_'+subscription_id).html($('#subscription_text_'+subscription_id).val().substr(0,19));
				$('#subscription_id_'+subscription_id).show();
				$('#subscription_text_'+subscription_id).hide();
				$('#subscription_text_'+subscription_id).parents('.editing-theme-box').find('.list-icons').show();
				$('#subscription_text_'+subscription_id).parents('.editing-theme-box').find('.right-no').show();
				$('#subscription_text_'+subscription_id).parents('.editing-theme-box').find('.edit_subscription').hide();
				$('#subscription_title_'+subscription_id).val(new_title);
				$('.list_title').find('span').html(new_title);
				//display_subscription(subscription_id);
			}
		}
	});
}
function slideMenu(action){
	if(!($('.move_subscriber_list').parent().hasClass('disabled'))){
		if($('#action_notmail').val()!='unsubscribe'){
			if(action=="move_list"){
				$('.move_list').slideToggle();
				$('.copy_list').slideUp();
				$('.do_not_mail_list').slideUp();
			}
		}
	}
	if(!($('.copy_subscriber_list').parent().hasClass('disabled'))){
		if($('#action_notmail').val()!='unsubscribe'){
			if(action=="copy_list"){
				$('.move_list').slideUp();
				$('.copy_list').slideToggle();
				$('.do_not_mail_list').slideUp();
			}
		}
	}
}
function newPageSize(x){
	var ps = $('#psize').val();
	var dnmType = 0;
	var isBounce = 0;
	  
	if($('#action_notmail').val() == 'unsubscribe'){
		dnmType = 1;
	}else if($('#action_notmail').val() == 'complaints'){
		dnmType = 2;
	}else if($('#action_notmail').val() == 'bounce'){
		isBounce = 1;  
	}
  
   jQuery.ajax({
		url:  base_url+"newsletter/emailreport/ajx_setpagesize/",
		type:"POST",
		data:"ps="+ps,
		success: function(data) {
		 
			display_contacts($('#subscription_selected_id').val(),$('#email_search').val(),'','',dnmType,isBounce,0,'');
			if($('#action_notmail').val() == 'unsubscribe' || $('#action_notmail').val() == 'complaints' || $('#action_notmail').val() == 'bounce'){
				$('.tbl-contacts').addClass('donotmaillist');
				$('.move_subscriber').parent().addClass('disabled');
				$('.delete_subscriber').addClass('disabled_select');
				$('.select_page').addClass('disabled_select');
				$('.select_list').addClass('disabled_select');  
			}
		}
	});
  }
/**
* js for My Contact's Search box starts
*/
$(window).load(function(){
(function ($, undefined) {
    $.fn.clearable = function () {
        var $this = this;

        $this.wrap('<div class="clear-holder" style=" position:relative;float:left;" />');
        var helper = $('<span class="clear-helper"><i class="icon-remove"></i></span>');
        $this.parent().append(helper);
        helper.click(function(){
            $this.val("");
			clear_form();
			$('.clear-helper').hide();
        });
		$('.clear-helper').hide();

		$this.keyup(function(){
			if($this.val()!='')$('.clear-helper').show();else $('.clear-helper').hide();
		});

    };
})(jQuery);

$("#email_search").clearable();
});
/**
* js for My Contact's Search box ends
*/




// Removes leading whitespaces
function LTrim( value ) {
	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");
}
// Removes ending whitespaces
function RTrim( value ) {
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
}
