import { records } from "./database";

const ticketsWrapperEl = document.querySelector(".tickets");
const submitEl = document.querySelector(".tickets__submit");
const ticketsUnsetWrapperEl = document.querySelector(".tickets__unset");
const reportEl = document.querySelector(".report");
const dateEl = document.querySelector(".date");
const receiptEl = document.querySelector(".receipt__wrapper");
const closeEl = document.querySelector(".receipt__close");

const TICKETS = [
  { id: 0, title: "آزاد", price: 40_000, count: 0 },
  { id: 1, title: "ایران خودرو", price: 35_000, count: 0 },
  { id: 2, title: "تخفیف 25%", price: 30_000, count: 0 },
  { id: 3, title: "نیم بها", price: 25_000, count: 0 },
  { id: 4, title: "کادر درمان", price: 20_000, count: 0 },
  { id: 5, title: "عضویت ویژه", price: 0, count: 1 },
  { id: 6, title: "آموزشی", price: 0, count: 1 },
  { id: 7, title: "ماساژ", price: 0, count: 1 },
];

const TODAY = new Date().toISOString().slice(0, 10);

window.onload = () => {
  records[TODAY]
    ? records[TODAY]
    : (records[TODAY] = [
        { id: 0, count: 0, total: 0 },
        { id: 1, count: 0, total: 0 },
        { id: 2, count: 0, total: 0 },
        { id: 3, count: 0, total: 0 },
        { id: 4, count: 0, total: 0 },
        { id: 5, count: 0, total: 0 },
        { id: 6, count: 0, total: 0 },
        { id: 7, count: 0, total: 0 },
      ]);
};

const generateTicket = (ticket) => {
  const html = `
    <li class="ticket" data-price=${ticket.price} data-id=${ticket.id} data-count=${ticket.count}>
      <p class="ticket__title">${ticket.title}</p>
      <div class="count__wrapper">
        <button class="operation count__increment">+</button>
        <p class="count">0</p>
        <button class="operation count__decrement">-</button>
      </div>
    </li>
  `;
  ticketsWrapperEl.insertAdjacentHTML("beforeend", html);
};

const generateTicketUnset = (ticket) => {
  const html = `
    <li class="ticket ticket__unset" data-price=${ticket.price} data-id=${ticket.id} data-count=${ticket.count}>
      <p class="ticket__title">${ticket.title}</p>
      <button class="ticket__submit">ثبت</button>
    </li>
  `;
  ticketsUnsetWrapperEl.insertAdjacentHTML("beforeend", html);
};

TICKETS.filter((ticket) => {
  if (ticket.price !== 0) {
    generateTicket(ticket);
  } else {
    generateTicketUnset(ticket);
  }
});

ticketsWrapperEl.addEventListener("click", (e) => {
  const ticketEl = e.target.closest(".ticket");
  const incrementEl = e.target.closest(".count__increment");
  const decrementEl = e.target.closest(".count__decrement");
  if (incrementEl) {
    ticketEl.dataset.count++;
    ticketEl.querySelector(".count").innerHTML = ticketEl.dataset.count;
  }
  if (decrementEl && ticketEl.dataset.count > 0) {
    ticketEl.dataset.count--;
    ticketEl.querySelector(".count").innerHTML = ticketEl.dataset.count;
  }
});

submitEl.addEventListener("click", () => {
  const ticketsEl = document.querySelectorAll(".ticket");
  ticketsEl.forEach((ticket) => {
    if (!ticket.classList.contains("ticket__unset")) {
      records[TODAY].find((record) => {
        if (record.id === Number(ticket.dataset.id)) {
          record.count += Number(ticket.dataset.count);
          record.total = record.count * Number(ticket.dataset.price);
        }
      });
      localStorage.setItem("records", JSON.stringify(records));
      ticket.dataset.count = 0;
      ticket.querySelector(".count").innerHTML = ticket.dataset.count;
    }
  });
});

ticketsUnsetWrapperEl.addEventListener("click", (e) => {
  const ticketUnsetEl = e.target.closest(".ticket__unset");
  const submitEl = e.target.closest(".ticket__submit");
  ticketUnsetEl.dataset.price = 0;
  if (submitEl) {
    const price = prompt("لطفا مبلغ مورد نظر خود را وارد کنید");
    if (price === null) return;
    ticketUnsetEl.dataset.price = price;
    records[TODAY].find((record) => {
      if (record.id === Number(ticketUnsetEl.dataset.id)) {
        record.count += Number(ticketUnsetEl.dataset.count);
        record.total = record.count * Number(ticketUnsetEl.dataset.price);
      }
    });
    localStorage.setItem("records", JSON.stringify(records));
  }
});

const generateHeader = () => {
  const html = `
    <li class="table-header">
      <div class="col">عنوان</div>
      <div class="col">تعداد</div>
      <div class="col">قیمت کل</div>
    </li>
  `;
  receiptEl.insertAdjacentHTML("afterbegin", html);
};

const generateReceipt = (report) => {
  const html = `
    <li class="table-row">
      <div class="col" data-label="عنوان">${TICKETS[report.id].title}</div>
      <div class="col" data-label="تعداد">${report.count}</div>
      <div class="col" data-label="کل">${new Intl.NumberFormat("en-US").format(
        report.total
      )}</div>
    </li>
  `;
  receiptEl.insertAdjacentHTML("beforeend", html);
};

const receiptDate = (date) => {
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const reducePrice = (record) => {
  const totalPrice = record.reduce(
    (previousValue, currentValue) => previousValue + currentValue.total,
    0
  );
  return `${new Intl.NumberFormat("en-US").format(totalPrice)} تومان`;
};

reportEl.addEventListener("click", () => {
  document.querySelector("main").classList.toggle("hidden");
  document.querySelector("aside").classList.toggle("hidden");
  document.querySelector("header").classList.add("hidden");
  document.querySelector(".receipt__date").innerHTML = receiptDate(
    dateEl.value
  );
  const report = records[dateEl.value];
  if (!report) {
    receiptEl.textContent = "برای تاریخ مورد نظر گزارشی ثبت نشده است.";
    document.querySelector(".receipt__total").classList.add("hidden");
    return;
  }
  receiptEl.textContent = "";
  generateHeader();
  document.querySelector(".receipt__total").classList.remove("hidden");
  document.querySelector(".receipt__price").textContent = reducePrice(report);
  report.map((item) => {
    if (item.count !== 0) {
      generateReceipt(item);
    }
  });
});

closeEl.addEventListener("click", () => {
  document.querySelector("main").classList.toggle("hidden");
  document.querySelector("aside").classList.toggle("hidden");
  document.querySelector("header").classList.remove("hidden");
});
