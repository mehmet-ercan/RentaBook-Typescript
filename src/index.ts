// export NODE_OPTIONS=--openssl-legacy-provider
import { DataBase } from "./db/database";
import { Book } from "./domain/book";
import { BookPrice } from "./domain/book-price";
import { Cancel } from "./domain/cancel";
import { Customer } from "./domain/customer";
import { Rent } from "./domain/rent";
import { Sale } from "./domain/sale";
import { OrderBookItems } from "./domain/order-book-item";
import { Stock } from "./domain/stock";
import { BookService } from "./service/book-service";
import { CancelService } from "./service/cancel-service";
import { CustomerService } from "./service/customer-service";
import { RentService } from "./service/rent-service";
import { SaleService } from "./service/sale-service";
import { StockService } from "./service/stock-service";

export let bookService: BookService;
export let customerService: CustomerService;
export let cancelService: CancelService;
export let rentService: RentService;
export let saleService: SaleService;
export let stockService: StockService;

let db: DataBase = new DataBase();
initiliazeServices(db);
initiliazeData();
addListenerForMenuItems();

function initiliazeServices(db: DataBase) {
  bookService = new BookService(db.getBooksList, db.getBookSpecifications);
  customerService = new CustomerService(db.getCustomersList);
  cancelService = new CancelService(db.getCancaledSales);
  rentService = new RentService(db.getRents, db.getRentCart);
  saleService = new SaleService(db.getSalesList, db.getSaleCart);
  stockService = new StockService(db.getStocksList);
  console.log("Services intiliazed.");

  customerService.addCustomer(new Customer("", "", ""));
  customerService.addCustomer(new Customer("", "", ""));
}

async function initiliazeData() {
  bookService.bookList = await bookService.getAllBooksData();
  stockService.stockList = await stockService.getAllStocksData();

  console.log(bookService.bookList);
  console.log(stockService.stockList);

  listBooks;

}

function addListenerForMenuItems() {
  //saleService.updateSaleCart();
  showAndHide("addBookMenuItem", "addBookSection");
  showAndHide("showBooksMenuItem", "listBooksSection");
  showAndHide("addCustomerMenuItem", "addCustomerSection");
  showAndHide("addStockMenuItem", "addStockSection");
  showAndHide("saleBookMenuItem", "saleBookSection");
  showAndHide("rentBookMenuItem", "rentBookSection");
  showAndHide("cancelSaleMenuItem", "cancelSaleSection");
  showAndHide("cancelRentMenuItem", "cancelRentSection");
  showAndHide("refundBookMenuItem", "refundBookSection");
  showAndHide("rentNow", "rentBookSection");

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
  addBookForm.onsubmit = async (e) => {

    e.preventDefault();
    const formData = new FormData(addBookForm);

    const title = formData.get("bookTitle") as string;
    const author = formData.get("bookAuthor") as string;
    const isbn = formData.get("bookIsbn") as string;
    const publishYear = formData.get("bookPublishYear") as string;
    const pages = formData.get("bookPages") as unknown as number;
    const price = formData.get("bookPrice") as unknown as number;

    const bookPrice = new BookPrice();
    bookPrice.price = price;

    const book = new Book(isbn, title, author, publishYear, pages, bookPrice);
    let isSameIsbn: boolean = bookService.bookList.some((obj) => {
      return obj.isbn === book.isbn;
    });

    if (isSameIsbn === false) {
      let success = await bookService.createBook(book);

      if (success) {
        alert(book.isbn + " numaralı kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
        addBookForm.reset();
        listBooks();
      } else {
        alert(book.isbn + " numaralı kitap Ekleme İşlemi Sırasında Bir Hata oluştu.");
      }

      return false; // prevent reload page
    } else {
      alert("Aynı ISBN numrasına sahip ikinci bir kitap eklenemz.");
    }


  };
}

const addStockForm = <HTMLFormElement>(document.getElementById("add-stock-form"));
if (addStockForm) {
  addStockForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(addStockForm);

    const isbn = formData.get("bookIsbnForAddStock") as string;
    const quanttiy = formData.get("stockQuantity") as unknown as number;
    const shelfNumber = formData.get("shelfNumber") as string;

    const book = bookService.bookList.find(b => b.isbn === isbn)!;

    if (book) {
      const stock = new Stock(quanttiy, shelfNumber, book);
      let isOk = await stockService.createStock(stock);

      if (isOk) {
        alert(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
        await initiliazeData();
        await listBooks();
      }
    }
    else {
      alert("Stok eklenmeye çalışılan kitaba ait isbn numarası hatalıdır.");
    }

    addStockForm.reset();
    return false; // prevent reload
  };
}

/**
 * Müşteri ekleme formu submit olayını mock customerService deki mock servise bağladım
 */
const addCustomerForm = <HTMLFormElement>(document.getElementById("add-customer-form"));
if (addCustomerForm) {
  addCustomerForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(addCustomerForm);

    const name = formData.get("customerName") as string;
    const surname = formData.get("customerSurname") as string;
    const phoneNumber = formData.get("customerPhoneNumber") as string;

    const customer = new Customer(name, surname, phoneNumber);
    let success = await customerService.addCustomerMock(customer);

    if (success) {
      alert("Müşteri Ekleme İşlemi Başarı İle Tamamlanmıştır. ");
      addCustomerForm.reset();
    } else {
      alert("Müşteri Ekleme İşlemi Sırasında bir hata ile karşılıldı. ");
    }

    return false; // prevent reload
  };
}

