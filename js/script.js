"use strict";
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".left-items");
const hamburgerIcon = document.querySelector(".hamburger i");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

  if (hamburger.classList.contains("active")) {
    hamburgerIcon.classList.remove("bx-menu");
    hamburgerIcon.classList.add("bx-x");
  } else {
    hamburgerIcon.classList.remove("bx-x");
    hamburgerIcon.classList.add("bx-menu");
  }
});

let list = document.querySelector(".slider .list");
let items = document.querySelectorAll(".slider .list .item");
let dots = document.querySelectorAll(".slider .dots li");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let stopBtn = document.getElementById("stop");

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function () {
  if (active + 1 > lengthItems) {
    active = 0;
  } else {
    active = active + 1;
  }
  reloadSlider();
};

prev.onclick = function () {
  if (active - 1 < 0) {
    active = lengthItems;
  } else {
    active = active - 1;
  }
  reloadSlider();
};

let timeout = 5000;
let refreshSlider = setInterval(() => {
  next.click();
}, timeout);
let isRunning = true;

stopBtn.onclick = function () {
  if (isRunning) {
    clearInterval(refreshSlider);
    stopBtn.textContent = "▶";
  } else {
    refreshSlider = setInterval(() => next.click(), timeout);
    stopBtn.textContent = "||";
  }
  isRunning = !isRunning;
};

function reloadSlider() {
  let checkLeft = items[active].offsetLeft;
  list.style.left = -checkLeft + "px";

  let lastActiveDot = document.querySelector(".slider .dots li.active");
  lastActiveDot.classList.remove("active");
  dots[active].classList.add("active");

  if (isRunning) {
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => {
      next.click();
    }, timeout);
  }
}

dots.forEach((list, key) => {
  list.addEventListener("click", function () {
    active = key;
    reloadSlider();
  });
});

new Swiper(".card-wrapper", {
  loop: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 5,
    },
  },
});

document.querySelectorAll(".tab-container").forEach((container) => {
  const myTabs = container.querySelectorAll(".tab-btn");
  const all_content = container.querySelectorAll(".content");

  myTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      myTabs.forEach((tab) => tab.classList.remove("tab-active"));
      tab.classList.add("tab-active");

      all_content.forEach((content) =>
        content.classList.remove("content-active")
      );
      all_content[index].classList.add("content-active");
    });
  });
});

const toggleBtn = document.getElementById("theme-toggle");
const toggleIcon = toggleBtn.querySelector("i");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleIcon.classList.replace("bx-moon", "bx-sun");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggleIcon.classList.replace(
    isDark ? "bx-moon" : "bx-sun",
    isDark ? "bx-sun" : "bx-moon"
  );
});

let prevBTC, prevETH, prevDOGE, prevTRX;

async function updatePrice(id, symbol, prevPrice) {
  try {
    let res = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    let data = await res.json();
    let price = parseFloat(data.price).toFixed(6);
    let el = document.getElementById(id);

    if (prevPrice !== undefined) {
      if (price > prevPrice) {
        el.style.color = "green";
      } else if (price < prevPrice) {
        el.style.color = "red";
      }
      setTimeout(() => {
        el.style.color = "white";
      }, 2000);
    }

    el.innerText = `${symbol.replace("USDT", "")}/USDT: $${price}`;
    return price;
  } catch (e) {
    console.error(e);
  }
}

async function getBTC() {
  prevBTC = await updatePrice("BTC", "BTCUSDT", prevBTC);
}
async function getETH() {
  prevETH = await updatePrice("ETH", "ETHUSDT", prevETH);
}
async function getDoge() {
  prevDOGE = await updatePrice("DOGE", "DOGEUSDT", prevDOGE);
}
async function getTron() {
  prevTRX = await updatePrice("TRX", "TRXUSDT", prevTRX);
}

setInterval(getBTC, 5000);
getBTC();
setInterval(getETH, 5000);
getETH();
setInterval(getDoge, 5000);
getDoge();
setInterval(getTron, 5000);
getTron();
