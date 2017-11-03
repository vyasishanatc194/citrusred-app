  $(function() {
    $('.custom_fields').live('click',function () {
      var hdn_fld_name=$(this).attr('name').split("_");
      if($('#add_'+hdn_fld_name[1]).val()==1){
        var split_field=$(this).attr('name').split("_");
        $('#'+split_field[1]+'_field_name').css('display','inline');
        var parent=$('#'+split_field[1]+'_field_name').parents('.custom_tr');
        parent.find('.delete_custom').show();
        $('#add_'+split_field[1]).val(0);
      } else {
        var split_field=$(this).attr('name').split("_");
        $('#'+split_field[1]+'_field_name').css('display','none');
        $('.'+split_field[1]+'_fld').remove();
        var parent=$('#'+split_field[1]+'_field_name').parents('.custom_tr');
        parent.find('.delete_custom').hide();
        $('#add_'+split_field[1]).val(1);
      }
    });

    newItem = $('#subscription_list_title');

    $("#add_subscription_list").click(function(){
      var b_data = "action=submit&subscription_title="+newItem.val();

      jQuery.ajax({
        url: base_url+"newsletter/contacts/create",
        type:"POST",
        data:b_data,
        success: function(data) {
          var data_arr=data.split(":", 2);

          if (data_arr[0]=="error") {
          } else if(data_arr[0]=="success") {
            var v = newItem.val().substr(0,25), opt = $('<option />', {
              value: v,
              text: v
            });
            opt.appendTo( el );
            el.multiselect('refresh');
            var foo = [];
            newItem.val('');
            $('.ui-multiselect').css('width', '515px');
            $('.add_subscription').toggle();
          }
        }
      });
    });

    var el = $("select[multiple]").multiselect({
      create: function(event, ui){
        $('.ui-multiselect').css('width', '515px');
      },
      change: function(event, ui){
        $('.ui-multiselect').css('width', '515px');
      },
      close: function() {
          var values = new Array();
          $(this).multiselect("getChecked").each(function(index, item) {
              values.push($(item).val());
          });
         $("input[id*=selectedSubscriptionValues]").val(values.join(","));
      }
    });
  });





  /*
    fancyAlert to display message
  */
  function fancyAlert(msg) {
    $.fancybox({
      'content' : "<div style=\"margin:20px;width:240px;font-weight:bold;\">"+msg+"</div>"
    });
  }
  function addCustomRow(type,friendlyName){
    var index;
    index = $('.add-sign-up-field.custom').length + 1;
    var row = [
      '<div id="custom',index,'" class="add-sign-up-field custom active" name="field_custom',index,'">',
        '<input type="hidden" name="custom_field[]" value="0" id="field_custom',index,'" />',
        '<input type="hidden" name="custom_field_required[]" value="0" id="field_custom',index,'_required" />',
        '<input type="hidden" name="custom_field_type[]" id="field_custom',index,'_type" value="',type,'" />',
        '<input type="hidden" value="1" id="add_custom',index,'" />',
        '<strong class="add-sign-up-field-custom-title">',friendlyName,' Title:</strong>',
        '<input class="sign-up-field-custom custom_text" type="text" name="custom_field_name[]" placeholder="Enter field title ex. Interests" id="custom',index,'_field_name" onkeyup="display_form_field(\'custom'+index+'\',\'Custom\','+index+',\''+type+'\')"/>'];

        if (type !== "text" && type !== "date_dropdown" && type !== "textarea") {
          row.push('<strong class="add-sign-up-field-custom-title options">Options: <span class="add-sign-up-field-custom-subtitle">(comma separated)</span></strong>');
          row.push('<input class="sign-up-field-custom custom_text" type="text" name="custom_field_options[]" placeholder="Enter options ex. Basketball, Baseball, Soccer, Tennis" id="custom',index,'_field_name_options" onkeyup="display_form_field(\'custom'+index+'\',\'Custom\','+index+',\''+type+'\')"/>');
        }

        row.push('<i class="icon icon-trash delete_custom"></i>');
        row.push('<input type="checkbox" class="field_required_toggle required custom" />');

      row.push('</div>');
    $('.signup-tbl-field-list').append(row.join(""));
  }
  $(".add-custom-dropdown-list").live("change",function() {
    var type = $(this).val();
    var friendlyName = $(this).children("option[value=" + type + "]").html();

    if (type !== 0) {
      addCustomRow(type,friendlyName);
    }

    $(this).val(0);
  });



  function changeTitle(fld_name){
    $('.form_preview').show();
    $('.copy_code').hide();
    $('.'+fld_name).find('div.header-txt').html($('#'+fld_name).val());

  }
  function changeButtonText(fld_name){
    $('.form_preview').show();
    $('.copy_code').hide();
    $('#btnSubmitForm').val($('#'+fld_name).val());
  }
  $(document).delegate(".field_add_toggle","click",function(e) {
    var $this = $(this).parents(".add-sign-up-field");
	if(undefined == $this.attr("data-field")){
		var dtfld = $(this).attr('id');
		var left_block_id = 'update-language-'+dtfld+"-data"; 
		var left_block_chk_id = 'field_'+dtfld ; 
		$('#'+left_block_chk_id).val(1);
		$('#'+left_block_chk_id).removeAttr("checked");
		display_form_field(dtfld,$('#'+left_block_id).attr("data-language"));
	}else{
    display_form_field($this.attr("data-field"),$this.attr("data-language"));
	}
  });



  function display_form_field(field_name,label,index,type){
    $('.form_preview').show();
    $('.copy_code').hide();

    var field_element="";
    var insert_field="";

    if ($('#field_' + field_name).val()==0) {
      if (field_name == 'custom' + index) {
        $('#custom' + index).addClass("active");
        $('.' + field_name + '_fld').remove();
		field_element = 'custom' + index;
        field_name = $('#' + field_name + '_field_name').val();
      }

      var custom_fld_name = field_name.split(' ').join('_') ;
      custom_fld_name = field_name.split("'").join('_') ;  
      if (field_name == "") {
        $('.' + field_name + '_fld').remove();
      } else {
		var icon_trash_class = 'field_add_toggle';
        if (label == "Custom") {
          label = field_name;
		  icon_trash_class = 'delete_custom';
        } else if (typeof label === "object") {
          var fld_label = label.attributes["data-language"].value;
        }

        insert_field = [
          "<tr class='field_",custom_fld_name," custom",index,"_fld' name='custom",index,"'>",
            "<td>",
              "<label class='form-title-label'>",
                "<span class='form-label update-language-",custom_fld_name,"'>",
                  label,
                "</span>",
				"<i class='icon-move'></i><i class='icon-trash ",icon_trash_class,"' id='",custom_fld_name,"'></i>",
              "</label>",
              "<br/>"];

              if (type === "text" || !type) {
                insert_field.push("<input type='text' name='signup[",index,"]' id='signup_",field_name,"' maxlength='50' size='40' />");
                insert_field.push("<input type='hidden' class='fld_sequence_name' name='fld_sequence[fld_name][]' value='",custom_fld_name,"' />");
                insert_field.push("<input type='hidden' class='fld_sequence_type' name='fld_sequence[fld_type][]' value='text' />");
                insert_field.push("<input type='hidden' class='fld_sequence_required' name='fld_sequence[fld_required][]' value='N' />");
                insert_field.push("<input type='hidden' class='fld_sequence_options' name='fld_sequence[fld_options][]' value='' />");
              } else if (type === "textarea") {
                insert_field.push("<textarea name='signup[",index,"]' id='signup_",field_name,"'></textarea>");
                insert_field.push("<input type='hidden' class='fld_sequence_name' name='fld_sequence[fld_name][]' value='",custom_fld_name,"' />");
                insert_field.push("<input type='hidden' class='fld_sequence_type' name='fld_sequence[fld_type][]' value='textarea' />");
                insert_field.push("<input type='hidden' class='fld_sequence_required' name='fld_sequence[fld_required][]' value='N' />");
                insert_field.push("<input type='hidden' class='fld_sequence_options' name='fld_sequence[fld_options][]' value='' />");
              } else if (type === "dropdown") {
                var options = $('#' + field_element + '_field_name_options').val().split(",");

                insert_field.push("<div class='input-option-container'>");

                insert_field.push("<select name='signup[",index,"]' id='signup_",field_name,"'>");
                insert_field.push("<option value=''>--</option>");
                for (var x = 0; x < options.length; x++) {
                  insert_field.push("<option value='");
                  insert_field.push(options[x]);
                  insert_field.push("'>");
                  insert_field.push(options[x]);
                  insert_field.push("</option>");
                }
                insert_field.push("</select>");

                insert_field.push("<input type='hidden' class='fld_sequence_name' name='fld_sequence[fld_name][]' value='",custom_fld_name,"' />");
                insert_field.push("<input type='hidden' class='fld_sequence_type' name='fld_sequence[fld_type][]' value='dropdown' />");
                insert_field.push("<input type='hidden' class='fld_sequence_required' name='fld_sequence[fld_required][]' value='N' />");
                insert_field.push("<input type='hidden' class='fld_sequence_options' name='fld_sequence[fld_options][]' value='",$('#' + field_element + '_field_name_options').val(),"' />");
                insert_field.push("</div>");
              } else if (type === "checkbox") {
                var options = $('#' + field_element + '_field_name_options').val().split(",");

                insert_field.push("<div class='input-option-container'>");
                for (var x = 0; x < options.length; x++) {
                  insert_field.push("<div class='input-option-fields'>");
                  insert_field.push("<input type='checkbox' name='signup[",index,"]' id='signup_",field_name,x,"' value='",options[x],"' />");
                  insert_field.push("<label for='signup_",field_name,x,"'>",options[x],"</label>");
                  insert_field.push("</div>");
                }
                insert_field.push("<input type='hidden' class='fld_sequence_name' name='fld_sequence[fld_name][]' value='",custom_fld_name,"' />");
                insert_field.push("<input type='hidden' class='fld_sequence_type' name='fld_sequence[fld_type][]' value='checkbox' />");
                insert_field.push("<input type='hidden' class='fld_sequence_required' name='fld_sequence[fld_required][]' value='N' />");
                insert_field.push("<input type='hidden' class='fld_sequence_options' name='fld_sequence[fld_options][]' value='",$('#' + field_element + '_field_name_options').val(),"' />");
                insert_field.push("</div>");
              } else if (type === "radio") {
                var options = $('#' + field_element + '_field_name_options').val().split(",");

                insert_field.push("<div class='input-option-container'>");
                for (var x = 0; x < options.length; x++) {
                  insert_field.push("<div class='input-option-fields'>");
                  insert_field.push("<input type='radio' name='signup[",index,"]' id='signup_",field_name,x,"' value='",options[x],"' />");
                  insert_field.push("<label for='signup_",field_name,x,"'>",options[x],"</label>");
                  insert_field.push("</div>");
                }
                insert_field.push("<input type='hidden' class='fld_sequence_name' name='fld_sequence[fld_name][]' value='",custom_fld_name,"' />");
                insert_field.push("<input type='hidden' class='fld_sequence_type' name='fld_sequence[fld_type][]' value='radio' />");
                insert_field.push("<input type='hidden' class='fld_sequence_required' name='fld_sequence[fld_required][]' value='N' />");
                insert_field.push("<input type='hidden' class='fld_sequence_options' name='fld_sequence[fld_options][]' value='",$('#' + field_element + '_field_name_options').val(),"' />");
                insert_field.push("</div>");
              } else if (type === "date_dropdown") {
                insert_field.push("<div class='input-option-container'>");
                insert_field.push("<div class='input-option-field'>");

                // Select Month
                insert_field.push("<select class='input-option-date'>");
                insert_field.push("<option default>Month</option>");
                for (var x = 1; x <= 12; x++) {
                  insert_field.push("<option value='",x,"'>",x,"</option>");
                }
                insert_field.push("</select>");

                // Select Day
                insert_field.push("<select class='input-option-date'>");
                insert_field.push("<option default>Day</option>");
                for (var x = 1; x <= 31; x++) {
                  insert_field.push("<option value='",x,"'>",x,"</option>");
                }
                insert_field.push("</select>");

                // Select Year
                var year = (new Date()).getFullYear() + 20;
                insert_field.push("<select class='input-option-date last'>");
                insert_field.push("<option default>Year</option>");

                for (var x = 1900; x <= year; x++) {
                  insert_field.push("<option value='",x,"'>",x,"</option>");
                }

                insert_field.push("</select>");

                insert_field.push("</div>");
                insert_field.push("<input type='hidden' class='fld_sequence_name' name='fld_sequence[fld_name][]' value='",custom_fld_name,"' />");
                insert_field.push("<input type='hidden' class='fld_sequence_type' name='fld_sequence[fld_type][]' value='date_dropdown' />");
                insert_field.push("<input type='hidden' class='fld_sequence_required' name='fld_sequence[fld_required][]' value='N' />");
                insert_field.push("<input type='hidden' class='fld_sequence_options' name='fld_sequence[fld_options][]' value='' />");
                insert_field.push("</div>");
              }

            insert_field.push("</td>");
          insert_field.push("</tr>");

        insert_field = insert_field.join("");

        $('#field_' + field_name).val("is_" + field_name);
        $('#field_' + field_name).siblings(".field_required_toggle").removeClass("disabled");
        $('.subscribe_to_list').before(insert_field);
        $('#' + field_name).addClass("active");
      }

    } else {
      if (field_name=='custom'+index) {
        $('#custom'+index).removeClass("active");
        field_name=$('#'+field_name+'_field_name').val();
        label=$('#'+field_name+'_field_name').val();
      }

    // Disable Required Checkbox
      $("#update-language-" + field_name + "-data").find("input.field_required_toggle").removeAttr("checked");
      $("#update-language-" + field_name + "-data").find("input.field_required_toggle").addClass("disabled");
      $('#field_'+field_name+'_required').val(0);

      $('.field_'+field_name).remove();
      $('#field_'+field_name).val(0);
      $('#'+field_name).removeClass("active")
    }
  }

  $(document).delegate(".add-sign-up-field input.field_required_toggle","click",function(e) {
    var $this = $(this);

    display_required_field($this.parents(".add-sign-up-field").attr("data-field"),$this.attr("checked"), $this, e);
  });



  function display_required_field(field_name,enabled, $el, event) {
    if ($('#field_' + field_name).val() == 0) {
      event.preventDefault();
    } else {
      if (!field_name) {
        field_name = $el.parents('.add-sign-up-field').find('.custom_text').val().replace(/ /g,"_");
      }

      if (enabled) {
        $('.field_'+field_name).find(".form-label").append("<span>*</span>");
        $('#field_'+field_name+'_required').val(1);
        $('.fld_sequence_name').each(function(){ if( $(this).val() == field_name )$(this).siblings('.fld_sequence_required').val('Y');});
      } else {
        $('.field_'+field_name).find(".form-label").children("span").not(".form-label").remove();
        $('#field_'+field_name+'_required').val(0);
        $('.fld_sequence_name').each(function(){ if( $(this).val() == field_name )$(this).siblings('.fld_sequence_required').val('N');});
      }
    }
  }

  function updateLanguage(target) {
    var data = "name = email = first_name = last_name = company = address = city = state = zip_code = country";

    jQuery.ajax({
        url: base_url+"newsletter/signup/signup_translate",
        type:"POST",
        data:{
          language: target,
          languageText: $("#form_language option:selected").text()
        },
        success: function(data) {
          if (data) {
            updateLanguageFields(data);
          }
        }
    });

  }

  function updateLanguageFields(data) {
    var items = ["update-language-name","update-language-email","update-language-first_name","update-language-last_name","update-language-company","update-language-address","update-language-city","update-language-state","update-language-zip_code","update-language-country"],
        translated = data.split("=");

    for (var x = 0; x < translated.length; x++) {
		$("." + items[x]).html(translated[x]);

		if (document.getElementById(items[x] + "-data")) {
		  document.getElementById(items[x] + "-data").attributes["data-language"].value = translated[x];
		}
    }
	var str_confirmation_email_msg = translated[10]+"\n"+translated[11]+"\n\n"+translated[12];
	$('#confirmation_emai_message').val(str_confirmation_email_msg);
	
  }




  /**
  *  Open Colorpicker for background color of form
  */
  $(document).ready(function(){
  // Alert User Before Leaving Page
    function closeEditorWarning(){
      return "All UNSAVED changes will be LOST if you leave this page. Please SAVE your changes if you wish to keep them.";
    }

    $("select, input").live("change", function() {
      window.onbeforeunload = closeEditorWarning
    });

    $('#form_background_color').ColorPicker({
      onBeforeShow: function () {
        $(this).ColorPickerSetColor(this.value);
      },
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        //return false;
      },
      onHide: function (colpkr) {
        $(colpkr).hide(500);
        //return false;
      },
      onSubmit: function (hsb, hex, rgb,el) {
        $('#form_background_color').val('#'+hex);
        $('#form_background_color').css('color','#'+hex);
        $('#form_background_color').css('background-color','#'+hex);
        $('.signupform_code_td').css('background-color','#'+hex);
        $(el).ColorPickerHide();
      }
    });

    $('#header_background_color').ColorPicker({
      onBeforeShow: function () {
        $(this).ColorPickerSetColor(this.value);
      },
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        //return false;
      },
      onHide: function (colpkr) {
        $(colpkr).hide(500);
        //return false;
      },
      onSubmit: function (hsb, hex, rgb,el) {
        $('#header_background_color').val('#'+hex);
        $('#header_background_color').css('color','#'+hex);
        $('#header_background_color').css('background-color','#'+hex);
        $('.form_title div').css('background-color','#'+hex);
        $(el).ColorPickerHide();
      }
    });

    $('#header_text_color').ColorPicker({
      onBeforeShow: function () {
        $(this).ColorPickerSetColor(this.value);
      },
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        //return false;
      },
      onHide: function (colpkr) {
        $(colpkr).hide(500);
        //return false;
      },
      onSubmit: function (hsb, hex, rgb,el) {
        $('#header_text_color').val('#'+hex);
        $('#header_text_color').css('color','#'+hex);
        $('#header_text_color').css('background-color','#'+hex);
        $('.form_title div').css('color','#'+hex);
        $(el).ColorPickerHide();
      }
    });
  });

  $(".signup-style-options").live("click",function() {
    var $icon = $(this).children("i");

    if ($icon.hasClass("icon-minus")) {
      $icon.removeClass("icon-minus").addClass("icon-plus");
      $(".signup-tbl-inline").find(".signupform_code_td").addClass("expanded");
      $(".form-info").removeClass("show");
    } else {
      $icon.removeClass("icon-plus").addClass("icon-minus");
      $(".signup-tbl-inline").find(".signupform_code_td").removeClass("expanded");
      $(".form-info").addClass("show");
    }
  });

  $('#btn_add_other_eml').live('click', function(){
  $.fancybox($('#add_other_from_emails').html(),{ 'autoDimensions':false,'height':'190','width':'530','centerOnScroll':true,'modal':false});
  }
);




