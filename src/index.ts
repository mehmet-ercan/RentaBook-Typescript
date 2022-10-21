import { DataBase } from "./db/database";
import { Book } from "./domain/book";

/*export NODE_OPTIONS=--openssl-legacy-provider*/

const db = new DataBase();

const addBookMenuItem = document.getElementById("addBookMenuItem");
const addBookSection = document.getElementById("addBookSection");

if (addBookMenuItem != null && addBookSection != null) {
  let a = "ali";

  addBookMenuItem.addEventListener("click", function click() {
    if (addBookSection.style.display === "none") {
      addBookSection.style.display = "block";
    } else {
      a = "";
      addBookSection.style.display = "none";
    }
  });
}

const bookCardsMenuItem = document.getElementById("bookCardsMenuItem");
const bookCardsSection = document.getElementById("bookCardsSection");

if (bookCardsMenuItem != null && bookCardsSection != null) {
  bookCardsMenuItem.addEventListener("click", () => {
    if (bookCardsSection.style.display == "none") {
      bookCardsSection.style.display = "block";
    } else {
      bookCardsSection.style.display = "none";
    }
  });
}

const form = document.getElementById("add-book-form");

if (form != null) {
  form.onsubmit = () => {
    const formData = new FormData(<HTMLFormElement>form);

    const title = formData.get("bookTitle") as string;
    const author = formData.get("bookAuthor") as string;
    const isbn = formData.get("bookIsbn") as string;
    const publishYear = formData.get("bookPublishYear") as string;
    const pages = formData.get("bookPages") as unknown as number;

    const book = new Book(title, author, isbn, publishYear, pages);
    db.books.push(book);

    console.log(book);

    for (var b of db.books) {
      console.log(b.isbn);
      console.log(b.name);
      console.log(b.author);
      console.log(b.publishYear);
      console.log(b.pages);
    }

    return false; // prevent reload
  };
}

/*
const incrementButton = <HTMLButtonElement>document.querySelector("#increment");
const decrementButton = <HTMLButtonElement>document.querySelector("#decrement");
const countValue = <HTMLSpanElement>document.querySelector("#count-value");

const handleIncrementClick = () => {
  const currentValue = parseFloat(countValue.innerText);
  const incrementedValue = increment(currentValue);
  countValue.innerText = incrementedValue.toString();
};

const handleDecrementClick = () => {
  const currentValue = parseFloat(countValue.innerText);
  const decrementedValue = decrement(currentValue);
  countValue.innerText = decrementedValue.toString();
};

incrementButton.addEventListener("click", handleIncrementClick);
decrementButton.addEventListener("click", handleDecrementClick);
*/
