/*==========================================================
 Topper Study Hub
 script.js
 PART 1
==========================================================*/

"use strict";

/*==========================================================
 Global Variables
==========================================================*/

const body = document.body;

const loader = document.getElementById("loader");

const themeBtn = document.getElementById("themeBtn");

const menuBtn = document.getElementById("menuBtn");

const sidebar = document.querySelector(".sidebar");

const scrollTopBtn = document.getElementById("scrollTop");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

/*==========================================================
 Loader
==========================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        if(loader){

            loader.classList.add("hide");

        }

    },800);

});

/*==========================================================
 Theme
==========================================================*/

function loadTheme(){

    const theme = localStorage.getItem("theme");

    if(theme==="dark"){

        body.classList.add("dark");

        changeThemeIcon(true);

    }

}

function changeThemeIcon(isDark){

    if(!themeBtn) return;

    themeBtn.innerHTML = isDark

        ? '<i class="fa-solid fa-sun"></i>'

        : '<i class="fa-solid fa-moon"></i>';

}

function toggleTheme(){

    body.classList.toggle("dark");

    const dark = body.classList.contains("dark");

    localStorage.setItem("theme", dark ? "dark":"light");

    changeThemeIcon(dark);

    showToast(

        dark

        ? "Dark Mode Enabled"

        : "Light Mode Enabled"

    );

}

if(themeBtn){

    themeBtn.addEventListener("click",toggleTheme);

}

/*==========================================================
 Mobile Sidebar
==========================================================*/

function toggleSidebar(){

    if(!sidebar) return;

    sidebar.classList.toggle("show");

}

if(menuBtn){

    menuBtn.addEventListener(

        "click",

        toggleSidebar

    );

}

/*==========================================================
 Close Sidebar
==========================================================*/

document.addEventListener("click",(e)=>{

    if(window.innerWidth>900) return;

    if(!sidebar) return;

    if(

        !sidebar.contains(e.target)

        &&

        !menuBtn.contains(e.target)

    ){

        sidebar.classList.remove("show");

    }

});

/*==========================================================
 Scroll To Top
==========================================================*/

window.addEventListener("scroll",()=>{

    if(!scrollTopBtn) return;

    if(window.scrollY>400){

        scrollTopBtn.style.display="flex";

    }

    else{

        scrollTopBtn.style.display="none";

    }

});

