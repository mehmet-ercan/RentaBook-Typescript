// export NODE_OPTIONS=--openssl-legacy-provider
import { DataBase } from "./db/database";
import { Book } from "./domain/book";
import { BookSpecification } from "./domain/book-specification";
import { Cancel } from "./domain/cancel";
import { Customer } from "./domain/customer";
import { Rent } from "./domain/rent";
import { Sale } from "./domain/sale";
import { SaleBookItems } from "./domain/sale-book-item";
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

  stockService.addStock("123-45", "A45-52", 10);
  stockService.addStock("123-46", "A45-52", 10);
}

async function initiliazeData() {
  await bookService.initializeDataMock();


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
    const startDate = new Date();
    const endDate = new Date('Dec 31, 9999 23:59:59');

    title.match("");


    const bookSpec = new BookSpecification(isbn, price, startDate, endDate);
    const book = new Book(isbn, title, author, publishYear, pages, bookSpec);
    //bookService.addBook(book);

    let success = await bookService.addBookMock(book);
    if (success) {
      alert(book.isbn + " numaralı kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
      addBookForm.reset();
    } else {
      alert(book.isbn + " numaralı kitap Ekleme İşlemi Sırasında Bir Hata oluştu.");
    }

    return false; // prevent reload
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

    const stock = new Stock(isbn, quanttiy, shelfNumber);

    const isContainsBook = bookService.bookList.some(b => b.isbn == isbn);

    if (!isContainsBook) {
      alert("Stok eklenmeye çalışılan kitap, kayıtlı değildir. Lütfen önce kitap ekleyiniz");
    }
    else {
      let isOk = await stockService.addStockMock(stock);

      if (isOk) {
        alert(isbn + " isbn numaralı kitaptan, " + quanttiy + " kadar sisteme stok eklenmiştir.");
      }


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
  saleBookForm.onsubmit = () => {

    const formData = new FormData(saleBookForm);

    const isbn = formData.get("isbnForSale") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForSale") as string);
    //isValidCustomer rest servisten döenen veriye göre şekillenecek
    const isValidCustomer: boolean = true; //customerService.isValidCustomer(customerId);
    const quantity = parseInt(formData.get("quantityForSale") as string);

    const stock = stockService.getStock(isbn)!;

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
  if (saleService.saleCart.saleBookItems.length === 0) {
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
  bookService.listBooks();
})

const cancelSaleForm = <HTMLFormElement>document.getElementById("cancel-sale-form");
if (cancelSaleForm) {
  cancelSaleForm.onsubmit = async (e) => {
    e.preventDefault();

    let bq = new Array<SaleBookItems>;
    bq.push(new SaleBookItems(bookService.getBook("123-45"), 3))

    let a = new Sale(bq, new Date, 1, "S021122163045", 123);
    saleService.saleList.push(a);

    const formData = new FormData(cancelSaleForm);
    const saleNumber = formData.get("saleNumberforCancel") as string;

    let sale = saleService.getSale(saleNumber);

    if (sale) {
      let cancelSale: Cancel = new Cancel(sale, sale.total, new Date);
      let state = await cancelService.cancelSaleMock(cancelSale);

      if (state) {
        alert(sale.operationNumber + " numaralı satış iptal edilmiştir.");
      } else {
        alert(sale.operationNumber + " numaralı satış iptal edilirken hata meydana geldi.");
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

    // Kiralama iptalinin çalışabilmesi için önce veri ekledim, sonra iptal işlemi çalışıyor
    let bq = new Map<Book, number>(); // bq > book and quantity
    bq.set(bookService.getBook("123-45"), 3);

    let rDate = new Date;
    rDate.setDate(rDate.getDate() + 14);

    let a = new Rent(bq, new Date, 1, "R021122163045", 123, rDate, 200);
    rentService.rentList.push(a);

    const formData = new FormData(cancelRentForm);
    const rentNumber = formData.get("rentNumberforCancel") as string;

    let rent = rentService.getRent(rentNumber);

    if (rent) {
      let cancelRent: Cancel = new Cancel(rent, rent.total, new Date);
      let state = await cancelService.cancelRentMock(cancelRent);

      if (state) {
        alert(rent.operationNumber + " numaralı kiralama iptal edilmiştir.");
      } else {
        alert(rent.operationNumber + " numaralı kiralama iptal edilirken hata meydana geldi.");
      }
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
  rentBookForm.onsubmit = () => {

    const formData = new FormData(rentBookForm);

    const isbn = formData.get("isbnForRent") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForRent") as string);
    //isValidCustomer rest servisten döenen veriye göre şekillenecek
    const isValidCustomer: boolean = true; //customerService.isValidCustomer(customerId);
    const quantity = parseInt(formData.get("quantityForRent") as string);

    const stock = stockService.getStock(isbn)!;

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
          alert(`Dükkanda ${isbn} numaralı kitabın stoğu mevcut değildir.`);
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
  if (rentService.rentCart.bookAndQuantityMap.size === 0) {
    alert("Sepette ürün yok. Lütfen önce ürün ekleyiniz");
  } else {
    rentService.cartToRent();
  }

});

const refundBookForm = <HTMLFormElement>(document.getElementById("refund-book-form"));
if (refundBookForm) {
  refundBookForm.onsubmit = async (e) => {

    // Kiralama iptalinin çalışabilmesi için önce veri ekledim, sonra iptal işlemi çalışıyor
    let bq = new Map<Book, number>(); // bq > book and quantity
    bq.set(bookService.getBook("123-45"), 3);

    let rDate = new Date;
    rDate.setDate(rDate.getDate() + 23);

    let a = new Rent(bq, new Date, 1, "R021122163045", 123, rDate, 0);
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