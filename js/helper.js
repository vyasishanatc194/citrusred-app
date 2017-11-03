/**
*   function for opening login form
*/
function openDiv(){
  document.getElementById("topnav").innerHTML='<a  href="javascript:void(0);" class="signin" onclick="return closeDiv();"><span>Login</span></a>';
  $("#topnav a").addClass("menu-open");
  $("#signin_menu").slideDown("slow");
}
/**
*   function for closing login form
*/
function closeDiv(){
  document.getElementById("topnav").innerHTML='<a  href="javascript:void(0);" class="signin " onclick="return openDiv();"><span>Login</span></a>';
  $("#topnav a").removeClass("menu-open");
  $("#signin_menu").slideUp("slow");
  $('.msg').hide();
  $('.fr_msg').hide();
}
/**
*   function for show login popup window
*/
function showForgotPwd(){
  $('#signin').hide();
  $('#forgotPwdBlock').show();
  $('.msg').hide();
  $('.fr_msg').hide();
}
/**
*   function for show forgot password popup window
*/
function showLoginBlock(){
  $('#forgotPwdBlock').hide();
  $('#signin').show();
  $('.msg').hide();
  $('.fr_msg').hide();
}

$(function() {
  // function for pagination
  $(".pagination a").live('click',function(event) {
    if($(this).parents(".pagination-container").hasClass("noajax")) {
      return true;
    }
    if(!$(this).hasClass('selected')) {
      $.ajax({
         type: "POST",
         url: $(this).attr('href'),
         success: function(data){
          $('#list-container').html(data);
         }
      });
    }
    return false; // don't let the link reload the page
  });

  $(".btn-dropdown-icon").live("click",function(e) {
    e.preventDefault();

    var $parent = $(this).parent(".btn-dropdown");

    $parent.find(".btn-dropdown-list").toggleClass("show");
  });

  $(document).bind("click",function(e) {
    var $target = $(e.target);

    if (!$target.parents(".btn-dropdown-list").length) {
      $target.find(".btn-dropdown-list").removeClass("show");
    }
  });
});
