const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

/*shows modal focus on input*/
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

/*modal event listeners*/
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

/*validate form function*/
function validate(nameValue, urlValue) {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address.');
        return false;
    }
    /*if form is valid*/
    return true;
}

/*function builds bookmarks*/
function buildBookmarks() {
    /*removes all bookmark elements*/
    bookmarksContainer.textContent = '';
    /*build items*/
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        /*item const*/
        const item = document.createElement('div');
        item.classList.add('item');
        /*close icon const*/
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        /*favicon and link const*/
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        /*favicon const*/
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        /*link const*/
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        /*append to bookmark container*/
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

/*fetch bookmarks*/
function fetchBookmarks() {
    /*gets the bookmarks from local storage if they're available*/
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        /*creates bookmark array in local storage*/
        bookmarks = [
            {
                name: 'Austin Parker Github Repository',
                url: 'https://github.com/shotpoet86?tab=repositories',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

/*deletes bookmark*/
function deleteBookmark(url) {
    /*loops through the bookmark array*/
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    /* Update bookmarks array in localStorage, re-populate DOM*/
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    /*add https if user leaves it out*/
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }
    /*validates input information*/
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    /*set bookmark object, add to array*/
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    /*Set bookmarks in localStorage, fetch, reset input fields*/
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

/*event listeners*/
bookmarkForm.addEventListener('submit', storeBookmark);

/*fetches bookmarks on page load*/
fetchBookmarks();
