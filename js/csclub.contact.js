$(document).ready( function() {
  // Form submission
  $("#contact-submit").on("click", function (e) {
    e.preventDefault();
    $("#contact-form").trigger('submit');
  });
  $("#contact-form").on("submit", function (e) {
    e.preventDefault();
    $("#contact-form input, #contact-form textarea").removeClass("invalid");
    $("#contact-submit").attr("disabled", true);
    // Validate the form inputs
    var results = validateForm();
    // console.log(results);
    var scroll_to = Number.MAX_SAFE_INTEGER;
    // If validation fails
    if (results["errors"].length > 0) {
      results["errors"].each(function (index, value) {
        // console.log($(value).prop("tagName"));
        if ($(value).prop("tagName") == "INPUT" || $(value).prop("tagName") == "TEXTAREA") {
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
      $("#contact-submit").attr("disabled", false);
    } else {
      // If validation passes
      $('#loading').removeClass('hide');
      Materialize.toast('<i class="material-icons">done</i>Processing request', 8000)
      var form_data = formToJson('#contact-form');
      // console.log(form_data);
      
      // ** DEVELOPMENT - Test completing request
      setTimeout(function() {
        Materialize.toast('<i class="material-icons">done</i>Success!', 8000, 'green');
        $('#contact-form .card-content').empty().append(
          '<h3 class="cs-dark center">Thanks for contacting CS Club '+($(form_data.first_name).text() ? ' '+$(form_data.first_name).text() : ' '+form_data.first_name)+'!</h3>'
        ).append(
          '<p class="flow-text center">We look forward to reading your message and getting back to you soon.</p>'
        );
        var card = $('#contact-form .card');
        $('#contact-form .card-header').remove();
        $('#contact-form .card-action').remove();
        $('#contact-form').remove();
        $('.form-row').append(card);
        if (!isElementInViewport($('main'))) {
          $("html, body").animate({
            scrollTop: $('main').offset().top - 100
          }, 800, 'easeInOutQuart');
        }
      }, 1000);
      // ** DEVELOPMENT END
      
      // Send request to server
      // $.ajax({
      //   url: "https://#", // Server app url
      //   type: "POST",
      //   data: form_data,
      //   success: function (data) {
      //     Materialize.toast('<i class="material-icons">done</i>Success!', 8000, 'green');
      //     $('#contact-form .card-content').empty().append(
      //       '<h3 class="cs-dark center">Thanks for contacting CS Club '+($(form_data.first_name).text() ? ' '+$(form_data.first_name).text() : ' '+form_data.first_name)+'!</h3>'
      //     ).append(
      //       '<p class="flow-text center">We look forward to reading your message and getting back to you soon.</p>'
      //     );
      //     var card = $('#contact-form .card');
      //     $('#contact-form .card-header').remove();
      //     $('#contact-form .card-action').remove();
      //     $('#contact-form').remove();
      //     $('.form-row').append(card);
      //     if (!isElementInViewport($('main'))) {
      //       $("html, body").animate({
      //         scrollTop: $('main').offset().top - 100
      //       }, 800, 'easeInOutQuart');
      //     }
      //     // console.log(data);
      //   }
      // });
    }
  });
});

/*
 * Validates all inputs of the contact form
 * @return {Object} An object containing "errors".
 */
function validateForm() {
  var results = {};
  var required_fields = $("input[required], textarea[required]").filter(function (index, element) {
    return $.trim($(this).val()).length == 0;
  });
  results["errors"] = required_fields;

  return results;
}