var accessToken = 'ya29.a0AfH6SMC60bT-b5kuXgBMf-8YLLWlkDz4Y9235kLoSGNa8gHIhaBqoQMpUcUEhyrB5wCkaOEd2KHbbUXG896ngRpM2yhYkMrDiRex_ULUAavI-X9xBo8thNbxIx-_L1QuRaSk1afodx64N3OtzCnKTBZrcjBO'


$.ajax({
    type: "GET",
    headers: {
        'Authorization': `Bearer ${accessToken}`,
    },
    url: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    success: function (response) {
        let data = response.items
        data.forEach(element => {
            $("#listTasks").append(`<li class="list-group-item">
                        <span class="list-tasks text-primary" style="cursor: pointer" data-id="${element.id}">
                            ${element.title}
                        </span>
                        <ul class="list-group" id="${element.id}"></ul>
                        </li>`)
            });
        $('.list-tasks').on('click', requestDetails)
    }, error: function(err){
        console.log(err)
    }
});


function requestDetails(e){
    e.stopPropagation()
    let id = e.currentTarget.dataset.id
    let task = e.currentTarget
    $.ajax({
        type: "GET",
        url: `https://tasks.googleapis.com/tasks/v1/lists/${id}/tasks?showHidden=true`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        success: function (response) {
            let data = response.items
            data.forEach(element => {
                $('#'+id).append(`<li class="list-group-item ">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="${element.id}" ${(element.status == 'completed') ? 'checked':''}>
                                <label class="form-check-label" for="flexCheckChecked">
                                    <span style="text-decoration: ${(element.status == 'completed') ? 'line-through': 'none'}">
                                        ${element.title}                                    
                                    </span>
                                </label>
                            </div>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskDetails"  data-list="${id}" data-id="${element.id}">
                                See more
                            </button>
                        </li>`)
            });
        }
    });
}


$('#taskDetails').on('show.bs.modal', function (event) {
    console.log(event)
    let task = event.relatedTarget.dataset.id
    let taskList = event.relatedTarget.dataset.list
    let modal = this
    $.ajax({
        type: "GET",
        url: `https://tasks.googleapis.com/tasks/v1/lists/${taskList}/tasks/${task}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        success: function (response) {
            console.log(response)
            $('#taskTitle').html(response.title)
            $('#taskNote').html(response.notes)
            let dateDue = new Date(response.due)
            $('#taskDue').val(dateDue.toString("yyyy-MM-ddThh:mm")) 
        }
    });
})
