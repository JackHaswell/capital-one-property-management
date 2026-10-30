/* =========================================================
   Capital One Property Management — interactions
   ========================================================= */
(function () {
  "use strict";

  var header = document.getElementById("header");
  var scrollbar = document.getElementById("scrollbar");
  var floatcta = document.querySelector(".floatcta");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (scrollbar) scrollbar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (floatcta) floatcta.classList.toggle("is-visible", y > 800);
    if (toTop) toTop.classList.toggle("is-visible", y > 800);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Animated stat counters ---- */
  var stats = document.querySelectorAll(".stat__num");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1500, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && stats.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); so.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { so.observe(el); });
  }

  /* ---- Scrollspy ---- */
  var ids = ["services", "how", "why", "areas", "protection", "contact"];
  var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navLinks = nav ? nav.querySelectorAll(".nav__link") : [];
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            var href = l.getAttribute("href");
            if (href && href.charAt(0) === "#") l.classList.toggle("is-active", href === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.nextElementSibling;
      var open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq__q").forEach(function (other) {
        if (other !== btn) { other.setAttribute("aria-expanded", "false"); other.nextElementSibling.style.maxHeight = null; }
      });
      btn.setAttribute("aria-expanded", String(!open));
      panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
    });
  });

  /* ---- Interactive "areas we cover" ---- */
  var areaChips = document.getElementById("areaChips");
  var areaTitle = document.getElementById("areaTitle");
  if (areaChips && areaTitle) {
    areaChips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      areaChips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      areaTitle.style.opacity = "0";
      setTimeout(function () {
        areaTitle.textContent = "Yes — we cover " + btn.getAttribute("data-area");
        areaTitle.style.opacity = "1";
      }, 160);
    });
  }

  /* ---- Testimonial slider ---- */
  var track = document.getElementById("sliderTrack");
  var dotsWrap = document.getElementById("sliderDots");
  if (track && dotsWrap) {
    var slides = track.children.length;
    var index = 0, timer = null;
    for (var i = 0; i < slides; i++) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      dot.addEventListener("click", (function (n) { return function () { go(n); restart(); }; })(i));
      dotsWrap.appendChild(dot);
    }
    var dots = dotsWrap.children;
    function go(n) {
      index = (n + slides) % slides;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      for (var j = 0; j < dots.length; j++) dots[j].classList.toggle("is-active", j === index);
    }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { go(index + 1); }, 6000); }
    var prev = document.getElementById("prevBtn");
    var next = document.getElementById("nextBtn");
    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });
    var slider = document.getElementById("slider");
    if (slider) {
      slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
      slider.addEventListener("mouseleave", restart);
    }
    go(0); restart();
  }

  /* ---- Form handling ---- */
  // Contact / valuation / review forms POST to FormSubmit (emails info@…). The tenant/landlord
  // enquiry forms ALSO insert into Supabase for the matcher — see handleEnquiry() below.
  var FALLBACK_EMAIL = "info@capitalonepropertymanagement.co.uk";

  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field-check") || input.closest(".field");
      var valid;
      if (input.type === "checkbox") {
        valid = input.checked;
      } else if (input.type === "radio") {
        valid = !!form.querySelector('input[name="' + input.name + '"]:checked');
      } else {
        valid = input.value.trim() !== "" &&
          (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      }
      if (field) field.classList.toggle("has-error", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  function handleSubmit(form, statusEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) {
        if (statusEl) { statusEl.textContent = "Please fill in the highlighted fields."; statusEl.className = "quickform__note is-err"; }
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      var subjects = {
        quickform: "New rental valuation request — website",
        reviewForm: "New review submitted — website",
        registerForm: "New tenant enquiry — website"
      };
      var payload = {
        _subject: subjects[form.id] || "New website enquiry — Capital One PM",
        _template: "table",
        _captcha: "false"
      };
      new FormData(form).forEach(function (v, k) { if (k !== "form-name" && k !== "bot-field") payload[k] = v; });
      fetch("https://formsubmit.co/ajax/info@capitalonepropertymanagement.co.uk", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && (res.success === true || res.success === "true")) {
            form.reset();
            var okMsg = form.getAttribute("data-ok") || "Thank you — we've got your details and will be in touch within one working day.";
            if (statusEl) { statusEl.textContent = okMsg; statusEl.className = "quickform__note is-ok"; }
            if (btn) { btn.textContent = form.getAttribute("data-sent") || "✓ Enquiry sent"; }
          } else {
            throw new Error(res && res.message ? res.message : "submit failed");
          }
        })
        .catch(function () {
          if (statusEl) { statusEl.innerHTML = "Sorry, something went wrong — please email <a href='mailto:" + FALLBACK_EMAIL + "'>" + FALLBACK_EMAIL + "</a> or call 07516 706220."; statusEl.className = "quickform__note is-err"; }
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () { var f = input.closest(".field"); if (f) f.classList.remove("has-error"); });
    });
  }
  var contactForm = document.getElementById("contactForm");
  if (contactForm) handleSubmit(contactForm, document.getElementById("formStatus"));
  var quickform = document.getElementById("quickform");
  if (quickform) handleSubmit(quickform, null);
  var reviewForm = document.getElementById("reviewForm");
  if (reviewForm) handleSubmit(reviewForm, document.getElementById("formStatus"));
  var registerForm = document.getElementById("registerForm");
  if (registerForm) handleSubmit(registerForm, document.getElementById("formStatus"));

  /* ---- Enquiry forms → Supabase (tenant + landlord), with email alert ---- */
  var SB_URL = "https://rltvbicxockrvoufxwnx.supabase.co";
  var SB_KEY = "sb_publishable_gOqJq7edrRehKCDAf9x2lw_WuNzSC2O";

  function sbHeaders(extra) {
    var h = { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  function setNote(el, msg, cls, html) {
    if (!el) return;
    if (html) el.innerHTML = msg; else el.textContent = msg;
    el.className = "quickform__note " + cls;
  }

  function uploadPhotos(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files.length) return Promise.resolve([]);
    var files = Array.prototype.slice.call(fileInput.files).slice(0, 10);
    var prefix = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    return Promise.all(files.map(function (f, i) {
      var safe = (f.name || ("photo" + i)).replace(/[^a-zA-Z0-9._-]/g, "_");
      var path = prefix + "/" + i + "-" + safe;
      return fetch(SB_URL + "/storage/v1/object/landlord-photos/" + path, {
        method: "POST",
        headers: sbHeaders({ "Content-Type": f.type || "application/octet-stream" }),
        body: f
      }).then(function (r) { return r.ok ? path : null; }).catch(function () { return null; });
    })).then(function (arr) { return arr.filter(Boolean); });
  }

  function buildRow(form) {
    var row = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "_honey" || k === "consent" || k === "photos" || k.indexOf("room_rent_") === 0) return;
      if (typeof v === "string" && v.trim() !== "") row[k] = v.trim();
    });
    var consent = form.querySelector('input[name="consent"]');
    row.consent = !!(consent && consent.checked);
    if (row.rooms_count) { var n = parseInt(row.rooms_count, 10); row.rooms_count = isNaN(n) ? null : n; }
    var rents = [];
    form.querySelectorAll('input[name^="room_rent_"]').forEach(function (inp) {
      if (inp.value.trim() !== "") rents.push(inp.value.trim());
    });
    if (rents.length) row.room_rents = rents;
    return row;
  }

  function emailAlert(form, table) {
    var payload = {
      _subject: table === "landlord_enquiries" ? "New landlord enquiry — website" : "New tenant enquiry — website",
      _template: "table", _captcha: "false"
    };
    new FormData(form).forEach(function (v, k) { if (typeof v === "string" && k !== "consent") payload[k] = v; });
    var consent = form.querySelector('input[name="consent"]');
    payload.consent = consent && consent.checked ? "Yes" : "No";
    fetch("https://formsubmit.co/ajax/" + FALLBACK_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).catch(function () {});
  }

  function handleEnquiry(form, statusEl, table) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) { form.reset(); setNote(statusEl, form.getAttribute("data-ok") || "Thank you.", "is-ok"); return; }
      if (!validate(form)) { setNote(statusEl, "Please fill in the highlighted fields.", "is-err"); return; }
      var btn = form.querySelector("button[type=submit]");
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      uploadPhotos(form.querySelector('input[type="file"]')).then(function (photos) {
        var row = buildRow(form);
        if (photos.length) row.photos = photos;
        return fetch(SB_URL + "/rest/v1/" + table, {
          method: "POST",
          headers: sbHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
          body: JSON.stringify(row)
        });
      }).then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error(t || "db error"); });
        emailAlert(form, table);
        form.reset();
        if (form._resetRents) form._resetRents();
        setNote(statusEl, form.getAttribute("data-ok") || "Thank you — we've got your details and will be in touch within one working day.", "is-ok");
        if (btn) btn.textContent = form.getAttribute("data-sent") || "✓ Sent";
      }).catch(function () {
        setNote(statusEl, "Sorry, something went wrong — please email <a href='mailto:" + FALLBACK_EMAIL + "'>" + FALLBACK_EMAIL + "</a> or call 07516 706220.", "is-err", true);
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () { var f = input.closest(".field-check") || input.closest(".field"); if (f) f.classList.remove("has-error"); });
    });
  }

  function setupRoomRents(form) {
    var sel = form.querySelector('select[name="rooms_count"]');
    var container = document.getElementById("roomRents");
    if (!sel || !container) return;
    function render() {
      var n = sel.value === "6+" ? 6 : (parseInt(sel.value, 10) || 0);
      container.innerHTML = "";
      if (n <= 0) return;
      var wrap = document.createElement("div"); wrap.className = "field";
      var lg = document.createElement("div"); lg.className = "field__legend"; lg.textContent = "Rent per room (current or desired)";
      wrap.appendChild(lg);
      var grid = document.createElement("div"); grid.className = "rent-grid";
      for (var i = 1; i <= n; i++) {
        var cell = document.createElement("div"); cell.className = "rent-cell";
        var lbl = document.createElement("label"); lbl.setAttribute("for", "rr-" + i); lbl.textContent = "Room " + i;
        var inp = document.createElement("input"); inp.type = "text"; inp.id = "rr-" + i; inp.name = "room_rent_" + i; inp.placeholder = "£ / month"; inp.setAttribute("inputmode", "numeric");
        cell.appendChild(lbl); cell.appendChild(inp); grid.appendChild(cell);
      }
      wrap.appendChild(grid); container.appendChild(wrap);
    }
    sel.addEventListener("change", render);
    form._resetRents = function () { container.innerHTML = ""; };
    render();
  }

  var tenantForm = document.getElementById("tenantForm");
  if (tenantForm) handleEnquiry(tenantForm, document.getElementById("formStatus"), "tenant_enquiries");
  var landlordForm = document.getElementById("landlordForm");
  if (landlordForm) { setupRoomRents(landlordForm); handleEnquiry(landlordForm, document.getElementById("formStatus"), "landlord_enquiries"); }

  /* ---- Review page: preselect landlord/tenant from ?type= ---- */
  if (reviewForm) {
    var rvParams = new URLSearchParams(window.location.search);
    var rvType = (rvParams.get("type") || "").toLowerCase();
    if (rvType === "landlord" || rvType === "tenant") {
      var rvVal = rvType === "landlord" ? "Landlord" : "Tenant";
      var rvRadio = reviewForm.querySelector('input[name="type"][value="' + rvVal + '"]');
      if (rvRadio) rvRadio.checked = true;
      var rvEyebrow = document.getElementById("rvEyebrow");
      var rvIntro = document.getElementById("rvIntro");
      if (rvEyebrow) rvEyebrow.textContent = rvType === "landlord" ? "For our landlords" : "For our tenants";
      if (rvIntro) rvIntro.textContent = rvType === "landlord"
        ? "Thank you for letting us look after your property. We'd love to hear how we're doing — your review goes straight to our team and, once we've approved it, appears on our website."
        : "Thank you for renting with us. We'd love to hear how we're doing — your review goes straight to our team and, once we've approved it, appears on our website.";
    }
  }

  /* ---- Tenants page: prefill 'property of interest' when enquiring ---- */
  document.querySelectorAll("[data-property]").forEach(function (el) {
    el.addEventListener("click", function () {
      var inp = document.getElementById("rg-property");
      if (inp) inp.value = el.getAttribute("data-property");
    });
  });

  /* ---- Gallery lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  if (lightbox && lightboxImg) {
    var closeLb = function () {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    };
    document.querySelectorAll(".gallery__item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lightboxImg.src = btn.getAttribute("data-full");
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    var lbClose = document.getElementById("lightboxClose");
    if (lbClose) lbClose.addEventListener("click", closeLb);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  }

  /* ---- Property photo lightbox (carousel) ---- */
  (function () {
    var lb = document.getElementById("lightbox");
    var lbImg = document.getElementById("lightboxImg");
    if (!lb || !lbImg) return;
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");
    var counter = document.getElementById("lightboxCounter");
    var set = [], idx = 0;
    function render() {
      lbImg.src = set[idx];
      if (counter) counter.textContent = (idx + 1) + " / " + set.length;
    }
    function openSet(arr, start) {
      set = arr; idx = start || 0;
      var multi = set.length > 1;
      if (prevBtn) prevBtn.hidden = !multi;
      if (nextBtn) nextBtn.hidden = !multi;
      if (counter) counter.hidden = !multi;
      render();
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
    }
    function step(d) { if (set.length) { idx = (idx + d + set.length) % set.length; render(); } }
    document.querySelectorAll("[data-gallery]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var imgs = (el.getAttribute("data-gallery") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        if (imgs.length) openSet(imgs, 0);
      });
    });
    if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open") || set.length < 2) return;
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  })();

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
