(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Highlight the current page in the menu
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("nav a").forEach(function (a) {
    var target = a.getAttribute("href").split("#")[0].toLowerCase();
    if (target === here) a.classList.add("active");
  });

  // Theme toggle (remembered when the browser allows it)
  try {
    var saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.textContent = open ? "\u2715" : "\u2630";
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("show"); });
  }

  // Scroll progress bar and back-to-top button
  var bar = document.getElementById("progress");
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar && h > 0) bar.style.width = (window.scrollY / h) * 100 + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  });
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Typing effect on the home page
  var typed = document.getElementById("typed");
  if (typed) {
    var words = ["research.", "write.", "draft.", "build websites.", "learn fast."];
    if (reduceMotion) {
      typed.textContent = words[0];
    } else {
      var w = 0, c = 0, deleting = false;
      (function tick() {
        var word = words[w];
        typed.textContent = word.slice(0, c);
        var delay = deleting ? 45 : 90;
        if (!deleting && c === word.length) { deleting = true; delay = 1400; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
        c += deleting ? -1 : 1;
        setTimeout(tick, delay);
      })();
    }
  }

  // Service filters
  var filters = document.querySelectorAll(".filter");
  var services = document.querySelectorAll(".service");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      services.forEach(function (card) {
        var show = cat === "all" || card.getAttribute("data-cat") === cat;
        card.classList.toggle("hide", !show);
      });
    });
  });

  // Contact form: opens WhatsApp with a ready-made message
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("cName").value.trim();
      var msg = document.getElementById("cMsg").value.trim();
      var text = "Hello Ajigo, my name is " + name + ". " + msg;
      window.open("https://wa.me/2349131201732?text=" + encodeURIComponent(text), "_blank");
    });
  }
})();
