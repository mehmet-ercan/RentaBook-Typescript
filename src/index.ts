//export NODE_OPTIONS=--openssl-legacy-provider

import { doc } from "prettier";
import { cli } from "webpack";
import { DataBase } from "./db/database";

import { Book } from "./domain/book";
import { BookSpecification } from "./domain/book-specification";
import { Customer } from "./domain/customer";
import { Stock } from "./domain/stock";
import { BookService } from "./service/book-service";
import { CancelSaleService } from "./service/cancal-sale-service";
import { CustomerService } from "./service/customer-service";
import { RentService } from "./service/rent-service";
import { SaleService } from "./service/sale-service";
import { StockService } from "./service/stock-service";

let bookService: BookService;
let customerService: CustomerService;
let cancelSaleService: CancelSaleService;
let rentService: RentService;
let saleService: SaleService;
let stockService: StockService;

let db!: DataBase;
initiliazeServices(db);
addListenerForMenuItems();

function initiliazeServices(db: DataBase) {
  console.log("intiliaze services");

  db = new DataBase();

  bookService = new BookService(db);
  customerService = new CustomerService(db);
  cancelSaleService = new CancelSaleService(db);
  rentService = new RentService(db);
  saleService = new SaleService(db);
  stockService = new StockService(db);
}

function addListenerForMenuItems(){
  showAndHide("addBookMenuItem","addBookSection");
  showAndHide("bookCardsMenuItem","listBooksSection");
  showAndHide("addCustomerMenuItem","addCustomerSection");
  showAndHide("addStockMenuItem","addStockSection");
  showAndHide("saleBookMenuItem","saleBookSection");
}


function showAndHide(btnId: string, elementId: string) {

  const element = document.getElementById(elementId);
  const btn = document.getElementById(btnId);

  if (element && btn) {
    btn.addEventListener("click", () => {
      if (element.style.display === "none") {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    });
  }
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
    db.getBooksList.push(book);

    alert("Kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
    form.reset();

    console.log(book);

    for (var b of db.getBooksList) {
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


const addCustomerForm = <HTMLFormElement>(document.getElementById("add-customer-form"));
if (addCustomerForm) {

  addCustomerForm.onsubmit = () => {
    const formData = new FormData(addCustomerForm);

    const name = formData.get("customerName") as string;
    const surname = formData.get("customerSurname") as string;
    const phoneNumber = formData.get("customerPhoneNumber") as string;

    const customer = new Customer(1, name, surname, phoneNumber);
    db.getCustomersList.push(customer);

    alert("Müşteri Ekleme İşlemi Başarı İle Tamamlanmıştır. ");
    addCustomerForm.reset();
    console.log(customer);

    return false; // prevent reload
  };


}

const addStockForm = <HTMLFormElement>(document.getElementById("add-stock-form"));
if (addStockForm) {
  addStockForm.onsubmit = () => {

    const formData = new FormData(addStockForm);

    const isbn = formData.get("bookIsbnForAddStock") as string;
    const quanttiy = formData.get("stockQuantity") as unknown as number;
    const shelfNumber = formData.get("shelfNumber") as string;

    const stock = new Stock(isbn, quanttiy, shelfNumber);

    const isContainsBook = db.getBooksList.some(b => b.isbn == isbn);

    if (!isContainsBook) {
      alert("Stok eklenmeye çalışılan kitap, kayıtlı değildir. Litfen önce kitap ekleyiniz");
    }
    else {
      db.getStocksList.push(stock);
      alert(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
    }

    return false; // prevent reload
  };
}


const saleBookForm = <HTMLFormElement>(document.getElementById("sale-book-form"));
const btnAddBookToCart = (document.getElementById("btnAddBookToCart"));

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


