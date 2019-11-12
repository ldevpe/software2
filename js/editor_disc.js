$(document).ready(function(){

  onload=(document).onkeyup=function(){
    (document.getElementById("preview").contentWindow.document).write(
      html.value
    );
    (document.getElementById("preview").contentWindow.document).close()
  };

  // Pressing the Tab key inserts 2 spaces instead of shifting focus
  $("textarea").keydown(function(event){
    if(event.keyCode === 9){
      var start = this.selectionStart;
      var end = this.selectionEnd;
      var $this = $(this);
      var value = $this.val();
      $this.val(value.substring(0, start)+"  "+value.substring(end));
      this.selectionStart = this.selectionEnd = start+1;
      event.preventDefault();
    }
  });

  // Store contents of textarea in sessionStorage
  $("textarea").keydown(function(){
      sessionStorage[$(this).attr("id")] = $(this).val();
  });
  $("#html").html(sessionStorage["html"]);
  function init() {
    if (sessionStorage["html"]) {
        $("#html").val(sessionStorage["html"]);
      }
  };

  // Clear textareas with button
  $(".clearLink").click(clearAll);

  function clearAll(){
    document.getElementById("html").value = "";
    sessionStorage.clear();
  }

});