function save_another_eml(){
  var newEml = encodeURIComponent($('#fancybox-wrap').find('#another_emailid').val());
  $.blockUI({ message: '<h3 class="please-wait">Please wait...</h3>' });
  jQuery.ajax({
    url: base_url+"newsletter/campaign_email_setting/add_another_emailid/",
    type:"POST",
    data:'newEml='+newEml,
    success: function(data) {

      if(data =='err'){
        $('#fancybox-wrap').find('#errInvalid').text('* Invalid Email');
      }else{
        setTimeout("$.fancybox($('#verify_eml').html(),{ 'autoDimensions':false,'height':'210','width':'430','centerOnScroll':true,'modal':false});", 100);
        //$.fancybox.close();
      }
    }
  });
  $.unblockUI();
}
function updateFromEmailDpd() {
$.blockUI({ message: '<h3 class="please-wait">Please wait...</h3>' });
    jQuery.ajax({
    url: base_url+"newsletter/campaign_email_setting/ajaxFromEmlArray/",
    type:"POST",
    success: function(data) {
      var arrData = data.split(',');
      $('#from_email option').remove();
      $.each(arrData, function (index, value) {
        $('#from_email').append($('<option>', { value: value, text : value }));
      });

    }
  });
$.unblockUI();
}



// form related functions
  function submit_form(showCode){
  window.onbeforeunload = null;

  $('.info').html('');
    $.blockUI({ message: '<h3 class="please-wait">Please wait...</h3>' });

   // var block_data =$('#frmListing').serialize();
	var block_data="action="+encodeURIComponent('save');
block_data+="&form_name="+encodeURIComponent($('#form_name').val());
block_data+="&form_title="+encodeURIComponent($('#form_title').val());
block_data+="&form_button_text="+encodeURIComponent($('#form_button_text').val());
block_data+="&form_background_color="+encodeURIComponent($('#form_background_color').val());
block_data+="&header_text_color="+encodeURIComponent($('#header_text_color').val());
block_data+="&header_background_color="+encodeURIComponent($('#header_background_color').val());
block_data+="&header_background_image="+encodeURIComponent($('#header_background_image').val());
block_data+="&background_background_image="+encodeURIComponent($('#background_background_image').val());
block_data+="&background_background_tile_image="+encodeURIComponent($('#background_background_tile_image').val());
block_data+="&selectedSubscriptionValues="+encodeURIComponent($('#selectedSubscriptionValues').val());

block_data+="&fld_sequence="+$('#form_preview').find('input').serialize();
    jQuery.ajax({
      url: base_url+"newsletter/signup/signup_edit/"+sid+"/true/ajax/",
       type:"POST",
      data: block_data,
      success: function(data) {
    $.unblockUI();
        var data_arr=data.split('|');
        if(data_arr[0]=="error"){
          $('.info').html(data_arr[1]);
          $('.info').show();
          $(document).scrollTop(0);
        } else {
        sid=data_arr[1];
      if(showCode){
        // submit_custom_message();
         jQuery.ajax({
          url: base_url+"newsletter/signup/subscribe/"+sid+"/code",
          type:"POST",
          success: function(data) {
            $('textarea#showSignupCode').html(data).text();
            $('input#copy_link').val(copy_link+sid);
          }
        });
        $.fancybox({ 'content' : $("#copy-code").html() });
      }
        }
      }
    /*,
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }*/
    });
  }

  function submit_custom_message() {
    window.onbeforeunload = null;
    var block_data="";
    var confirmation_thanks_you_message_url='';
    if($('#confirmation_thanks_you_message_url').val().toLowerCase()=="http://"){
      confirmation_thanks_you_message_url='';
    }else{
      confirmation_thanks_you_message_url=$('#confirmation_thanks_you_message_url').val();
    }
    block_data+="confirmation_thanks_you_message_url="+encodeURIComponent(confirmation_thanks_you_message_url);
    var singup_thank_you_message_url='';
    if($('#singup_thank_you_message_url').val().toLowerCase()=="http://"){
      singup_thank_you_message_url='';
    }else{
      singup_thank_you_message_url=$('#singup_thank_you_message_url').val();
    }
    block_data+="&singup_thank_you_message_url="+encodeURIComponent(singup_thank_you_message_url);
    block_data+="&from_name="+encodeURIComponent($('#from_name').val());
    block_data+="&from_email="+encodeURIComponent($('#from_email').val());
    block_data+="&subject="+encodeURIComponent($('#subject').val());
    block_data+="&confirmation_emai_message="+encodeURIComponent($('textarea#confirmation_emai_message').val());
    block_data+="&custom_frm_action="+encodeURIComponent($('#custom_frm_action').val());
    block_data+="&form_language="+encodeURIComponent($('#form_language').val());

    jQuery.ajax({
      url: base_url+"newsletter/signup/signup_custom_frm/"+sid,
       type:"POST",
      data:block_data,
      success: function(data) {
        var data_arr=data.split(":", 2);
        if(data_arr[0]=="error"){
          //fancyAlert(data_arr[1]);
        }else{
          $.fancybox.close();
        }
      }
    /*,
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }*/
    });
  }

  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }



  if (window.location.href.indexOf("showCodePopup") != -1) {
    $(function() {
      showCodePopup();
    });
  }

  $(function() {

  /**
  * Upload BG Images
  */
  jQuery('#hbg_file').live('change',function(){ $("#add_hbg").removeClass("loading"); });
  jQuery('#add_hbg').live('click',function(){
    $.blockUI({ message: '<h3 class="please-wait">Please wait...</h3>' });
    jQuery('#hbg_file').upload(base_url+'ajax/signup_background_img/hbg/', function(res) {
      var image_obj=res.split('|');
      if(image_obj[0] == 'noerr'){
        var img_path=image_obj[1];
        $('#header_background_image').val(img_path);
        $('.tdheader').children('img#header-img').remove();
        $('.tdheader').append($('<img/>').attr({'src': img_path,'id':'header-img','style':'width:100%;height:auto;margin-top:-71px;padding-bottom:15px;'}));
      }else{
        if(image_obj[1]==1)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-warning-sign"></i>The uploaded file was too large, please upload a file that is less than 2 MB.</div>');
        else if(image_obj[1]==2)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-warning-sign"></i>Invalid file type. Please upload one of the following supported types: JPG, GIF and PNG.</div>');
        else if(image_obj[1]==3)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-warning-sign"></i>The file type you are attempting to upload is not allowed. Please upload one of the following supported types: JPG, GIF and PNG.</div>');
        else if(image_obj[1]==4)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-lightbulb"></i>File could not be uploaded, please try again later.</div>');
        else if(image_obj[1]==5)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-lightbulb"></i>File could not be uploaded, please try again later.</div>');
      }
    $("#add_hbg").addClass("loading");
    $.unblockUI();
    });
  });

  jQuery('#bbg_file').live('change',function(){ $("#add_bbg").removeClass("loading"); });
  jQuery('#add_bbg').live('click',function(){
    $.blockUI({ message: '<h3 class="please-wait">Please wait...</h3>' });

    jQuery('#bbg_file').upload(base_url+'ajax/signup_background_img/bbg/', function(res) {
      var image_obj=res.split('|');
      if(image_obj[0] == 'noerr'){
        var img_path=image_obj[1];
        $('#background_background_image').val(img_path);
        $('.signupform_code_td').css("background-image", "url("+img_path+")");
        if ($("#background_background_tile_image").attr("checked")) {
          $('.signupform_code_td').css("background-repeat", "repeat");
        } else {
          $('.signupform_code_td').css("background-repeat", "no-repeat");
        }
        $.fancybox.close();
      }else{
        if(image_obj[1]==1)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-warning-sign"></i>The uploaded file was too large, please upload a file that is less than 2 MB.</div>');
        else if(image_obj[1]==2)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-warning-sign"></i>Invalid file type. Please upload one of the following supported types: JPG, GIF and PNG.</div>');
        else if(image_obj[1]==3)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-warning-sign"></i>The file type you are attempting to upload is not allowed. Please upload one of the following supported types: JPG, GIF and PNG.</div>');
        else if(image_obj[1]==4)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-lightbulb"></i>File could not be uploaded, please try again later.</div>');
        else if(image_obj[1]==5)fancyAlert('<div class="signup-tbl-file-error"><i class="icon-lightbulb"></i>File could not be uploaded, please try again later.</div>');
      }
    $("#add_bbg").addClass("loading");
    $.unblockUI();
    });

  });
    $("#background_background_tile_image").live("change", function() {
      if ($(this).attr("checked")) {
        $('.signupform_code_td').css("background-repeat", "repeat");
      } else {
        $('.signupform_code_td').css("background-repeat", "no-repeat");
      }
    });

  });

  function showAdvancedPopup() {
  $.blockUI({ message: '<h3 class="please-wait">Please wait...</h3>' });
  jQuery.ajax({
      url: base_url+"newsletter/signup/getAdvanced/",
      type:"POST",
      success: function(data) {
    //$('#advanced-signup-tbl').html(data);
    $.fancybox({
      content    : data
    });
    $.unblockUI();
      }
    });


  }

  $("#save-advanced-section").live("click",function() {
    submit_custom_message();
  });

  $("#cancel-advanced-section").live("click",function() {
    $.fancybox.close();
  });

  $(".remove-background-image").live("click",function() {
    $('.signupform_code_td').css("background-image", "");
  $('#background_background_image').val('');
  });

  $(".remove-header-background-image").live("click",function() {
   $('.tdheader').children('img#header-img').remove();
    $('#header_background_image').val('');
  });


