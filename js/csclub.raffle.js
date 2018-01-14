$(document).ready(function() {
	getWinner()
})

function writeWinner(text) {
	$("#winner").text(text)
}

function getWinner() {
	writeWinner("I'm working on it")
	var members = firebase.database().ref("2018/")
	members
		.once("value")
		.then(function(snapshot) {
			var haveWinner = false
			while (!haveWinner) {
				var i = 0
				var rand = Math.floor(Math.random() * snapshot.numChildren())
				snapshot.forEach(function(snapshot) {
					if (i == rand) {
						if (snapshot.val().square_receipt.length > 0) {
							haveWinner = true
							writeWinner(snapshot.val().first_name + " " + snapshot.val().last_name)
						}
					}
					i++
				})
			}
		})
		.catch(function(error) {
			writeWinner("Sorry, you don't have permission to do this.")
		})
}
