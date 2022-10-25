import { DataBase } from "./db/database";
import { Book } from "./domain/book";
import { BookSpecification } from "./domain/book-specification";
import { Customer } from "./domain/customer";
import { Stock } from "./domain/stock";
import { SaleService } from "./service/sale-service";


/*export NODE_OPTIONS=--openssl-legacy-provider*/


const db = new DataBase();

const addBookMenuItem = document.getElementById("addBookMenuItem");
const addBookSection = document.getElementById("addBookSection");

if (addBookMenuItem != null && addBookSection != null) {
  addBookMenuItem.addEventListener("click", function click() {
    if (addBookSection.style.display === "none") {
      addBookSection.style.display = "block";
    } else {
      addBookSection.style.display = "none";
    }
  });
}

const bookCardsMenuItem = document.getElementById("bookCardsMenuItem");
const listBooksSection = document.getElementById("listBooksSection");

if (bookCardsMenuItem != null && listBooksSection != null) {
  bookCardsMenuItem.addEventListener("click", () => {
    if (listBooksSection.style.display == "none") {
      listBooksSection.style.display = "block";
    } else {
      listBooksSection.style.display = "none";
    }
  });
}

const form = <HTMLFormElement>document.getElementById("add-book-form");

if (form != null) {
  form.onsubmit = () => {
    const formData = new FormData(form);

    const title = formData.get("bookTitle") as string;
    const author = formData.get("bookAuthor") as string;
    const isbn = formData.get("bookIsbn") as string;
    const publishYear = formData.get("bookPublishYear") as string;
    const pages = formData.get("bookPages") as unknown as number;
    const price = formData.get("bookPrice") as unknown as number;
    const startDate = new Date();
    const endDate = new Date('Dec 31, 9999 23:59:59');

    const bookSpec = new BookSpecification(isbn, price, startDate, endDate);

    const book = new Book(isbn, title, author, publishYear, pages, bookSpec);
    db.books.push(book);

    alert("Kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
    form.reset();

    console.log(book);

    for (var b of db.books) {
      console.log(b.isbn);
      console.log(b.name);
      console.log(b.author);
      console.log(b.publishYear);
      console.log(b.pages);
      console.log(b.bookSpec.price);
    }

    return false; // prevent reload
  };
}

const addCustomerMenuItem = document.getElementById("addCustomerMenuItem");
const addCustomerSection = document.getElementById("addCustomerSection");

if (addCustomerMenuItem != null && addCustomerSection != null) {
  addCustomerMenuItem.addEventListener("click", () => {
    if (addCustomerSection.style.display == "none") {
      addCustomerSection.style.display = "block";
    } else {
      addCustomerSection.style.display = "none";
    }

  });
}

const addCustomerForm = <HTMLFormElement>(document.getElementById("add-customer-form"));
if (addCustomerForm) {

  addCustomerForm.onsubmit = () => {
    const formData = new FormData(addCustomerForm);

    const name = formData.get("customerName") as string;
    const surname = formData.get("customerSurname") as string;
    const phoneNumber = formData.get("customerPhoneNumber") as string;

    const customer = new Customer(1, name, surname, phoneNumber);
    db.customers.push(customer);

    alert("Müşteri Ekleme İşlemi Başarı İle Tamamlanmıştır. ");
    addCustomerForm.reset();
    console.log(customer);

    return false; // prevent reload
  };


}

const addStockForm = <HTMLFormElement>(document.getElementById("add-stock-form"));
const addStockSection = (document.getElementById("addStockSection"));
const addStockMenuItem = (document.getElementById("addStockMenuItem"));

if (addStockSection && addStockMenuItem) {
  addStockMenuItem.addEventListener("click", () => {
    if (addStockSection.style.display === "none") {
      addStockSection.style.display = "block";
    } else {
      addStockSection.style.display = "none";
    }
  });
}

if (addStockForm) {
  addStockForm.onsubmit = () => {

    const formData = new FormData(addStockForm);

    const isbn = formData.get("bookIsbnForAddStock") as string;
    const quanttiy = formData.get("stockQuantity") as unknown as number;
    const shelfNumber = formData.get("shelfNumber") as string;

    const stock = new Stock(isbn, quanttiy, shelfNumber);

    const isContainsBook = db.books.some(b => b.isbn == isbn);

    if (!isContainsBook) {
      alert("Stok eklenmeye çalışılan kitap, kayıtlı değildir. Litfen önce kitap ekleyiniz");
    }
    else {
      db.stocks.push(stock);
      alert(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
    }

    return false; // prevent reload
  };

  const saleBookForm = <HTMLFormElement>(document.getElementById("sale-book-form"));
  const saleBookSection = (document.getElementById("saleBookSection"));
  const saleBookMenuItem = (document.getElementById("saleBookMenuItem"));
  const btnAddBookToCart = (document.getElementById("btnAddBookToCart"));
  const saleService = new SaleService(db);
  let sale;

  if (saleBookMenuItem && saleBookSection) {
    saleBookMenuItem.addEventListener("click", () => {

      if (saleBookSection.style.display == "none") {
        saleBookSection.style.display = "block";
      } else {
        saleBookSection.style.display = "none"
      }
    });
  }

  if (btnAddBookToCart) {
    btnAddBookToCart.addEventListener("click", () => {

      const formData = new FormData(saleBookForm);

      const isbn = formData.get("isbnForSale") as string;
      const customerId = formData.get("customerIdForSale") as unknown as number;
      const quantity = formData.get("quantityForSale") as string;






    });
  }

  if (saleBookForm) {
    saleBookForm.onsubmit = () => {





    }
  }

}


