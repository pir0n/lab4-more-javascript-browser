class Project{
    constructor(taskManager, filterView) {
        this.taskManager = taskManager;
        this.filterView = filterView;
    }

     /**
     * Function to create the list of projects in the side menu
     */
    createAllProjects() {
        const projectList = document.getElementById("projects");
        for(const project of this.taskManager.projects){
            const projectNode = this.createProjectNode(project);
            projectList.appendChild(projectNode);
        }
    }

    /**
     * Function to create a single project
     * @param {*} project the project name to be created
     */
    createProjectNode(project){
        const a = document.createElement('a');
        a.className = "list-group-item list-group-item-action";
        a.innerText = project;
        a.addEventListener('click', event => {
            this.filterView.clearTasks();
            const taskList = document.getElementById("taskList");
            
            for(const task of this.taskManager.getByProject(project)){
                const taskNode = this.filterView.createTaskNode(task);
                taskList.appendChild(taskNode);
            }
        });
        return a;
    }

    /**
     * Function to destroy the list of projects in the side menu
     */
    clearProjects(){
        const projectList = document.getElementById("projects");
        projectList.innerHTML = '';
    }
}
