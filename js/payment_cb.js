jQuery(document).ready(function(){
   
   /* Checked Default condition for radio button */
   if($('.payment_type').is(':checked')) { 
       var payment_type = $('.payment_type:checked').val();
       if(payment_type == 'credit_card'){
            jQuery(".card_info_div").show();
            jQuery("#billing_form").attr('action','');
        }else{
            jQuery(".card_info_div").hide();
            jQuery("#billing_form").attr('action','https://www.paypal.com/cgi-bin/webscr');
			
        }
   }
   
   
   /* Checked Condition when click on radio button */
   jQuery(".payment_type").click(function(){
        var payment_type = $(this).val();
        if(payment_type == 'credit_card'){
            jQuery(".card_info_div").show();
            jQuery("#billing_form").attr('action','');
        }else{
            jQuery(".card_info_div").hide();
            jQuery("#billing_form").attr('action','https://www.paypal.com/cgi-bin/webscr');
        }
   });
});