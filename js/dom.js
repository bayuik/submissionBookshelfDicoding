const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    let bool;

    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;

    inputBookIsComplete.checked ? (bool = true) : (bool = false);
    const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, bool);
    const book = makeItem(inputTitle, inputAuthor, inputYear, bool);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    inputBookIsComplete.checked ? completedBOOKList.append(book) : uncompletedBOOKList.append(book);
    updateDataToStorage();
}

function makeItem(inputTitle, inputAuthor, inputYear, isCompleted) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = inputTitle;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = inputAuthor;

    const bookYear = document.createElement("p");
    bookYear.innerText = inputYear;

    const itemContainer = document.createElement("article");
    itemContainer.classList.add("book_item");

    const actionButton = document.createElement("div");
    actionButton.classList.add("action");
    if (isCompleted) {
        actionButton.append(createUndoButton(), createDeleteButton());
    } else {
        actionButton.append(createDoneButton(), createDeleteButton());
    }

    itemContainer.append(bookTitle, bookAuthor, bookYear, actionButton);
    return itemContainer;
}

function createButton(textButton, buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.innerText = textButton;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", event => {
        eventListener(event);
    });
    return button;
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookElement.querySelector(".book_item > p").innerText;
    const bookYear = bookElement.querySelector(".book_item > p + p").innerText;

    const newBook = makeItem(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

let createDoneButton = _ => createButton("Selesai dibaca", "green", event => {
    addBookToCompleted(event.target.parentElement.parentElement);
});

function createDeleteButton() {
    const confirmContainer = document.getElementById("confirm");
    const confirmButton = document.getElementById("konfirmasi");
    const cancelButton = document.getElementById("batal");
    
    return createButton("Hapus", "red", event => {
        confirmContainer.style.display = "block";
        confirmButton.onclick = _ => {
            removeBookFroCompleted(event.target.parentElement.parentElement);
            confirmContainer.style.display = "none";
        };
        cancelButton.onclick = () => confirmContainer.style.display = "none";
    });
}

let createUndoButton = _ => createButton("Belum selesai dibaca", "green", event => {
    undoBookFromCompleted(event.target.parentElement.parentElement);
});

function removeBookFroCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
    const listCompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookElement.querySelector(".book_item > p").innerText;
    const bookYear = bookElement.querySelector(".book_item > p + p").innerText;
    const newBook = makeItem(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID)

    for (book of books) {
        const newBook = makeItem(book.bookTitle, book.bookAuthor, book.bookYear, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
        book.isCompleted ? listCompleted.append(newBook) : listUncompleted.append(newBook);
    }
}

function searchBook() {
    let searchBookTitle = document.getElementById('searchBookTitle');
    let filter = searchBookTitle.value.toUpperCase();
    let book = document.getElementsByClassName("book_item");

    for (let i = 0; i < book.length; i++) {
        let bookTitle = book[i].getElementsByTagName("h3")[0];
        let textValue = bookTitle.textContent || bookTitle.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            book[i].style.display = "";
        } else {
            book[i].style.display = "none";
        }
    }
}