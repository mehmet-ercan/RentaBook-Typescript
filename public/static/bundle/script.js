(() => {
  "use strict";
  var e = {
      221: (e, o) => {
        Object.defineProperty(o, "__esModule", { value: !0 }),
          (o.DataBase = void 0);
        o.DataBase = function () {
          (this.books = new Array()),
            (this.stocks = new Array()),
            (this.customers = new Array()),
            (this.sales = new Array()),
            (this.rents = new Array()),
            (this.bookSpecifications = new Array());
        };
      },
      934: (e, o) => {
        Object.defineProperty(o, "__esModule", { value: !0 }),
          (o.Book = void 0);
        var t = (function () {
          function e(e, o, t, n, s) {
            (this.name = o),
              (this.author = t),
              (this.isbn = e),
              (this.publishYear = n),
              (this.pages = s);
          }
          return (
            Object.defineProperty(e.prototype, "_name", {
              get: function () {
                return this.name;
              },
              set: function (e) {
                this.name = e;
              },
              enumerable: !1,
              configurable: !0,
            }),
            e
          );
        })();
        o.Book = t;
      },
    },
    o = {};
  function t(n) {
    var s = o[n];
    if (void 0 !== s) return s.exports;
    var r = (o[n] = { exports: {} });
    return e[n](r, r.exports, t), r.exports;
  }
  (() => {
    var e = t(221),
      o = t(934),
      n = new e.DataBase(),
      s = document.getElementById("addBookMenuItem"),
      r = document.getElementById("addBookSection");
    null != s &&
      null != r &&
      s.addEventListener("click", function () {
        "none" === r.style.display
          ? (r.style.display = "block")
          : (r.style.display = "none");
      });
    var a = document.getElementById("bookCardsMenuItem"),
      l = document.getElementById("bookCardsSection");
    null != a &&
      null != l &&
      a.addEventListener("click", function () {
        "none" == l.style.display
          ? (l.style.display = "block")
          : (l.style.display = "none");
      });
    var i = document.getElementById("add-book-form");
    null != i &&
      (i.onsubmit = function () {
        var e = new FormData(i),
          t = e.get("bookTitle"),
          s = e.get("bookAuthor"),
          r = e.get("bookIsbn"),
          a = e.get("bookPublishYear"),
          l = e.get("bookPages"),
          u = new o.Book(t, s, r, a, l);
        n.books.push(u), console.log(u);
        for (var c = 0, d = n.books; c < d.length; c++) {
          var y = d[c];
          console.log(y.isbn),
            console.log(y.name),
            console.log(y.author),
            console.log(y.publishYear),
            console.log(y.pages);
        }
        return !1;
      });
  })();
})();