$(document).ready(function() {
  $("#form_preview").sortable({
    handle: ".icon-move",
    axis: "y"
  });

  var removeCustomField = function($popupLocation,$removeTarget) {
    jQuery($popupLocation).fastConfirm({
      position: "top",
      questionText: "This will permanently remove this field from your sign-up form. Are you sure?",
      onProceed: function(trigger) {
        var custom_field_val= $removeTarget.parents('.add-sign-up-field').find('.custom_text').val();

        if(custom_field_val == undefined){
          var custom_field_val= $removeTarget.parents('.form-title-label').find('.form-label').text();
        }

        custom_field_val = custom_field_val.split(' ').join('_').replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1");
        var left_col_fld_block = $('.field_' + custom_field_val).attr('name');

        if (custom_field_val != "") {
          $('.field_' + custom_field_val).remove();
          $('#' + left_col_fld_block).remove();
          $removeTarget.parents('.add-sign-up-field').remove();
        } else {
          $removeTarget.parents('.add-sign-up-field').remove();
        }
      },
      onCancel: function(trigger) { }
    });
  };

  $('.delete_custom').live('click',function () {
    var $this = $(this);

    removeCustomField($this,$this);
  });

  $(".icon-trash").live("click",function(e) {
    var className = $(this).parents("tr").first().attr("class"),
        classNames = className.split(" "),
        $this = $(this);

    // Custom Class
    if (classNames.length !== 1 && className.indexOf("_fld")) {
      var target;
      if (classNames[0].indexOf("_fld") !== -1) {
        target = classNames[0].replace("_fld","");
      } else if (classNames[1].indexOf("_fld") !== -1) {
        target = classNames[1].replace("_fld","");
      }

      target = "#" + target;

      removeCustomField($this,$(target).find(".delete_custom"));
    } else {
      var target = "#" + classNames[0];
      $(target).trigger("click");
    }
  });
});