/**Burada mock servisi yok çünkü burada kitap satışı yapılırken, kitapları sepete ekliyoruz.
 * Sepete ekledikten sonra btnSale idli butonun click eventi, mock servisi çağırıyor
 */
const saleBookForm = <HTMLFormElement>(document.getElementById("sale-book-form"));
if (saleBookForm) {
  saleBookForm.onsubmit = async (e) => {

    e.preventDefault();
    const formData = new FormData(saleBookForm);

    const isbn = formData.get("isbnForSale") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForSale") as string);
    //isValidCustomer rest servisten döenen veriye göre şekillenecek
    const isValidCustomer: boolean = true; //customerService.isValidCustomer(customerId);
    const quantity = parseInt(formData.get("quantityForSale") as string);

    let stock = await stockService.getStockByBookId(book.id)!;

    try {
      if (book) {
        if (stock) {
          if (stock.quantity >= quantity) {
            if (isValidCustomer) {
              saleService.addBookToCart(book, quantity, customerId);
            } else {
              alert(customerId + " numaralı müşteri kayıtlı değildir.");
            }
          }
          else {
            alert(quantity + " kadar kitap dükkanda mevcut değildir.");
          }
        } else {
          alert(`Dükkanda ${isbn} numaralı kitabın stoğu mevcut değildir.`);
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

/**
 * Kitap satışı için işlem yapılırken kitaplar sepete ekleniyor.
 * Ekleme işlemi bittikten sonra satın alm için bu butona tıklandığında servise gidip sepetteki kitapların satışı gerçekleşiyor
 * Burada diğer butonlarda olduğu gibi direk mock servisine bağlanmak yerine servise gitmek durumundayız. 
 * Çünkü serviste Sale nesnesini oluşturup mock servisine parametre olarak geçiyoruz.
 */
const btnSale = <HTMLButtonElement>(document.getElementById("btnSale"));
btnSale.addEventListener("click", () => {
  if (saleService.saleCart.orderBookItems.length === 0) {

    alert("Sepette ürün yok. Lütfen önce ürün ekleyiniz");
  } else {
    saleService.cartToSale();
  }

});

/**
 * Kitapları listelemek için tıklanılan buton click eventi
 */
const btnShowBooksMenuItem = <HTMLElement>(document.getElementById("showBooksMenuItem"));
btnShowBooksMenuItem.addEventListener("click", () => {

  listBooks();
})

const cancelSaleForm = <HTMLFormElement>document.getElementById("cancel-sale-form");
if (cancelSaleForm) {
  cancelSaleForm.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(cancelSaleForm);
    const saleNumber = formData.get("saleNumberforCancel") as string;


    let isExistSale = await saleService.isExistSale(saleNumber);

    if (isExistSale === true) {

      let state = await cancelService.cancelSaleMock(saleNumber);

      if (state) {
        alert(saleNumber + " numaralı satış iptal edilmiştir.");
      } else {
        alert(saleNumber + " numaralı satış iptal edilirken hata meydana geldi.");
      }
    } else {
      alert(saleNumber + " numaralı satış bulunamamıştır. Tekrar deneyiniz.");
    }

  }
}

const cancelRentForm = <HTMLFormElement>document.getElementById("cancel-rent-form");
if (cancelRentForm) {
  cancelRentForm.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(cancelRentForm);
    const rentNumber = formData.get("rentNumberforCancel") as string;

    let state = await cancelService.cancelRentMock(rentNumber);

    if (state) {
      alert(rentNumber + " numaralı kiralama iptal edilmiştir.");
    } else {
      alert(rentNumber + " numaralı kiralma bulunamamıştır. Tekrar deneyiniz.");
    }
  }
}

/**Burada mock servisi yok çünkü burada kitap kiralaması yapılırken, kitapları sepete ekliyoruz.
 * Sepete ekledikten sonra btnRent idli butonun click eventi, mock servisi çağırıyor
 */
const rentBookForm = <HTMLFormElement>(document.getElementById("rent-book-form"));
if (rentBookForm) {
  rentBookForm.onsubmit = async () => {

    const formData = new FormData(rentBookForm);

    const isbn = formData.get("isbnForRent") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForRent") as string);
    //isValidCustomer rest servisten döenen veriye göre şekillenecek
    const isValidCustomer: boolean = true; //customerService.isValidCustomer(customerId);
    const quantity = parseInt(formData.get("quantityForRent") as string);

    const stock = await stockService.getStockByBookId(book.id)!;

    try {
      if (book) {
        if (stock) {
          if (stock.quantity >= quantity) {
            if (isValidCustomer) {
              rentService.addBookToCart(book, quantity, customerId);
            } else {
              alert(customerId + " numaralı müşteri kayıtlı değildir.");
            }
          }
          else {
            alert(quantity + " kadar kitap dükkanda mevcut değildir.");
          }
        } else {
          alert(`Dükkanda ${isbn} numaralı kitabın stoğu mevcut değildir. Önce stok ekleyiniz`);
        }
      } else {
        alert(isbn + " numaralı kitap yoktur.");
      }

      rentBookForm.reset();
      return false;

    } catch (error) {
      alert(error);
    }
  }
}

/**
 * Kitap satışı için işlem yapılırken kitaplar sepete ekleniyor.
 * Ekleme işlemi bittikten sonra satın alm iiçin bu butona tıklandığında servise gidip sepetteki kitapların satışı gerçekleşiyor
 * Burada diğer butonlarda olduğu gibi direk mock servisine bağlanmak yerine servise gitmek durumundayız. 
 * Çünkü serviste Sale nesnesini oluşturup mock servisine parametre olark geçiyoruz.
 */
const btnRent = <HTMLButtonElement>(document.getElementById("btnRent"));
btnRent.addEventListener("click", () => {
  if (rentService.rentCart.orderBookItems.length === 0) {
    alert("Sepette ürün yok. Lütfen önce ürün ekleyiniz");
  } else {
    rentService.cartToRent();
  }

});

const refundBookForm = <HTMLFormElement>(document.getElementById("refund-book-form"));
if (refundBookForm) {
  refundBookForm.onsubmit = async (e) => {

    // Kiralama işleminden geri ödeme işlemi çalışabilmesi için önce kiralama verisi ekledim, 
    // Sonra geri ödeme işlemi çalışıyor
    let sbi = new Array<OrderBookItems>;
    sbi.push(new OrderBookItems(bookService.getBook("123-45"), 3))

    let rDate = new Date;
    rDate.setDate(rDate.getDate() + 23);

    let a = new Rent(sbi, new Date, 1, "R021122163045", 123, rDate, 0);
    a.refund = rentService.calculateRefundAmount(a);

    rentService.rentList.push(a);
    //Veri Girişi son alanı

    e.preventDefault();
    const formData = new FormData(refundBookForm);
    const rentNumber = formData.get("rentNumberforRefund") as string;

    let rent = rentService.getRent(rentNumber);
    if (rent) {

      let refund = await rentService.refundRentMock(rent);

      if (refund) {
        alert(rent.operationNumber + " numaralı kiralama geri alınmıştır.");
        alert("Geri ödeme miktarı:" + refund + " ₺ .")
      } else {
        alert(rent.operationNumber + " numaralı kiralama iptal edilirken hata meydana geldi.");
      }
    } else {
      alert(rentNumber + " numaralı kiralama bulunamamıştır. Tekrar deneyiniz.");
    }

  };
}

async function listBooks() {

  bookService.bookList = await bookService.getAllBooksData();
  stockService.stockList = await stockService.getAllStocksData();

  const listBooksDiv = document.getElementById("listBooks");

  if (listBooksDiv) {
    let row, column;


    while (listBooksDiv.lastChild && listBooksDiv.children.length > 1) {
      listBooksDiv.removeChild(listBooksDiv.lastChild);
    }

    bookService.bookList.forEach(element => {

      //alert(stockService.getStockQuantity(element.isbn));

      row = document.createElement("div");
      row.className = "row-list-book";

      column = document.createElement("div");
      column.className = "column-list-book";
      column.textContent = element.isbn.toString();
      row.appendChild(column);

      column = document.createElement("div");
      column.className = "column-list-book";
      column.textContent = element.name.toString();
      row.appendChild(column);

      column = document.createElement("div");
      column.className = "column-list-book";
      column.textContent = element.author.toString();
      row.appendChild(column);

      column = document.createElement("div");
      column.className = "column-list-book";

      let isValidSctock: boolean = stockService.stockList.some(s => s.book.id === element.id);
      let q = 0;

      if (isValidSctock === true) {
        q = stockService.stockList.find(s => s.book.id === element.id)!.quantity;
      }

      column.textContent = q.toString();
      row.appendChild(column);

      column = document.createElement("div");
      column.className = "column-list-book";
      column.textContent = element.bookPrice.price.toString() + " ₺";
      row.appendChild(column);

      listBooksDiv.appendChild(row);
    });
  }

}