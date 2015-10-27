///// Preloads images for smoother experience
$.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
  }
}

$.preloadImages("checkmark.png","minus65.png");

///// Retrieves taskList array from localStorage
function retrieveArray() {
	return JSON.parse(localStorage.getItem("taskList"));
}

///// Prints the array from localStorage into list
///// Arguments - existingArray: array from local storage
function printArray(existingArray) {
	for(var i = 0; i < existingArray.length; i++) {
		$("#todos").append("<tr><td><span name = " + i + " " + (existingArray[i].isClear == true ? "class = strikethrough" : "") + ">" + existingArray[i].taskName + "</span><input type = image name = " + i + " class = delete src = \"minus65.png\"></input><input type = image name = " + i + " class = clear src = \"checkmark.png\"></input></td></tr>");
	}
}

///// Updates the counter that shows how many items are left to clear
function updateCounter(existingArray) {
	var tasksToClear = 0;
	for(var i = 0; i < existingArray.length; i++) {
		if(existingArray[i].isClear == false)
			tasksToClear++;
	}
	$("#counter").html(tasksToClear + " task(s) left");
}

$(document).ready( function() {

	//Printing out previous entries from past sessions only if there is data in the array
	var existingList = retrieveArray();
	if(existingList != null) {
		printArray(existingList);
	}
	
	///// When enter key is clicked, add task to localStorage list
	$("#task").on("keypress", function(e) {

		// Only proceed with function if the enter key is pressed
		if(e.keyCode == 13) {
			
			// If key does not exist, create one
			var existingArray = JSON.parse(localStorage.getItem("taskList"));
			if(existingArray == null) {
				existingArray = [];
			}

			// Retrieve length of existingArray
			var i = existingArray.length;

			// Retrieve value from text field
			var task = $("#task").val();

			// If 'task' variable is empty, skip rest of function
			if(!task)
				return 0;

			// Create object for the entered task
			existingList = {
				taskName: task,
				isClear: false
			};

			// Retrieve array from localStorage and pushing 'task' value to it
			existingArray.push(existingList);

			// Sending array back to localStorage
			localStorage.setItem("taskList", JSON.stringify(existingArray));

			// Printing out tasks as they are entered
			$("#todos").append("<tr><td><span name = " + i + ">" + existingArray[i].taskName + "</span><input type = image name = " + i + " class = delete src = \"minus65.png\"></input><input type = image name = " + i + " class = clear src = \"checkmark.png\"></input></td></tr>");

			// Update the task counter
			updateCounter(existingArray);

			// Clear text field for next entry and focus on it
			$("#task").val("").focus();
		}
	});

	///// When the delete button is clicked, delete that task from the list
	$("#todos").on( "click", ".delete", function(e) {

		// Retrieve tasklist from localStorage
		var existingArray = retrieveArray();

		// Value to be removed from array
		var valueToRemove = this.name;

		// Removing selected value from array
		existingArray.splice(valueToRemove, 1);

		// Putting the edited array back into localStorage
		localStorage.setItem("taskList", JSON.stringify(existingArray));

		// Show changes in front-end
		$("#todos").find("tr:gt(0)").remove();
		printArray(existingArray);

		// Update the task counter
		updateCounter(existingArray);

		// Focuses on text field
		$("#task").focus();
	});

	///// When the clear button is clicked, strikethrough that item in the list
	$("#todos").on("click", ".clear", function() {

		// Retrieve taskList from localStorage
		var existingArray = retrieveArray();

		// Value to be cleared
		var name = this.name;

		// Applying CSS to selected task and changing 'isClear' in object
		if(existingArray[name].isClear == false) {
			$("[name=" + name + "]").addClass("strikethrough");
			existingArray[name].isClear = true;
		}
		else {
			$("[name=" + name + "]").removeClass("strikethrough");
			existingArray[name].isClear = false;
		}

		// Putting the edited array back into localStorage
		localStorage.setItem("taskList", JSON.stringify(existingArray));

		// Update the task counter
		updateCounter(existingArray);

		// Focuses on text field
		$("#task").focus();
	});
});