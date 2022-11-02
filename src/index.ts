// export NODE_OPTIONS=--openssl-legacy-provider
import { DataBase } from "./db/database";
import { Book } from "./domain/book";
import { BookSpecification } from "./domain/book-specification";
import { CancelSale } from "./domain/cancal-sale";
import { Customer } from "./domain/customer";
import { Sale } from "./domain/sale";
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
initiliazeData();
addListenerForMenuItems();



function initiliazeServices(db: DataBase) {
  bookService = new BookService(db.getBooksList, db.getBookSpecifications);
  customerService = new CustomerService(db.getCustomersList);
  cancelSaleService = new CancelSaleService(db.getCancaledSales);
  rentService = new RentService(db.getRents);
  saleService = new SaleService(db.getSalesList, db.getSaleCart);
  stockService = new StockService(db.getStocksList);
  console.log("Services intiliazed.");

  customerService.addCustomer(new Customer(1, "", "", ""));
  customerService.addCustomer(new Customer(2, "", "", ""));

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
  showAndHide("cancelSaleMenuItem", "cancelSaleSection");
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

    const bookSpec = new BookSpecification(isbn, price, startDate, endDate);
    const book = new Book(isbn, title, author, publishYear, pages, bookSpec);
    //bookService.addBook(book);

    let success = await bookService.addBookMock(book);
    if(success){
      alert(book.isbn + " numaralı Kitap Ekleme İşlemi Başarı İle Tamamlanmıştır.");
      addBookForm.reset();
    }else{
      alert(book.isbn + " numaralı Kitap Ekleme İşlemi Sırasında Bir Hata oluştu.");
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

    const customer = new Customer(customerService.getNewCustomerId(), name, surname, phoneNumber);
    await customerService.addCustomerMock(customer);

    alert("Müşteri Ekleme İşlemi Başarı İle Tamamlanmıştır. ");
    addCustomerForm.reset();
    return false; // prevent reload
  };
}

/**Burada mock servisi yok çünkü burada kitap satışı yapılırken, kitapları sepete ekliyoruz.
 * Sepete ekledikten sonra btnBuy idli butonun click eventi, mock servisi çağırıyor
 */
const saleBookForm = <HTMLFormElement>(document.getElementById("sale-book-form"));
if (saleBookForm) {
  saleBookForm.onsubmit = () => {

    const formData = new FormData(saleBookForm);

    const isbn = formData.get("isbnForSale") as string;
    const book = bookService.getBook(isbn);
    const customerId = parseInt(formData.get("customerIdForSale") as string);
    const customer: boolean = customerService.isValidCustomer(customerId);
    const quantity = parseInt(formData.get("quantityForSale") as string);

    const stock = stockService.getStock(isbn)!;

    try {
      if (book) {
        if (stock) {
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
 * Ekleme işlemi bittikten sonra satın alm iiçin bu butona tıklandığında servise gidip sepetteki kitapların satışı gerçekleşiyor
 * Burada diğer butonlarda olduğu gibi direk mock servisine bağlanmak yerine servise gitmek durumundayız. 
 * Çünkü serviste Sale nesnesini oluşturup mock servisine parametre olark geçiyoruz.
 */
const btnBuy = <HTMLButtonElement>(document.getElementById("btnBuy"));
btnBuy.addEventListener("click", () => {
  if (saleService.saleCart.bookAndQuantityMap.size === 0) {
    alert("Sepette ürün yok. Lütfen önce ürün ekleyiniz");
  } else {
    saleService.cartToSale();
  }

});

/**
 * Sepetteki kitapları mock servise göndererek satış yapılıyor.
 */
const btnShowBooksMenuItem = <HTMLElement>(document.getElementById("showBooksMenuItem"));
btnShowBooksMenuItem.addEventListener("click", () => {
  bookService.listBooks();
})

const cancelSaleForm = <HTMLFormElement>document.getElementById("cancel-sale-form");
if (cancelSaleForm) {
  cancelSaleForm.onsubmit = async (e) => {
    e.preventDefault();

    let bq = new Map<Book, number>();
    bq.set(bookService.getBook("123-45"), 3);

    let a = new Sale(bq, new Date, 1, "S021122163045", 123);
    saleService.saleList.push(a);

    const formData = new FormData(cancelSaleForm);
    const saleNumber = formData.get("saleNumberforCancel") as string;

    let sale = saleService.getSale(saleNumber);

    if (sale) {
      let cancelSale: CancelSale = new CancelSale(sale, sale.total, new Date);
      let state = await cancelSaleService.cancelSaleMock(cancelSale);

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