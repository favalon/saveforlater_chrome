let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const ulImg = document.getElementById("ul-img")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        console.log(tabs[0].title, tabs[0].url)
        myLeads.push({title: tabs[0].title, url: tabs[0].url})
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(leads) {
    let listItems = ""
    let listImgItems = ""

    if (leads.length <1){
        ulEl.innerHTML = listItems
        ulImg.innerHTML = listImgItems
        return}

    for (let i = leads.length-1; i > 0; i--) {
        // console.log(myTitle)

        if (leads[i].url.match(/^http.*\.(jpeg|jpg|gif|png)$/)){
            listImgItems += `
                <li class="li-img-container" id="${leads[i].title}">
                    <div class="container">
                        <a href="${leads[i].url}" target="_blank">
                            <img alt="${leads[i].title}" class="li-img" src="${leads[i].url}">
                        </a>
                        <button class="btn" id="${leads[i].title}-btn">x</button>
                    </div>
                </li>
            `
        } else{
            listItems += `
            <li class="url-li" id="${leads[i].title}">
                <a target='_blank' href='${leads[i].url}'>
                    ${leads[i].title.substring(0, 40)} ...
                </a>
                <button class="url-delete-btn" id="${leads[i].title}-btn">delete</button>
            </li>
        `
        }
    }
    ulEl.innerHTML = listItems
    ulImg.innerHTML = listImgItems
}

document.getElementById("all-list").addEventListener( 'click', function ( event ) {
    let div_id = event.target.id.substring(0, event.target.id.length - 4)
    console.log("target id :" + event.target.id)
    console.log(div_id)
    let index = myLeads.map(function (e) {
        return e.title;
    }).indexOf(div_id);
    console.log(index)
    if (index > -1) { // only splice array when item is found
        myLeads.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log(myLeads)
    if (myLeads.length > 0) {
        document.getElementById(div_id).remove();
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
    }else{
        localStorage.clear()
        myLeads = []
    }
    render(myLeads)
} );





deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    let index = myLeads.map(function(e) { return e.title; }).indexOf(inputEl.value);
    if (index === -1) {
        myLeads.push({title: inputEl.value, url: inputEl.value})
        inputEl.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    }
})