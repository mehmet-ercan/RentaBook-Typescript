// export NODE_OPTIONS=--openssl-legacy-provider
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

let db: DataBase = new DataBase();
initiliazeServices(db);
addListenerForMenuItems();


function initiliazeServices(db: DataBase) {
  bookService = new BookService(db);
  customerService = new CustomerService(db);
  cancelSaleService = new CancelSaleService(db);
  rentService = new RentService(db);
  saleService = new SaleService(db);
  stockService = new StockService(db);
  console.log("Services intiliazed");
}

function addListenerForMenuItems() {
  //saleService.updateSaleCart();
  showAndHide("addBookMenuItem", "addBookSection");
  showAndHide("bookCardsMenuItem", "listBooksSection");
  showAndHide("addCustomerMenuItem", "addCustomerSection");
  showAndHide("addStockMenuItem", "addStockSection");
  showAndHide("saleBookMenuItem", "saleBookSection");
}

function showAndHide(btnId: string, elementId: string) {
  //saleService.updateSaleCart();

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
    bookService.addBook(book);

    console.log("Kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
    form.reset();

    for (let b of db.getBooksList) {
      console.log(b.isbn);
      console.log(b.name);
      console.log(b.pages);
      console.log(b.publishYear);
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

    const customer = new Customer(customerService.getNewCustomerId(), name, surname, phoneNumber);

    customerService.addCustomer(customer);
    console.log(customer);
    console.log("Müşteri Ekleme İşlemi Başarı İle Tamamlanmıştır. ");

    addCustomerForm.reset();

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
      console.log("Stok eklenmeye çalışılan kitap, kayıtlı değildir. Litfen önce kitap ekleyiniz");
    }
    else {
      db.getStocksList.push(stock);
      console.log(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
    }

    return false; // prevent reload
  };
}

const saleBookForm = <HTMLFormElement>(document.getElementById("sale-book-form"));
if (saleBookForm) {
  saleBookForm.onsubmit = () => {

    customerService.addCustomer(new Customer(1, "", "", ""));
    customerService.addCustomer(new Customer(2, "", "", ""));

    bookService.addBook(new Book("123-45","Neredeyiz" , "Mehmet Ercan", "2021", 109, new BookSpecification("123-45", 25.99, new Date, new Date)));

    bookService.addBook(new Book("123-46","Neredeyiz 2" , "Mehmet Ercan", "2022", 179, new BookSpecification("123-46", 29.99, new Date, new Date)));

    const formData = new FormData(saleBookForm);

    const isbn = formData.get("isbnForSale") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForSale") as string);
    const customer: boolean = customerService.isValidCustomer(customerId);
    const quantity = formData.get("quantityForSale") as unknown as number;

    try {
      if (book) {
        if (customer) {
          saleService.addBookToCart(book, quantity, customerId);
        } else {
          console.log(customerId + " numaralı müşteri kayıtlı değildir.");
        }
      } else {
        console.log(isbn + " numaralı kitap yoktur.");
      }
      return false;
    } catch (error) {
      console.log(error);
    }



  }
}

const btnAddBookToSale = <HTMLButtonElement>(document.getElementById(""));