$(document).ready(function() {
	//tracks year level
	var level = "";
	/* Availability checkbox manipulation */
	// If "none" option is checked, uncheck all other options
	$('.availability-options input#none').on('change', function() {
		if ($(this).prop('checked')) {
			$('.availability-options input:not(#none)').prop('checked', false);
		}
	});
	// If an option (not "none") is checked while "none" is checked, uncheck "none"
	$('.availability-options input:not(#none)').on('change', function() {
		if ($(this).prop('checked') && $('.availability-options input#none').prop('checked')) {
			$('.availability-options input#none').prop('checked', false);
		}
	});

	/* Degree radio button manipulation */
	// Focus on the "Please specify" field when "Other" degree option is selected
	$('.degree-options input#other_degree').on('click', function() {
		if ($(this).is(':checked')) {
			$('.degree-options input#degree6').focus();
		}
	});
	// If the "Please specify" field is selected, also select the radio button
	$('.degree-options input#degree6').on('click', function() {
		$('.degree-options input#other_degree').prop('checked', true);
	});

	/* study radio button manipulation */
	// Focus on the "Please specify" field when "Other" study option is selected
	$('.study-options input#other_postgrad').on('click', function() {
		if ($(this).is(':checked')) {
			$('.study-options input#study3').focus();
		}
	});
	$('.study-options input#other_study').on('click', function() {
		if ($(this).is(':checked')) {
			$('.study-options input#study4').focus();
		}
	});
	// If the "Please specify" field is selected, also select the radio button
	$('.study-options input#study3').on('click', function() {
		$('.study-options input#other_postgrad').prop('checked', true);
	});
	$('.study-options input#study4').on('click', function() {
		$('.study-options input#other_study').prop('checked', true);
	});

	/* Events checkbox manipulation */
	// Focus on the "Please specify" field when "Other" events option is checked
	$('.event-options input#other_event_check').on('click', function() {
		if ($(this).is(':checked')) {
			$('.event-options input#other_event').focus();
		}
	});
	// If the "Please specify" field is selected, check the "Other" event option checkbox
	$('.event-options input#other_event').on('click', function() {
		$('.event-options input#other_event_check').prop('checked', true);
	});

	// Form submission
	$('#submit').on('click', function(e) {
		e.preventDefault();
		$('#join-form').trigger('submit');
	});
	$('#join-form').on('submit', function(e) {
		e.preventDefault();
		$('#join-form input').removeClass('invalid');
		$('#join-form ul').removeClass('invalid-bg');
		$('#submit').attr('disabled', true);
		// Validate the form inputs
		var results = validateForm();
		var scroll_to = Number.MAX_SAFE_INTEGER;
		// If validation fails
		if (results['gcaptcha_token'] === 0) {
			Materialize.toast(
				"<i class='material-icons'>report_problem</i>Please prove you're not a robot.",
				8000,
				'pink',
			);
			$('#submit').attr('disabled', false);
		} else if (results['errors'].length > 0) {
			results['errors'].each(function(index, value) {
				if ($(value).prop('tagName') == 'INPUT') {
					$(value).addClass('invalid');
				} else {
					$(value).addClass('invalid-bg');
				}
				if ($(value).off().top < scroll_to) {
					scroll_to = $(value).offset().top;
				}
			});
			$('html, body').animate(
				{
					scrollTop: scroll_to - 200,
				},
				800 / ($(results['errors'][0]).offset().top / 500),
			);
			Materialize.toast(
				'<i class="material-icons">report_problem</i>Please fill out all required sections.',
				8000,
				'pink',
			);
			$('#submit').attr('disabled', false);
		} else {
			// If validation passes
			$('#loading').removeClass('hide');
			Materialize.toast('<i class="material-icons">done</i>Processing request', 8000);
			var form_data = formToJson('#join-form');
            
            switch($('input[name=degree][type=radio]:checked').val()){
                case 'other':
                    form_data["degree"] = "Other: " + $('input#degree6').val()
                    break;
                default:
                    form_data["degree"] = $('input[name=degree][type=radio]:checked').val()
                    break;
                    
            }
            
            switch($('input[name=study][type=radio]:checked').val()){
                case 'Postgraduate':
                    form_data["study"]= "Postgraduate: " + $('input#study3').val()
                break;
                case 'Other':
                    form_data["study"]= "Other: " + $('input#study4').val()
                break;
                default:
                    form_data["study"] = $('input[name=study][type=radio]:checked').val();
                break;
            }
            
			firebase
				.database()
				.ref('2018/' + form_data.first_name + '_' + form_data.last_name)
				.set(form_data);
			// console.log(form_data);

			// ** DEVELOPMENT - Test completing request
			var colours = ['blue', 'yellow', 'pink', 'dark'];
			var colour = colours[Math.floor(Math.random() * colours.length)];
			setTimeout(function() {
				Materialize.toast('<i class="material-icons">done</i>Success!', 8000, 'green');
				$('#join-form .card-content')
					.empty()
					.attr('style', '')
					.append(
						'<h3 class="cs-' +
							colour +
							' center">Thanks for joining the CS Club' +
							($(form_data.first_name).text()
								? ' ' + $(form_data.first_name).text()
								: ' ' + form_data.first_name) +
							'!</h3>',
					)
					.append(
						'<p class="flow-text center">You will receive an official welcome and introduction email soon.</p> \
          <p class="flow-text center">In the meantime, check out the club <a href="https://www.facebook.com/compsci.adl/" target="_blank" title="CS Club Facebook Page">Facebook page</a> to see what events are coming up.</p>',
					);
				var card = $('#join-form .card');
				$('#join-form .card-header').remove();
				$('#join-form .card-action').remove();
				$('#join-form').remove();
				$('#join .material-tooltip').remove();
				$('.section .container .row').append(card);
			}, 1000);
			// ** DEVELOPMENT END

			// Send request to server
			// $.ajax({
			//   url: "https://#", // Server app url
			//   type: "POST",
			//   data: form_data,
			//   success: function (data) {
			//     Materialize.toast('<i class="material-icons">done</i>Success!', 8000, 'green');
			//     $('#join-form .card-content').empty().attr('style', '').append(
			//       '<h3 class="cs-'+colour+' center">Thanks for joining the CS Club'+($(form_data.first_name).text() ? ' '+$(form_data.first_name).text() : ' '+form_data.first_name)+'!</h3>'
			//     ).append(
			//       '<p class="flow-text center">You will receive an official welcome and introduction email soon.</p> \
			//       <p class="flow-text center">In the meantime, check out the club <a href="https://www.facebook.com/compsci.adl/" target="_blank" title="CS Club Facebook Page">Facebook page</a> to see what events are coming up.</p>'
			//     );
			//     var card = $('#join-form .card');
			//     $('#join-form .card-header').remove();
			//     $('#join-form .card-action').remove();
			//     $('#join-form').remove();
			//     $('#join .material-tooltip').remove();
			//     $('.section .container .row').append(card);
			// console.log(data);
			//   }
			// });
		}
	});

	/*
     * Validates all inputs of the join form
     * @return {Object} An object containing "errors" and "response_token".
     */
		function validateForm() {
		var results = {};
		var required_fields = $('input[required]').filter(function(index, element) {
			return $.trim($(this).val()).length == 0;
		});
		
		if ($('input[name=degree][type=radio]:checked').length == 0) {
			required_fields.push($('.degree-options')[0]);
		} else {
			// Check if other is checked
			if (
				$('input[name=degree][type=radio]:checked').val() == 'other' &&
				$.trim($('input[name=degree][type=text]').val()).length == 0
			) {
				required_fields.push($('input#degree6')[0]);
			}
		}

		if ($('input[name=study][type=radio]:checked').length == 0) {
			required_fields.push($('.study-options')[0]);
		} else {
			// Check postgrad field
			if (
				$('input[name=study][type=radio]:checked').val() == 'Postgraduate' &&
				$.trim($('input[name=study][type=text]').val()).length == 0
			) {
				required_fields.push($('input#study3')[0]);
			} else if (
				// Check if other is checked
				$('input[name=study][type=radio]:checked').val() == 'other' &&
				$.trim($('input[name=study][type=text]').val()).length == 0
			) {
				required_fields.push($('input#study4')[0]);
			}
		}
		

		var captcha_response = grecaptcha.getResponse();
		if (captcha_response.length == 0) {
			// Captcha is not Passed
			results['gcaptcha_token'] = 0;
		} else {
			results['gcaptcha_token'] = 1;
		}

		results['errors'] = required_fields;
		console.log(captcha_response);

		return results;
    }

	/*
     * Converts form data to JSON object
     * @return {Object} An object containing data from form inputs.
     */
	function formToJson(form) {
		var array = $(form).serializeArray();
		// console.log(array);
		var json = {};

		$.each(array, function() {
			if (this.value !== 'other') {
				if (json[this.name] !== undefined) {
					if (!json[this.name].push) {
						json[this.name] = [json[this.name]];
					}
					json[this.name].push(this.value || '');
				} else {
					json[this.name] = this.value || '';
				}
			}
		});

		$.each(json, function(index, value) {
			if (value.constructor === Array) {
				json[index] = value.join();
			}
		});

		return json;
	}
});
