// Add EULA checkbox using JS to prevent bots
$(function() {
  $("div.sign-up-bar").find("form").append('<input type="checkbox" name="verifycheckbox" style="display:none;" checked />');
});
