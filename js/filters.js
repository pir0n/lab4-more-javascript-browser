class Filter{
    
    constructor(taskManager) {
        this.taskManager = taskManager;

        //set up filter references

        document.querySelectorAll("#left-sidebar a").forEach(link => {
            link.addEventListener("click", (event) => {
              const filterType = event.target.dataset.id;
              document.querySelector("#left-sidebar a.active").classList.remove("active");
              event.target.classList.add("active");
              this.showTasks(filterType);
            });
        }); 
    }
    
    /**
     * Function to create the <ul></ul> list of tasks
     * @param {*} filterType an optinal filter
     */
    showTasks(filterType){
        const taskList = document.getElementById("taskList");
        const filterTitle = document.getElementById("filter-title");
        this.clearTasks();
        let tasks;
        switch(filterType){
            case "filter-all":
                tasks = this.taskManager.all;
                filterTitle.innerText = "All";
                break;
            case "filter-important":
                tasks = this.taskManager.important;
                filterTitle.innerText = "Important";
                break;
            case "filter-today":
                tasks = this.taskManager.today;
                filterTitle.innerText = "Today";
                break;
            case "filter-week":
                tasks = this.taskManager.nextWeek;
                filterTitle.innerText = "Next 7 Days";
                break;
            case "filter-private":
                tasks = this.taskManager.private;
                filterTitle.innerText = "Private";
                break;
            case "filter-shared":
                tasks = this.taskManager.shared;
                filterTitle.innerText = "Shared With...";
                break;
            default:
                filterTitle.innerText = "All";
                tasks = this.taskManager.all;
        }
        for(const task of tasks){
            const taskNode = this.createTaskNode(task);
            taskList.appendChild(taskNode);
            //set a timeout to mark the deadline, if the deadline is "valid"
            const now = moment();
            if(task.deadline && task.deadline.isValid() && task.deadline.isAfter(now) ) {

                console.log(task.id + " -- " + task.deadline.diff(now));

                setTimeout(function() {
                    const li = document.getElementById("task" + task.id);
                    const date = li.getElementsByClassName("date")[0];
                    date.classList.add('bg-danger');
                    date.classList.add('text-white');
                }, task.deadline.diff(now), task);
            }
        }
    }

    /**
     * Function to create a single task encolsed in an <li> tag
     * @param {*} task the task object
     */
    createTaskNode(task){
        const li = document.createElement('li');
        li.id = "task"+task.id;
        li.className = 'list-group-item';
        const innerDiv = document.createElement('div');
        innerDiv.className = 'custom-control custom-checkbox';
        const externalDiv = document.createElement('div');
        externalDiv.className = 'd-flex w-100 justify-content-between';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = "check-t"+ task.id;
        if(task.important)
            checkbox.className = 'custom-control-input important';
        else
            checkbox.className = 'custom-control-input';
        
        innerDiv.appendChild(checkbox);
        
        const descriptionText = document.createElement('label');
        descriptionText.className = 'description custom-control-label';
        descriptionText.innerText = task.description;
        descriptionText.htmlFor = "check-t"+ task.id;
        innerDiv.appendChild(descriptionText);
        
        if(task.project){
            const projectText = document.createElement('span');
            projectText.className = 'project badge badge-primary ml-4';
            projectText.innerText = task.project;
            innerDiv.appendChild(projectText);
        }
        externalDiv.appendChild(innerDiv);

        if(task.deadline){
            const dateText = document.createElement('small');
            dateText.className = 'date';
            //print deadline - using the format function of Moment js
            dateText.innerText = task.deadline.format("dddd, MMMM Do YYYY, h:mm:ss a"); 
            //mark expired tasks - using the isBefore function of Moment js
            const now = moment();
            if(task.deadline.isBefore(now)){
                dateText.classList.add('bg-danger');
                dateText.classList.add('text-white');
            }
            externalDiv.appendChild(dateText);
        }   
        
        
        if(!task.privateTask){
            innerDiv.insertAdjacentHTML("afterend", `<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg> `);
        }
            
        li.appendChild(externalDiv);
        return li;
    }

    /**
     * Function to destroy the <ul></ul> list of tasks
     */
    clearTasks(){
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = '';
    }

}