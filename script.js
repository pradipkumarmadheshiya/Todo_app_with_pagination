const container = document.getElementById("container")
const todosContainer = document.querySelector(".todos")
const input = document.getElementById("input")
const addTodoButton = document.getElementById("add_todo")
const sortBtn = document.getElementById("sort")
const filterBtn = document.getElementById("filter")
const sort=document.getElementById("sort")
const filter=document.getElementById("filter")
const paginationContainer=document.getElementsByClassName("pagination")[0]
let id = 0
let sortingOrder=true

let currentPage=1
const todosPerPage=5
const createPagination=(totalPages)=>{
    paginationContainer.innerHTML=""
    for (let i=1; i<=totalPages; i++){
        const pageBtn=document.createElement("button")
        pageBtn.innerText=i
        paginationContainer.append(pageBtn)
        pageBtn.addEventListener("click", ()=>{
            currentPage=i
            getTodos()
        })
    }
}

const getTodos=async (filterQuery)=>{
    const apiUrl=filterQuery ? `http://localhost:3000/todos?_page=${currentPage}&_per_page=${todosPerPage}&${filterQuery}` : `http://localhost:3000/todos?_page=${currentPage}&_per_page=${todosPerPage}`
    try{
        const response = await fetch(apiUrl)
        const data = await response.json()  
        if (data.data.length>0){
            id=(data.items)
        }
        else{
            sort.style.display="none"
            filter.style.display="none"
        }
        displayTodos(data)
        createPagination(data.pages)
    }
    catch (error){
        console.log("Something went wrong:", error)
    }
}
getTodos()

function displayTodos(data){
    todosContainer.innerHTML=""
    data.data.forEach(el=>{
        const div = document.createElement("div")
        div.className = "contentBox"
        const title = document.createElement("p")
        const deleteBox = document.createElement("div")
        deleteBox.className="deleteBox"
        const status=document.createElement("p")
        const deleteBtn=document.createElement("button")
        deleteBtn.className="deleteBtn"

        status.innerText=el.status ? "Done" : "To be Done";
        status.className="status"

        status.addEventListener("click", async ()=>{
            try{
                await fetch(`http://localhost:3000/todos/${el.id}`,{
                    method:"PATCH",
                    headers:{"content-type":"application/json"},
                    body:JSON.stringify({status:!el.status})
                })
                getTodos()
            }
            catch(error){
                console.log("Something went wrong", error)
            }
        })

        title.textContent = el.name
        if (el.status){
            title.className="completed"
        }

        deleteBtn.textContent="Delete"

        deleteBtn.addEventListener("click", async ()=>{
            try{
                await fetch(`http://localhost:3000/todos/${el.id}`, {method:"DELETE"})
                getTodos()
            }
            catch (error){
                console.log("Something went wrong", error)
            }
        })

        deleteBox.append(status, deleteBtn)
        div.append(title,deleteBox)
        todosContainer.append(div)
    })
}

const addTodo = async ()=>{
    let todo = input.value
    todo = todo.trim()
    if (todo===""){
        alert("Todo cannot be empty!")
        return
    }
    try{
        const res = await fetch("http://localhost:3000/todos", {
            method:"post",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                id:String(++id),
                name:todo,
                status:false
            })
        })
        getTodos()
    }
    catch (error){
        console.log("Something went wrong:", error);
    }
}
addTodoButton.addEventListener("click", addTodo)

sortBtn.addEventListener("click", ()=>{
    getTodos(`_sort=${sortingOrder ? "" : "-"}name`)
    sortingOrder=!sortingOrder
})

filterBtn.addEventListener("click", ()=>{
    getTodos("status=false")
})