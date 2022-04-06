//-------------------dark and light mode btn------------------------
let darkModeCheckBox = document.querySelector('[data-dark-mode-checkbox]')
darkModeCheckBox.addEventListener('change', function () {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
    }
})
//----------------------------------give to do list function---------------------------
const foldersNav = document.querySelector('[data-folders-links]');
const addNewListForm = document.querySelector('[data-add-new-list-form]');
const addNewListInput = document.querySelector('[data-add-new-list-input]');
const deleteFolderBtn = document.querySelector('[data-delete-folder]');
const homePage = document.querySelector('[data-home-page]');
const homePageBtn = document.querySelector('[data-home-page-btn]');
const foldersLink = foldersNav.querySelectorAll('li');
const menuToggler = document.querySelector('[data-menu-toggler]');
const sideContainer = document.querySelector('[data-side-container]');
const mainContainer = document.querySelector('[data-main-container]');
const tasksPage = document.querySelector('[data-tasks-page]');
const tasksTitle = document.querySelector('[data-tasks-title]');
const tasksCount = document.querySelector('[data-tasks-count]');
const tasksGroup = document.querySelector('[data-tasks-group]');
const taskTemplate = document.getElementById('task-template');
const addNewTaskForm = document.querySelector('[data-add-new-task-form]');
const addNewTaskInput = document.querySelector('[data-add-new-task-input]');
const deleteTasksBtn = document.querySelector('[data-delete-task]');
const showDate = document.querySelector('[data-show-date]');

const LOCAL_STORAGE_FOLDER_KEY = 'tasks.folders'
const LOCAL_STORAGE_SELECTED_FOLDER_ID_KEY = 'tasks.selectedfolderid'
let folderList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FOLDER_KEY)) || []
let selectedfolderid = localStorage.getItem(LOCAL_STORAGE_SELECTED_FOLDER_ID_KEY)

foldersNav.addEventListener('click', e=>{
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedfolderid = e.target.dataset.listId
        saveAndRender()
        tasksPage.classList.add('showcase')
        homePage.classList.remove('showcase')
    }
})
tasksGroup.addEventListener('click', e=>{
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedfolder = folderList.find(folder => folder.id === selectedfolderid)
        const selectedTask = selectedfolder.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renserTasksCount(selectedfolder)
    }
})
deleteTasksBtn.addEventListener('click', e=>{
    const selectedfolder = folderList.find(folder => folder.id === selectedfolderid)
    selectedfolder.tasks = selectedfolder.tasks.filter(task => !task.complete)
    saveAndRender()
})
deleteFolderBtn.addEventListener('click', e=>{
    folderList = folderList.filter(folder => folder.id !== selectedfolderid)
    selectedfolderid = null
    saveAndRender()
})

addNewListForm.addEventListener('submit', e =>{
    e.preventDefault()
    const folderName = addNewListInput.value
    if(folderName == null || folderName === '') return
    const newFolder = createNewFolder(folderName)
    addNewListInput.value = null
    folderList.push(newFolder)
    saveAndRender()
})
addNewTaskForm.addEventListener('submit', e =>{
    e.preventDefault()
    const taskName = addNewTaskInput.value
    if(taskName == null || taskName === '') return
    const newTask = createNewTask(taskName)
    addNewTaskInput.value = null
    const selectedfolder = folderList.find(list => list.id === selectedfolderid)
    selectedfolder.tasks.push(newTask)
    saveAndRender()
})
function createNewFolder(name){
    return { id: Date.now().toString(), name: name, tasks:[]}
}
function createNewTask(name){
    return { id: Date.now().toString(), name: name, complete: false}
}
function saveAndRender(){
    save()
    render()
}
function save(){
    localStorage.setItem(LOCAL_STORAGE_FOLDER_KEY, JSON.stringify(folderList))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_FOLDER_ID_KEY, selectedfolderid)
}

function render(){
    clearElement(foldersNav)
    renderFolders()
    const  selectedfolder = folderList.find(folder => folder.id === selectedfolderid)
    tasksTitle.innerText = selectedfolder.name
    renserTasksCount(selectedfolder)
    clearElement(tasksGroup)
    renderTasks(selectedfolder)
}
function renderTasks(selectedfolder){
    selectedfolder.tasks.forEach(task =>{
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkBox = taskElement.querySelector('input')
    checkBox.id = task.id
    checkBox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksGroup.appendChild(taskElement)
    })
}
function renserTasksCount(selectedfolder){
    const inCompleteTasksCount = selectedfolder.tasks.filter(tasks => !tasks.complete).length
    const taskString = inCompleteTasksCount === 1 ? "task" : "tasks"
    tasksCount.innerText = `${inCompleteTasksCount} ${taskString} remaining`
}
function renderFolders(){
    folderList.forEach(folderList =>{
        const listElement = document.createElement('li')
        listElement.dataset.listId = folderList.id
        listElement.innerText = folderList.name
        if(folderList.id === selectedfolderid) listElement.classList.add('active-folder')
        foldersNav.appendChild(listElement)
    })
}
function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}
render()
//-----------------------nav and showcase--------------------------------
homePageBtn.addEventListener('click', () =>{
    tasksPage.classList.remove('showcase')
    homePage.classList.add('showcase')
})
menuToggler.addEventListener('click', ()=>{
    menuToggler.classList.toggle('menu-active');
    sideContainer.classList.toggle('side-open');
    mainContainer.classList.toggle('side-open');
})
//--------------------------show date------------------------------------
const Options = {weekday: 'long', month: 'short', day: 'numeric'};
const toDay = new Date();
showDate.innerText = toDay.toLocaleDateString('en-us', Options);
