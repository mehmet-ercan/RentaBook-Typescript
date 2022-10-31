// export NODE_OPTIONS=--openssl-legacy-provider
import { DataBase } from "./db/database";
import fetch from 'node-fetch'

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

export let bookService: BookService;
export let customerService: CustomerService;
export let cancelSaleService: CancelSaleService;
export let rentService: RentService;
export let saleService: SaleService;
export let stockService: StockService;

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
  console.log("Services intiliazed.");

  bookService.addBook(new Book("123-45", "Neredeyiz", "Mehmet Ercan", "2021", 109, new BookSpecification("123-45", 25.99, new Date, new Date)));
  bookService.addBook(new Book("123-46", "Neredeyiz 2", "Mehmet Ercan", "2022", 179, new BookSpecification("123-46", 29.99, new Date, new Date)));

  customerService.addCustomer(new Customer(1, "", "", ""));
  customerService.addCustomer(new Customer(2, "", "", ""));

  stockService.addStock("123-45", "A45-52", 10);
  stockService.addStock("123-46", "A45-52", 10);

}

function addListenerForMenuItems() {
  //saleService.updateSaleCart();
  showAndHide("addBookMenuItem", "addBookSection");
  showAndHide("showBooksMenuItem", "listBooksSection");
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

const addBookForm = <HTMLFormElement>document.getElementById("add-book-form");
if (addBookForm != null) {
  addBookForm.onsubmit = () => {
    const formData = new FormData(addBookForm);

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
    //bookService.addBook(book);

    bookService.addBookMock(book);
    alert(book.isbn + " numaralı kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
    addBookForm.reset();

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

    // if (!isContainsBook) {
    //   alert("Stok eklenmeye çalışılan kitap, kayıtlı değildir. Lütfen önce kitap ekleyiniz");
    // }
    // else {
    //   stockService.increaseStock(isbn, quanttiy);
    //   alert(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
    // }

    alert(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
    stockService.addStockMock(stock);
    addStockForm.reset();
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
    alert("Müşteri Ekleme İşlemi Başarı İle Tamamlanmıştır. ");

    addCustomerForm.reset();

    return false; // prevent reload
  };


}

const saleBookForm = <HTMLFormElement>(document.getElementById("sale-book-form"));
if (saleBookForm) {
  saleBookForm.onsubmit = () => {

    const formData = new FormData(saleBookForm);

    const isbn = formData.get("isbnForSale") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForSale") as string);
    const customer: boolean = customerService.isValidCustomer(customerId);
    const quantity = parseInt(formData.get("quantityForSale") as string);

    const stock = stockService.getStock(isbn);

    try {
      if (book) {
        if (stock.quantity >= quantity) {
          if (customer) {
            saleService.addBookToCart(book, quantity, customerId);

          } else {
            alert(customerId + " numaralı müşteri kayıtlı değildir.");
          }
        }
        else {
          alert(quantity + " kadar kitap dükkanda mevcut değildir.");
        }
      } else {
        alert(isbn + " numaralı kitap yoktur.");
      }

      saleBookForm.reset();
      return false;

    } catch (error) {
      alert(error);
    }
  }
}

const btnBuy = <HTMLButtonElement>(document.getElementById("btnBuy"));
btnBuy.addEventListener("click", () => {
  if (saleService.dataBase.getSaleCart.bookAndQuantityMap.size === 0) {
    alert("Sepette ürün yok. Lütfen önce ürün ekleyiniz");
  } else {
    saleService.cartToSale();
  }

});

const btnShowBooksMenuItem = <HTMLElement>(document.getElementById("showBooksMenuItem"));
btnShowBooksMenuItem.addEventListener("click", () => {
  bookService.initializeBooksMock();
})

