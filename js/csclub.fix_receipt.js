$("#submit").click(function() {
	var email = $("#email").val()
	var receipt = $("#receipt").val()

	$("form").remove()

	$("main").append(`
    <div class="preloader-wrapper small active">
      <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  `)

	try {
		firebase
			.database()
			.ref(new Date().getFullYear() + "/")
			.orderByChild("email")
			.equalTo(email)
			.once("value")
			.then(function(snapshot) {
				if (!snapshot.exists()) {
					tryAgain()
					return
				}

				snapshot.forEach(function(snapshot) {
					snapshot.ref
						.child("square_receipt")
						.set(receipt)
						.then(function(stuff) {
							$(".preloader-wrapper").remove()
							$("main").append(`
              <div class='col s12 m6 offset-m3'>
                <div class='card'>
                  <div class='card-content'>
                    <span class='card-title'>Done</span>
                    <p>Cool, you've updated that member.</p>
                  </div>
                  <div class='card-action cs-pink'>
                    <a href=''>Fix another</a>
                  </div>
                </div>
              </div>
            `)
						})
				})
			})
			.catch(function(err) {
				tryAgain()
			})
	} catch (err) {
		tryAgain()
	}
})

function tryAgain() {
	$(".preloader-wrapper").remove()
	$("main").append(`
    <div class="col s12 m6 offset-m3">
      <div class="card">
        <div class='card-content'>
          <span class='card-title'>Oops</span>
          <p>It looks like there's no registration with this email. </p>
        </div>
        <div class='card-action cs-pink'>
          <a href=''>Try again</a>
        </div>
      </div>
    </div>
  `)
}
