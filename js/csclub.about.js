$(document).ready(function () {
  $('#slack-invite').on('opened', function (e) {
    if ($('#slack-invite .collapsible-header').hasClass('active')
      && !isElementInViewport($('#slack-invite'))) {
      $("html, body").animate({
        scrollTop: $("#slack-invite").offset().top - window.innerHeight / 5
      }, 1000, 'easeInOutQuart');
    }
  });

  // Form submission
  $("#slack-submit").on("click", function (e) {
    e.preventDefault();
    $("#slack-form").trigger('submit');
  });
  $("#slack-form").on("submit", function (e) {
    e.preventDefault();
    $("#slack-form input").removeClass("invalid");
    $("#slack-submit").attr("disabled", true);
    // Validate the form inputs
    var results = validateForm();
    var scroll_to = Number.MAX_SAFE_INTEGER;
    // If validation fails
    if (results["errors"].length > 0) {
      results["errors"].each(function (index, value) {
        if ($(value).prop("tagName") == "INPUT") {
          $(value).addClass('invalid');
        } else {
          $(value).addClass('invalid-bg');
        }
        if ($(value).offset().top < scroll_to) {
          scroll_to = $(value).offset().top;
        }
      });
      $("html, body").animate({
        scrollTop: scroll_to - 200
      }, 800, 'easeInOutQuart');
      Materialize.toast('<i class="material-icons">report_problem</i>Please fill out all required sections.', 8000, 'pink');
      $("#slack-submit").attr("disabled", false);
    } else {
      // If validation passes
      $('#loading').removeClass('hide');
      Materialize.toast('<i class="material-icons">done</i>Processing request', 8000)
      var form_data = formToJson('#slack-form');
      // console.log(form_data);

      // ** DEVELOPMENT - Test completing request
      setTimeout(function () {
        Materialize.toast('<i class="material-icons">done</i>Success!', 8000, 'green');
        $('#loading').addClass('hide');
        $('#slack-form').remove();
        var message = $('<p class="flow-text green-text">Thanks for submitting your request!</p>');
        $('#slack-invite .collapsible-body').append(message);
      }, 1000);
      // ** DEVELOPMENT END

      // Send request to server
      // $.ajax({
      //   url: "https://#", // Server app url
      //   type: "POST",
      //   data: form_data,
      //   success: function (data) {
      //     Materialize.toast('<i class="material-icons">done</i>Success!', 8000, 'green');
      //     $('#loading').addClass('hide');
      //     $('#slack-form').remove();
      //     var message = $('<p class="flow-text green-text">Thanks for submitting your request!</p>');
      //     $('#slack-invite .collapsible-body').append(message);
      //     // console.log(data);
      //   }
      // });
    }
  });
});

/*
 * Validates all inputs of the slack form
 * @return {Object} An object containing "errors".
 */
function validateForm() {
  var results = {};
  var required_fields = $("input[required]").filter(function (index, element) {
    return $.trim($(this).val()).length == 0;
  });
  results["errors"] = required_fields;

  return results;
}