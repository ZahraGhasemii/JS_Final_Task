const transactionLoadBtn = document.querySelector(".transaction-load__btn");
const transactionsList = document.querySelector(".transactions__list");
const transactionsSearchBtn = document.querySelector(
  ".transactions__search__btn"
);
const searchInput = document.querySelector(".transactions__search__input");
const priceSortBtn = document.querySelector(".price-sort__btn");

if (transactionsList.innerHTML == "")
  transactionsList.innerHTML = `<div class="message error">تراکنشی وجود ندارد</div>`;

transactionLoadBtn.addEventListener("click", () => {
  searchInput.value = "";
  getTransactionsFromAPI("", "");
});

transactionsSearchBtn.addEventListener("click", (e) => {
  const SearchValue = searchInput.value;
  sendQuerystringToAPI(e, "", SearchValue);
});

const app = axios.create({
  baseURL: "http://localhost:3000/transactions",
});

// Functions

function renderTransactionsData(transactions, sorticon) {
  let result = `
            <table class="transactions__tbl" cell-spacing="0">
            <tr>
              <th>شناسه</th>
              <th>نوع تراکنش</th>
              <th><div class="price-sort"><span>مبلغ</span><button class="price-sort__btn"><i class="fa ${
                sorticon == "price-asc" ? "fa-chevron-up" : "fa-chevron-down"
              }"></i></button></div></th>
              <th>شماره پیگیری</th>
              <th><div class="date-sort"><span>تاریخ</span><button class="date-sort__btn"><i class="fa ${
                sorticon == "date-asc" ? "fa-chevron-up" : "fa-chevron-down"
              }"></i></button></div></th>
            </tr>`;
  if (transactions.length == 0)
    result += `<tr><td colspan="5" class="error">تراکنشی با شماره پیگیری مورد نظر، یافت نشد</td></tr>`;
  else {
    transactions.forEach((trans) => {
      result += `<tr>
                <td>${trans.id}</td>
                <td class=${
                  trans.type == "افزایش اعتبار" ? "success" : "error"
                }>${trans.type}</td>
                <td>${trans.price} ریال </td>
                <td>${trans.refId}</td>
                <td>${
                  new Date(trans.date).toLocaleTimeString("fa") +
                  " - " +
                  new Date(trans.date).toLocaleDateString("fa")
                }</td>
              </tr>`;
    });
  }

  result += "</table>";

  transactionsList.innerHTML = result;

  const priceSortBtn = document.querySelector(".price-sort__btn");
  priceSortBtn.addEventListener("click", (e) =>
    sendQuerystringToAPI(e, "price", searchInput.value)
  );

  const dateSortBtn = document.querySelector(".date-sort__btn");
  dateSortBtn.addEventListener("click", (e) =>
    sendQuerystringToAPI(e, "date", searchInput.value)
  );
}

function sendQuerystringToAPI(event, sortItem, searchQuery = "") {
  let sorticon = "";
  let queryString = "?";

  // Search Query

  if (searchQuery !== "") queryString += `refId_like=${searchQuery}`;

  // Sort Query

  if (sortItem !== "") {
    if (queryString != "?") queryString += "&";

    const sortOrder = event.target.classList.contains("fa-chevron-up")
      ? "desc"
      : "asc";

    sorticon = sortItem + "-" + sortOrder;
    queryString += `_sort=${sortItem}&_order=${sortOrder}`;
  }

  getTransactionsFromAPI(queryString, sorticon);
}

// GET API Methods

async function getTransactionsFromAPI(queryStrings, sorticon) {
  try {
    const { data } = await app.get(queryStrings);
    renderTransactionsData(data, sorticon);
  } catch (error) {
    console.log(error.message);
  }
}
