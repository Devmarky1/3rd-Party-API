// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskId = task.id || generateTaskId();

  const card = $("<div>")
    .attr("id", `card-${taskId}`)
    .addClass("card task-card mb-3")
    .addClass(getStatusClass(task.status));


    const inputSection = $("<label>")
    .addClass("form-control")
    .val(task.title)
    .on("label", function () {
    
    })

  inputSection.css({
  "color": "white",
   "background-color": getStatusColor(task.status),
  });

 
  const descriptionSection = $("<div>")
    .text(task.description)
    .css({
      "color": "white",
      "margin-bottom": "10px",
      "margin-top": "8px"

    });

    const deleteButton = $("<button>")
    .addClass("btn btn-danger delete-btn")
    .text("Delete")
    .click(handleDeleteTask)
    .css("border", "1px solid white")

    const dueDateSection = $("<p>")
    .addClass("form-label")
    .text(task.dueDate)
    .css("color", "white");


  const cardBody = $("<div>").addClass("modal-body").append(
    $(inputSection).addClass("form-control").text(task.title),
    descriptionSection,
    $(dueDateSection).addClass("form-label").text(task.dueDate),
    deleteButton
   
  );

  card.append(cardBody);

  card.draggable({
    containment: "document",
    revert: "invalid",
    start: function (_event, ui) {
      ui.helper.css("z-index", 1000);
    },
    drag: function () {
      
      inputSection.css("background-color", getStatusColor(task.status));
    }
  });

  return card;
}

function getStatusColor(status) {
  switch (status) {
    case "to-do":
      return "red"; 
    case "in-progress":
      return "orange"; 
    case "done":
      return "green"; 
    default:
      return "red";
  }
}


 

// Todo: create a function to get status class based on task status
function getStatusClass(status) {
  switch(status) {
    case "to-do":
      return "status-red"; 
    case "in-progress":
      return "status-orange";
    case "done":
      return "status-green";
    default:
      return "";
  }
}





// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  var taskId = ui.helper.attr("id").split("-")[1];
  var newStatus = $(this).attr("id");

  // Update task status
  var taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].status = newStatus;

  // Remove previous status class and add new status class to the task card
  $(`#card-${taskId}`).removeClass().addClass("card task-card mb-3").addClass(getStatusClass(newStatus));

  // Save tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $(".lane").each(function () {
    var laneId = $(this).attr("id");
    var laneTasks = taskList.filter(task => task.status === laneId);
    var containerId = laneId + "-cards";
    var container = $("#" + containerId);
    container.empty();

    laneTasks.forEach(function (task) {
      var taskCard = createTaskCard(task);
      container.append(taskCard);
    });

    // Make lanes droppable
    container.droppable({
      accept: ".task-card",
      drop: handleDrop
    });
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  
  event.preventDefault();

  var taskTitle = $("#taskTitle").val();
  var taskDueDate = $("#taskDueDate").val();
  var taskDescription = $("#taskDescription").val();

  var newTask = {
    id: generateTaskId(),
    title: taskTitle,
    dueDate: taskDueDate,
    description: taskDescription,
    status: "to-do" 
  };

  taskList.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  $("#taskForm")[0].reset();

// Render updated task list
  renderTaskList();
}
 

// Todo: create a function to handle deleting a task
function handleDeleteTask() {
  var taskId = $(this).closest(".task-card").attr("id").split("-")[1];

  // Remove task from taskList
  taskList = taskList.filter(task => task.id != taskId);

  // Save tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  var taskId = ui.helper.attr("id").split("-")[1];
  var newStatus = $(this).attr("id");

  // Update task status
  var taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].status = newStatus;

   // Remove previous status class and add new status class to the task card

  // Save tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// ...
$(document).ready(function () {
  // Initialize the date picker
  $(".Datepicker").datepicker();

  // Render the task list when the page loads
  renderTaskList();


  $('#taskForm').submit(function(event) {
    event.preventDefault();
    $('#formModal').modal('hide');


   
  });

  // Close the task form modal after submitting the form
  $("#taskForm").submit(handleAddTask);
  
  // Make lanes droppable
  $(".lane").each(function () {
    $(this).droppable({
      accept: ".task-card",
      drop: handleDrop,

           });
     });
  });