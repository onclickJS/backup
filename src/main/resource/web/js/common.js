(function($) {
  $.include = function(url) {
    $.ajax({
      url: url,
      async: false,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function(result) {
        document.write(result);
      }
    });
  };
}(jQuery));

function formatDate(datetime) {
  var dateObj = new Date(datetime);
  var dateStr = dateObj.getFullYear() + "." + (dateObj.getMonth() + 1) + "."
          + dateObj.getDate();
  return dateStr;
}

function nl2brString(val) {
  if (typeof val === 'string') {
    return val.replace(/\n/g, '<br/>');
  } else {
    return val;
  }
}