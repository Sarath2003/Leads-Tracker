let myLeads = []
const inputName = document.getElementById("name")
const inputURL = document.getElementById("url")
const errorMsg = document.getElementById("error-msg")
const form = document.getElementById("form")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

document.addEventListener("click", (e)=>{
    if(e.target.dataset.remove){
        removeURL(e.target.dataset.remove)
    }
})

function removeURL(url){
    myLeads = myLeads.filter(lead => lead.url != url)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        inputURL.value = tabs[0].url
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i].url}'>
                    ${leads[i].name}
                </a>
                <i class="fa-solid fa-trash" style="color: #309132" data-remove="${leads[i].url}"></i>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

form.addEventListener("submit", function(e) {
    e.preventDefault()
    if(inputName.value != "" && inputURL.value != "" && !isDuplicate(inputURL.value)){
        myLeads.push({"name": inputName.value, "url": inputURL.value})
        inputName.value = ""
        inputURL.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    }
})

function isDuplicate(url){
    const dup = myLeads.filter((lead => lead.url === url))
    if(dup.length){
        inputURL.classList.add("duplicate-url")
        errorMsg.style.display = "block"
        setTimeout(()=>{
            inputURL.classList.remove("duplicate-url")
            errorMsg.style.display = "none"
        }, 2000)
        return 1
    }
}