if(scrollTopBtn){

scrollTopBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

/*==========================================================
 Toast Notification
==========================================================*/

let toastTimer;

function showToast(message){

    if(!toast) return;

    toastMessage.textContent=message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer=setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/*==========================================================
 Utility Functions
==========================================================*/

function $(selector){

    return document.querySelector(selector);

}

function $all(selector){

    return document.querySelectorAll(selector);

}

function create(tag){

    return document.createElement(tag);

}

/*==========================================================
 Ripple Effect
==========================================================*/

document.addEventListener("click",(e)=>{

    const btn=e.target.closest("button");

    if(!btn) return;

    btn.classList.add("ripple");

    setTimeout(()=>{

        btn.classList.remove("ripple");

    },600);

});

/*==========================================================
 Keyboard Shortcuts
==========================================================*/

document.addEventListener("keydown",(e)=>{

    /* CTRL + K */

    if(e.ctrlKey && e.key==="k"){

        e.preventDefault();

        const search=document.getElementById("globalSearch");

        if(search){

            search.focus();

            showToast("Search Activated");

        }

    }

    /* ESC */

    if(e.key==="Escape"){

        const popup=document.getElementById("popupOverlay");

        if(popup){

            popup.classList.remove("active");

        }

    }

});

/*==========================================================
 Welcome Message
==========================================================*/

setTimeout(()=>{

showToast(

"Welcome to Topper Study Hub"

);

},1200);

/*==========================================================
 Responsive Resize
==========================================================*/

window.addEventListener("resize",()=>{

if(window.innerWidth>900){

if(sidebar){

sidebar.classList.remove("show");

}

}

});

/*==========================================================
 Initialize
==========================================================*/

function init(){

loadTheme();

console.log(

"Topper Study Hub Loaded"

);

}

init();

/*==========================================================
 End of Part 1
==========================================================*/

/*==========================================================
 PART 2
 Load subjects.json
 Generate Subject Cards
 Popup Chapters
==========================================================*/

let subjectsData = [];
let groupedSubjects = {};

/*==========================================================
 Load JSON
==========================================================*/

async function loadSubjects() {

    try {

        const response = await fetch("subjects.json");

        subjectsData = await response.json();

        groupSubjects();

        buildSubjectCards();

    } catch (error) {

        console.error(error);

        showToast("Unable to load subjects.json");

    }

}

/*==========================================================
 Group Subjects
==========================================================*/

function groupSubjects() {

    groupedSubjects = {};

    subjectsData.forEach(item => {

        if (!groupedSubjects[item.subject]) {

            groupedSubjects[item.subject] = [];

        }

        groupedSubjects[item.subject].push(item);

    });

}

/*==========================================================
 Subject Icons
==========================================================*/

const subjectIcons = {

    "General Science":"🧪",

    "Geography":"🌍",

    "History":"📜",

    "Polity":"🏛",

    "Mathematics":"🧮",

    "Reasoning":"🧠",

    "Economics":"💰",

    "Current Affairs":"📰",

    "English":"📘",

    "Computer":"💻"

};

/*==========================================================
 Build Subject Cards
==========================================================*/

function buildSubjectCards(){

    const grid=document.getElementById("subjectsGrid");

    if(!grid) return;

    grid.innerHTML="";

    Object.keys(groupedSubjects).forEach(subject=>{

        const notes=groupedSubjects[subject];

        const card=create("div");

        card.className="subject-card fade-in";

        card.innerHTML=`

            <div class="subject-icon">

                ${subjectIcons[subject] || "📚"}

            </div>

            <h3>${subject}</h3>

            <p>

                ${notes.length} Chapters Available

            </p>

            <span>

                ${notes.length} Notes

            </span>

            <button

            class="openSubject"

            data-subject="${subject}">

            Open Subject

            </button>

        `;

        grid.appendChild(card);

    });

    bindSubjectButtons();

}

/*==========================================================
 Bind Buttons
==========================================================*/

function bindSubjectButtons(){

    document

    .querySelectorAll(".openSubject")

    .forEach(button=>{

        button.addEventListener("click",()=>{

            const subject=

            button.dataset.subject;

            openSubject(subject);

        });

    });

}

/*==========================================================
 Popup Elements
==========================================================*/

const popupOverlay=

document.getElementById("popupOverlay");

const popupTitle=

document.getElementById("popupTitle");

const chapterList=

document.getElementById("chapterList");

const closePopupBtn=

document.getElementById("closePopup");

/*==========================================================
 Open Popup
==========================================================*/

function openSubject(subject){

    popupTitle.textContent = subject;

    buildChapterList(subject);

    popupOverlay.classList.add("active");

    document.body.classList.add("popup-open");

}

/*==========================================================
 Close Popup
==========================================================*/

function closePopup(){

    popupOverlay.classList.remove("active");

    document.body.classList.remove("popup-open");

}

if(closePopupBtn){

closePopupBtn.addEventListener(

"click",

closePopup

);

}

if(popupOverlay){

popupOverlay.addEventListener("click",(e)=>{

if(e.target===popupOverlay){

closePopup();

}

});

}

/*==========================================================
 Build Chapter List
==========================================================*/

function buildChapterList(subject){

    chapterList.innerHTML="";

    const chapters=

    groupedSubjects[subject];

    if(!chapters) return;

    chapters.forEach(item=>{

        const a=create("a");

        a.href=item.file;

        a.target="_blank";

        a.className="chapter-item";

        a.innerHTML=`

            <i class="fa-solid fa-file-lines"></i>

            <span>

                ${item.title}

            </span>

            <i class="fa-solid fa-arrow-up-right-from-square"></i>

        `;

        chapterList.appendChild(a);

    });

}

/*==========================================================
 Popup Search
==========================================================*/

const chapterSearch=

document.getElementById("chapterSearch");

if(chapterSearch){

chapterSearch.addEventListener(

"input",

()=>{

const keyword=

chapterSearch.value.toLowerCase();

document

.querySelectorAll(".chapter-item")

.forEach(item=>{

const text=

item.innerText.toLowerCase();

item.style.display=

text.includes(keyword)

?

"flex"

:

"none";

});

});

}

/*==========================================================
 Load JSON
==========================================================*/

loadSubjects();

/*==========================================================
 End Part 2
==========================================================*/

/*==========================================================
 PART 3
 Global Search
==========================================================*/

const globalSearch =
document.getElementById("globalSearch");

const searchPopup =
document.getElementById("searchPopup");

const searchResults =
document.getElementById("searchResults");

let currentResults = [];

let selectedIndex = -1;

/*==========================================================
 Search Notes
==========================================================*/

function searchNotes(keyword){

    keyword = keyword.trim().toLowerCase();

    if(keyword.length===0){

        searchPopup.classList.remove("active");

        searchResults.innerHTML="";

        currentResults=[];

        selectedIndex=-1;

        return;

    }

    currentResults = subjectsData.filter(note=>{

        const subject=(note.subject||"").toLowerCase();

        const title=(note.title||"").toLowerCase();

        const keywords=(note.keywords||"").toLowerCase();

        return(

            subject.includes(keyword)

            ||

            title.includes(keyword)

            ||

            keywords.includes(keyword)

        );

    });

    renderSearchResults();

}

/*==========================================================
 Render Results
==========================================================*/

function renderSearchResults(){

    searchResults.innerHTML="";

    selectedIndex=-1;

    if(currentResults.length===0){

        searchResults.innerHTML=`

        <div class="empty-card">

            <i class="fa-solid fa-circle-xmark"></i>

            <p>No notes found.</p>

        </div>

        `;

        searchPopup.classList.add("active");

        return;

    }

    currentResults.forEach((item,index)=>{

        const link=document.createElement("a");

        link.className="search-item";

        link.href=item.file;

        link.target="_blank";

        link.dataset.index=index;

        link.innerHTML=`

        <div>

            <h4>${item.title}</h4>

            <p>${item.subject}</p>

        </div>

        <i class="fa-solid fa-arrow-up-right-from-square"></i>

        `;

        link.addEventListener("click",()=>{

            saveRecent(item);

            hideSearch();

        });

        searchResults.appendChild(link);

    });

    searchPopup.classList.add("active");

}

/*==========================================================
 Hide Search
==========================================================*/

function hideSearch(){

    searchPopup.classList.remove("active");

    selectedIndex=-1;

}

/*==========================================================
 Input Event
==========================================================*/

if(globalSearch){

globalSearch.addEventListener(

"input",

e=>{

searchNotes(

e.target.value

);

});

}

/*==========================================================
 Keyboard Navigation
==========================================================*/

document.addEventListener("keydown",e=>{

if(

!searchPopup.classList.contains("active")

)return;

const items=

document.querySelectorAll(".search-item");

if(items.length===0) return;

/* Down */

if(e.key==="ArrowDown"){

e.preventDefault();

selectedIndex++;

if(selectedIndex>=items.length)

selectedIndex=0;

highlightResult(items);

}

/* Up */

if(e.key==="ArrowUp"){

e.preventDefault();

selectedIndex--;

if(selectedIndex<0)

selectedIndex=items.length-1;

highlightResult(items);

}

/* Enter */

if(e.key==="Enter"){

if(selectedIndex>=0){

items[selectedIndex].click();

}

}

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closePopup();

    }

});

/*==========================================================
 Highlight
==========================================================*/

function highlightResult(items){

items.forEach(item=>{

item.style.background="";

item.style.color="";

});

if(selectedIndex<0) return;

items[selectedIndex].style.background="#2563eb";

items[selectedIndex].style.color="#fff";

items[selectedIndex].scrollIntoView({

block:"nearest"

});

}

/*==========================================================
 Close Search
==========================================================*/

document.addEventListener("click",e=>{

if(

!searchPopup.contains(e.target)

&&

e.target!==globalSearch

){

hideSearch();

}

});

/*==========================================================
 Focus Search
==========================================================*/

if(globalSearch){

globalSearch.addEventListener("focus",()=>{

if(currentResults.length>0){

searchPopup.classList.add("active");

}

});

}

/*==========================================================
 Quick Search Button
==========================================================*/

const quickSearch=

document.getElementById("quickSearch");

if(quickSearch){

quickSearch.addEventListener("click",()=>{

globalSearch.focus();

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

/*==========================================================
 Search Counter
==========================================================*/

function searchCount(){

return currentResults.length;

}

/*==========================================================
 End Part 3
==========================================================*/

/*==========================================================
 PART 4
 Favorites • Recent • PWA • Offline
==========================================================*/

/*==========================================================
 Local Storage Keys
==========================================================*/

const FAVORITE_KEY = "topperFavorites";
const RECENT_KEY = "topperRecent";

/*==========================================================
 Load Favorites
==========================================================*/

function getFavorites(){

    return JSON.parse(

        localStorage.getItem(FAVORITE_KEY)

        ||

        "[]"

    );

}

function saveFavorites(data){

    localStorage.setItem(

        FAVORITE_KEY,

        JSON.stringify(data)

    );

}

/*==========================================================
 Toggle Favorite
==========================================================*/

function toggleFavorite(note){

    let fav = getFavorites();

    const exists = fav.find(

        item=>item.file===note.file

    );

    if(exists){

        fav = fav.filter(

            item=>item.file!==note.file

        );

        showToast("Removed from Favorites");

    }else{

        fav.unshift(note);

        showToast("Added to Favorites");

    }

    saveFavorites(fav);

    renderFavorites();

}

/*==========================================================
 Render Favorites
==========================================================*/

function renderFavorites(){

    const grid =

    document.getElementById("favoriteGrid");

    if(!grid) return;

    const favorites = getFavorites();

    grid.innerHTML="";

    if(favorites.length===0){

        grid.innerHTML=`

        <div class="empty-card">

        <i class="fa-solid fa-heart"></i>

        <p>No Favorite Notes</p>

        </div>

        `;

        return;

    }

    favorites.forEach(note=>{

        const card=create("div");

        card.className="note-card";

        card.innerHTML=`

        <h4>${note.title}</h4>

        <p>${note.subject}</p>

        <a href="${note.file}" target="_blank">

        Open

        </a>

        `;

        grid.appendChild(card);

    });

}

/*==========================================================
 Recent Notes
==========================================================*/

function getRecent(){

    return JSON.parse(

        localStorage.getItem(RECENT_KEY)

        ||

        "[]"

    );

}

function saveRecent(note){

    let recent=getRecent();

    recent=recent.filter(

        item=>item.file!==note.file

    );

    recent.unshift(note);

    if(recent.length>10){

        recent.pop();

    }

    localStorage.setItem(

        RECENT_KEY,

        JSON.stringify(recent)

    );

    renderRecent();

}

/*==========================================================
 Render Recent
==========================================================*/

function renderRecent(){

    const grid=

    document.getElementById("recentGrid");

    if(!grid) return;

    const recent=getRecent();

    grid.innerHTML="";

    if(recent.length===0){

        grid.innerHTML=`

        <div class="empty-card">

        <i class="fa-solid fa-clock"></i>

        <p>No Recent Notes</p>

        </div>

        `;

        return;

    }

    recent.forEach(note=>{

        const card=create("div");

        card.className="note-card";

        card.innerHTML=`

        <h4>${note.title}</h4>

        <p>${note.subject}</p>

        <a href="${note.file}"

        target="_blank">

        Continue Reading

        </a>

        `;

        grid.appendChild(card);

    });

}

/*==========================================================
 Update Counters
==========================================================*/

function updateCounters(){

    const fav=document.getElementById("totalFavorites");

    const recent=document.getElementById("totalRecent");

    const subjects=document.getElementById("totalSubjects");

    const notes=document.getElementById("totalNotes");

    if(subjects){

        subjects.textContent=

        Object.keys(groupedSubjects).length;

    }

    if(notes){

        notes.textContent=

        subjectsData.length;

    }

    if(fav){

        fav.textContent=

        getFavorites().length;

    }

    if(recent){

        recent.textContent=

        getRecent().length;

    }

}

/*==========================================================
 Install PWA
==========================================================*/

let deferredPrompt;

const installBtn=

document.getElementById("installApp");

window.addEventListener(

"beforeinstallprompt",

e=>{

e.preventDefault();

deferredPrompt=e;

if(installBtn){

installBtn.style.display="flex";

}

});

if(installBtn){

installBtn.addEventListener("click",async()=>{

if(!deferredPrompt) return;

deferredPrompt.prompt();

await deferredPrompt.userChoice;

installBtn.style.display="none";

});

}

/*==========================================================
 Online / Offline
==========================================================*/

window.addEventListener(

"offline",

()=>{

showToast(

"No Internet Connection"

);

});

window.addEventListener(

"online",

()=>{

showToast(

"Back Online"

);

});

/*==========================================================
 Open Note Tracking
==========================================================*/

document.addEventListener(

"click",

e=>{

const link=e.target.closest("a");

if(!link) return;

const href=link.getAttribute("href");

if(!href) return;

const note=

subjectsData.find(

item=>item.file===href

);

if(note){

saveRecent(note);

}

});

/*==========================================================
 Dashboard Refresh
==========================================================*/

function refreshDashboard(){

    renderFavorites();

    renderRecent();

    updateCounters();

}

/*==========================================================
 Startup
==========================================================*/

window.addEventListener(

"load",

()=>{

refreshDashboard();

});

/*==========================================================
 End of script.js
==========================================================*/




