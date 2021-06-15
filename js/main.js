document.addEventListener("DOMContentLoaded", _ => {
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", event => {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", _ => console.log("Data berhasil disimpan"));
document.addEventListener("ondataloaded", _ => refreshDataFromBooks());