let cl = console.log;


const titleControl = document.getElementById("title");
const emailControl = document.getElementById("email");
const bodyControl = document.getElementById("body");
const postIdControl = document.getElementById("postId");
const loginForm = document.getElementById("loginForm");
const commentsContainer = document.getElementById("commentsContainer");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const baseUrl = `https://jsonplaceholder.typicode.com`;

const commentsUrl = `${baseUrl}/comments`;



const templating = (arr) => {
    commentsContainer.innerHTML = arr.map(obj => {
        return `
                <div class="card mb-4 " id="${obj.id}">
                    <div class="card-header bg-success text-white">
                        <h3 class="m-0">${obj.name}</h3>
                    </div>
                    <div class="card-body">
                       <a href ="index.html" class="font-weight-bold"> ${obj.email}</a>
                        <p class="mt-2 ">${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onClick ="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onClick  = "onDelete(this)">Delete</button>

                    </div>
                </div>
        
        
        `
    }).join("");
}

const addCard = (obj) => {
    let card = document.createElement("div");
    card.className = "card mb-4"
    card.id = obj.id;
    card.innerHTML = `
            <div class="card-header bg-success text-white">
                <h3 class="m-0">${obj.name}</h3>
            </div>
            <div class="card-body">
            <a href ="index.html" class="font-weight-bold"> ${obj.email}</a>
                <p class="mt-2 ">${obj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onClick ="onEdit(this)">Edit</button>
            <button class="btn btn-danger" onClick = "onDelete(this)">Delete</button>

            </div>   
    `
    commentsContainer.prepend(card);
}


const makeApiCall = (mehtodName , apiUrl , msgBody) => {
    let xhr = new XMLHttpRequest;
    xhr.open(mehtodName,apiUrl);
    xhr.setRequestHeader(`Content-type`,"application/json");
    xhr.setRequestHeader(`Authrization`,"Breaer Token from Local Storage");
    xhr.send(JSON.stringify(msgBody));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response)
            let res = JSON.parse(xhr.response)
            if(mehtodName === "GET"){
               if(Array.isArray(res)){
                templating(res)
               }else{
                    titleControl.value = res.name;
                    emailControl.value = res.email;
                    bodyControl.value = res.body;
                    postIdControl.value = res.postId;
                    updateBtn.classList.remove(`d-none`);
                    submitBtn.classList.add(`d-none`);
                    window.scrollTo(0,0);
                
               }
            }else if(mehtodName === "POST"){
                msgBody.id = res.id;
                cl(msgBody)
                addCard(res)
                loginForm.reset();
            }else if(mehtodName === "PATCH"){
                loginForm.reset();
                updateBtn.classList.add(`d-none`);
                submitBtn.classList.remove(`d-none`);
                let card = [...document.getElementById(res.id).children];
                card[0].innerHTML =` <h3 class="m-0">${res.name}</h3>`;
                card[1].innerHTML =` <a href ="index.html" class="font-weight-bold"> ${res.email}</a>
                                    <p class="mt-2 ">${res.body}</p>`
                cl(card)
            }else if(mehtodName === "DELETE"){
               let id = localStorage.getItem("deleteId");
               cl(id)
               document.getElementById(id).remove();
               
            }
        }
    }
}

makeApiCall("GET",commentsUrl)

const onAddComments = (ele) => {
    ele.preventDefault();
    let obj = {
        name:titleControl.value,
        email:emailControl.value,
        body:bodyControl.value,
        postId:postIdControl.value
    }
    cl(obj)

    makeApiCall("POST",commentsUrl,obj)
    Swal.fire({
        title : `New Post ${obj.name} is Added Scuccessfully...!!`,
        icon:`success`,
        timer:2500
    })
   
}

const onEdit = (ele) => {
    let editId = ele.closest(`.card`).id;
    localStorage.setItem("editId",editId);
    let editUrl = `${baseUrl}/comments/${editId}`;
    makeApiCall("GET",editUrl);
}
const onUpdate = () => {
    let updateId = localStorage.getItem("editId");
    let updatedUrl = `${baseUrl}/comments/${updateId}`;
    let updatedObj = {
        name:titleControl.value,
        email:emailControl.value,
        body:bodyControl.value,
        postId:postIdControl.value
    }
    cl(updatedObj);
    makeApiCall("PATCH",updatedUrl,updatedObj);
    Swal.fire({
        title : `Post ${updatedObj.name} is Updated Scuccessfully...!!`,
        icon:`success`,
        timer:2500
    })
}

const onDelete = (ele) => {
    let deleteId = ele.closest(`.card`).id;
    localStorage.setItem("deleteId",deleteId);
    let deleteUrl = `${baseUrl}/comments/${deleteId}`;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            makeApiCall("DELETE",deleteUrl);
          Swal.fire({
            title: "Deleted!",
            text: `your post has been deleted..!!`,
            icon: "success"
          });
        }
      });
   
}

loginForm.addEventListener("submit",onAddComments);
updateBtn.addEventListener("click",onUpdate);