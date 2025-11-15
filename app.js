// Throttle function for performance
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// Global Page Loader System
// ============================================

let loaderProgressInterval = null;
let loaderProgress = 0;

// Show loader function (reusable)
function showLoader(resetProgress = true) {
  const pageLoader = document.getElementById("pageLoader");
  const body = document.body;
  const progressBar = pageLoader?.querySelector(".loader-progress-bar");

  if (!pageLoader) return;

  // Reset progress if needed
  if (resetProgress) {
    loaderProgress = 0;
    if (progressBar) {
      progressBar.style.width = "0%";
    }
  }

  // Show loader
  pageLoader.classList.remove("hidden");
  body.classList.add("loading");

  // Start progress animation
  if (progressBar && resetProgress) {
    clearInterval(loaderProgressInterval);
    loaderProgressInterval = setInterval(() => {
      loaderProgress += Math.random() * 15;
      if (loaderProgress > 90) loaderProgress = 90;
      progressBar.style.width = `${loaderProgress}%`;
    }, 100);
  }
}

// Hide loader function (reusable)
function hideLoader(completeProgress = true) {
  const pageLoader = document.getElementById("pageLoader");
  const body = document.body;
  const progressBar = pageLoader?.querySelector(".loader-progress-bar");

  if (!pageLoader) return;

  // Clear progress interval
  if (loaderProgressInterval) {
    clearInterval(loaderProgressInterval);
    loaderProgressInterval = null;
  }

  // Complete progress bar
  if (completeProgress && progressBar) {
    progressBar.style.width = "100%";
  }

  // Hide loader after short delay
  setTimeout(() => {
    pageLoader.classList.add("hidden");
    body.classList.remove("loading");
    loaderProgress = 0;
  }, 300);
}

// Page Loader - Initial Load
function initPageLoader() {
  const pageLoader = document.getElementById("pageLoader");
  if (!pageLoader) return;

  // Show loader initially
  showLoader(true);

  // Hide loader when page is fully loaded
  window.addEventListener("load", function () {
    hideLoader(true);
  });

  // Fallback: hide loader after max 3 seconds
  setTimeout(() => {
    if (document.body.classList.contains("loading")) {
      hideLoader(true);
    }
  }, 3000);
}

// Initialize loader immediately
initPageLoader();

// Consolidated DOMContentLoaded handler for better performance
document.addEventListener("DOMContentLoaded", function () {
  // Set current year in footer
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Check for slow image loading
  const images = document.querySelectorAll("img");
  let imagesLoaded = 0;
  let totalImages = images.length;

  if (totalImages > 0) {
    // Show loader if images are taking too long
    const imageLoadTimeout = setTimeout(() => {
      if (imagesLoaded < totalImages) {
        showLoader(false);
      }
    }, 500);

    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
      } else {
        img.addEventListener("load", () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            clearTimeout(imageLoadTimeout);
            if (
              document.body.classList.contains("loading") &&
              !window.loadComplete
            ) {
              hideLoader(false);
            }
          }
        });
        img.addEventListener("error", () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            clearTimeout(imageLoadTimeout);
            if (
              document.body.classList.contains("loading") &&
              !window.loadComplete
            ) {
              hideLoader(false);
            }
          }
        });
      }
    });

    // If all images already loaded
    if (imagesLoaded === totalImages) {
      clearTimeout(imageLoadTimeout);
    }
  }

  // Skill rows master (in hero section) - reveal immediately, no delay
  document.querySelectorAll(".skill-row-master").forEach((el) => {
    el.classList.add("revealed");
  });

  // Batch observe all other elements for better performance
  const elementsToObserve = [
    ...document.querySelectorAll(".section-title, .section-subtitle"),
    ...document.querySelectorAll(".mission-card"),
    ...document.querySelectorAll(".skill-card"),
    ...document.querySelectorAll(".pricing-card"),
  ];

  // Remove transition delays for instant appearance
  elementsToObserve.forEach((el) => {
    revealObserver.observe(el);
  });

  // Defer non-critical initialization
  requestAnimationFrame(() => {
    // Disabled for performance: initPricingCardGlow();
    initCTAStrategy();
    // Disabled for performance: initFloatingBackground();
    initRegistrationModal();
    initFormValidation();
  });
});

// Mark page as fully loaded
window.addEventListener("load", function () {
  window.loadComplete = true;
});

// Floating Background Elements - DISABLED for performance
function initFloatingBackground() {
  // Completely disabled for maximum performance
  return;
}

function createFloatingElement(type, animations, container, shapeTypes = null) {
  const element = document.createElement("div");
  element.className = `floating-element floating-${type}`;

  // Random position
  const left = Math.random() * 100;
  const top = Math.random() * 100;

  // Random animation
  const animation = animations[Math.floor(Math.random() * animations.length)];
  element.setAttribute("data-animation", animation);

  // Random delay
  const delay = Math.random() * 5;
  element.style.animationDelay = `${delay}s`;

  // Random duration variation
  const duration = 8 + Math.random() * 7;
  element.style.animationDuration = `${duration}s`;

  // Position element
  element.style.left = `${left}%`;
  element.style.top = `${top}%`;

  // Random scale
  const scale = 0.8 + Math.random() * 0.5;
  element.style.transform = `scale(${scale})`;

  // Add specific styling based on type
  if (type === "particle") {
    if (Math.random() > 0.7) {
      element.classList.add("large");
    }
    const opacity = 0.3 + Math.random() * 0.4;
    element.style.opacity = opacity;
  } else if (type === "shape" && shapeTypes) {
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    element.classList.add(shapeType);
    const opacity = 0.05 + Math.random() * 0.1;
    element.style.opacity = opacity;
  }

  container.appendChild(element);
}

function createFloatingLogo(animations, container, index) {
  const element = document.createElement("div");
  element.className = "floating-element floating-logo";

  // Add variation classes based on index
  const variations = [
    "logo-small",
    "logo-medium",
    "logo-large",
    "logo-rotated",
    "logo-blurred",
  ];
  const variation = variations[index % variations.length];
  element.classList.add(variation);

  // Create logo image
  const logoImg = document.createElement("img");
  logoImg.src = "assets/logo.png";
  logoImg.alt = "";
  logoImg.style.width = "100%";
  logoImg.style.height = "100%";
  logoImg.style.objectFit = "contain";
  element.appendChild(logoImg);

  // Random position
  const left = Math.random() * 100;
  const top = Math.random() * 100;

  // Random animation (use 'logo' animation for logos)
  const animation = animations[Math.floor(Math.random() * animations.length)];
  element.setAttribute("data-animation", animation);

  // Random delay
  const delay = Math.random() * 5;
  element.style.animationDelay = `${delay}s`;

  // Random duration variation (slower for logos)
  const duration = 15 + Math.random() * 10;
  element.style.animationDuration = `${duration}s`;

  // Position element
  element.style.left = `${left}%`;
  element.style.top = `${top}%`;

  // Varied scale based on variation type
  let scale;
  if (variation === "logo-small") {
    scale = 0.12 + Math.random() * 0.08;
  } else if (variation === "logo-medium") {
    scale = 0.18 + Math.random() * 0.1;
  } else if (variation === "logo-large") {
    scale = 0.25 + Math.random() * 0.1;
  } else {
    scale = 0.15 + Math.random() * 0.15;
  }
  const baseTransform = `scale(${scale})`;

  // Random rotation (only if not using logo animation)
  if (animation !== "logo" && variation !== "logo-rotated") {
    const rotation = Math.random() * 360;
    element.style.transform = `${baseTransform} rotate(${rotation}deg)`;
  } else if (variation === "logo-rotated") {
    const rotation = 15 + Math.random() * 30; // Subtle rotation
    element.style.transform = `${baseTransform} rotate(${rotation}deg)`;
  } else {
    element.style.transform = baseTransform;
  }

  // Varied opacity based on variation
  let opacity;
  if (variation === "logo-blurred") {
    opacity = 0.02 + Math.random() * 0.03;
  } else {
    opacity = 0.04 + Math.random() * 0.04;
  }
  element.style.opacity = opacity;

  container.appendChild(element);
}

// Parallax effect removed for better performance

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navLinks = document.getElementById("navLinks");

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener("click", function () {
    mobileMenuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close menu when clicking on a link
  const navLinkItems = navLinks.querySelectorAll("a");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !mobileMenuToggle.contains(event.target) &&
      !navLinks.contains(event.target)
    ) {
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// Navbar scroll effect (throttled)
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener(
  "scroll",
  throttle(function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  }, 50)
);

// Scroll Reveal Animation - SIMPLIFIED for performance
// Instant reveal instead of scroll-based animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.01, // Reduced threshold for faster reveal
    rootMargin: "100px 0px", // Larger margin for earlier reveal
  }
);

// Smooth scroll for anchor links with loader
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Skip if it's a registration modal trigger
    if (this.classList.contains("open-registration-modal")) {
      return; // Let the modal handler take over
    }

    if (href === "#" || href === "#contact") {
      return; // Allow default behavior for # or #contact
    }

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Show loader for navigation
      showLoader(false); // Don't reset progress for quick navigation

      const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // Hide loader after scroll completes
      setTimeout(() => {
        hideLoader(false);
      }, 800);
    }
  });
});

// Toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Back to Top Button
const backToTopButton = document.getElementById("backToTop");
if (backToTopButton) {
  // Show/hide button based on scroll position
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }

  // Scroll to top when clicked with loader
  backToTopButton.addEventListener("click", function () {
    showLoader(false); // Show loader for scroll
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Hide loader after scroll completes
    setTimeout(() => {
      hideLoader(false);
    }, 800);
  });

  // Listen for scroll events (throttled)
  window.addEventListener("scroll", throttle(toggleBackToTop, 100));

  // Initial check
  toggleBackToTop();
}

// Cursor Glow Effect for Pricing Cards (throttled for performance)
function initPricingCardGlow() {
  const pricingCards = document.querySelectorAll(
    ".pricing-card:not(.pricing-card-disabled), .pricing-card-original"
  );

  pricingCards.forEach((card) => {
    const handleMouseMove = throttle(function (e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--cursor-x", `${x}%`);
      card.style.setProperty("--cursor-y", `${y}%`);
    }, 50); // Throttle to 50ms

    card.addEventListener("mousemove", handleMouseMove);

    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--cursor-x", "50%");
      card.style.setProperty("--cursor-y", "50%");
    });
  });
}

// Initialization moved to consolidated DOMContentLoaded handler above

// Enhanced CTA Strategy
function initCTAStrategy() {
  // Initialize all CTA components
  initStickyCTABar();
  initScrollCTAs();
  matchHeroButtonWidths();
}

// Match secondary button width to primary button width
function matchHeroButtonWidths() {
  const primaryBtn = document.querySelector(".hero-cta .btn-primary");
  const secondaryBtn = document.querySelector(".hero-cta .btn-secondary");

  if (primaryBtn && secondaryBtn) {
    function updateWidth() {
      const primaryWidth = primaryBtn.offsetWidth;
      if (primaryWidth > 0) {
        secondaryBtn.style.width = `${primaryWidth}px`;
      }
    }

    // Update on load
    updateWidth();

    // Update on resize (throttled)
    window.addEventListener("resize", throttle(updateWidth, 100));

    // Update after a short delay to ensure layout is complete
    setTimeout(updateWidth, 100);
  }
}

// Sticky CTA Bar (throttled)
function initStickyCTABar() {
  const stickyBar = document.getElementById("stickyCtaBar");
  const closeBtn = document.getElementById("stickyCtaClose");
  const registerBtn = document.getElementById("stickyRegisterBtn");

  if (!stickyBar) return;

  // Show sticky bar after scrolling down (throttled)
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    throttle(function () {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Show after scrolling down 300px, hide when scrolling up
      if (scrollTop > 300 && scrollTop > lastScrollTop) {
        stickyBar.classList.add("visible");
        document.body.classList.add("sticky-bar-visible");
      } else if (scrollTop < lastScrollTop) {
        stickyBar.classList.remove("visible");
        document.body.classList.remove("sticky-bar-visible");
      }

      lastScrollTop = scrollTop;
    }, 100)
  );

  // Check initial state
  if (stickyBar.classList.contains("visible")) {
    document.body.classList.add("sticky-bar-visible");
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      stickyBar.classList.remove("visible");
      document.body.classList.remove("sticky-bar-visible");
      // Remember user preference for this session
      sessionStorage.setItem("stickyCtaClosed", "true");
    });
  }

  // Check if user closed it in this session
  if (sessionStorage.getItem("stickyCtaClosed") === "true") {
    stickyBar.classList.remove("visible");
    document.body.classList.remove("sticky-bar-visible");
  }
}

// Scroll-triggered CTAs
function initScrollCTAs() {
  const scrollCTAs = document.querySelectorAll(".scroll-cta");

  if (scrollCTAs.length === 0) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.1 }
  );

  scrollCTAs.forEach((cta) => {
    observer.observe(cta);
  });
}

// ============================================
// Registration Form Modal & Google Forms Integration
// ============================================

// TODO: Replace this URL with your actual Google Form formResponse URL
// To get the URL:
// 1. Open your Google Form
// 2. View the page source (Ctrl+U or Cmd+Option+U)
// 3. Search for "formResponse" in the source
// 4. Copy the full URL that looks like: https://docs.google.com/forms/d/e/FORM_ID/formResponse
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";

// TODO: Map form field names to Google Form entry IDs
// To find entry IDs:
// 1. Open your Google Form
// 2. View the page source (Ctrl+U or Cmd+Option+U)
// 3. Search for the field name or label
// 4. Look for "entry.XXXXXXXXX" near that field
// 5. Copy the entry ID (e.g., "entry.123456789")
const FORM_FIELD_MAPPING = {
  fullName: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "الاسم الكامل"
  email: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "البريد الإلكتروني"
  phone: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "رقم الهاتف"
  age: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "العمر" (if exists)
  location: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "المدينة / الدولة" (if exists)
  currentStatus: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "حالتك الحالية"
  hearAbout: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "كيف سمعت عن ميراكِ أكاديمي؟" (if exists)
  notes: "entry.XXXXXXXXX", // TODO: Replace with actual entry ID for "ملاحظات أو هدفك من المعسكر" (if exists)
};

// Registration Modal Management
let lastFocusedElement = null;

function initRegistrationModal() {
  const modal = document.getElementById("registrationModal");
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("registrationForm");
  const openModalLinks = document.querySelectorAll(".open-registration-modal");

  if (!modal || !form) return;

  // Open modal function
  function openModal(triggerElement) {
    lastFocusedElement = triggerElement;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Focus on first input
    const firstInput = form.querySelector("input, select, textarea");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  // Close modal function
  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    // Reset form state
    resetFormState();

    // Return focus to trigger element
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  // Open modal on link click
  openModalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(this);
    });
  });

  // Close modal on backdrop click
  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  // Close modal on close button click
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close modal on Esc key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Handle form submission
  form.addEventListener("submit", handleFormSubmit);
}

// Form Validation
function validateForm(formData) {
  const errors = {};

  // Full Name validation
  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = "الرجاء إدخال الاسم الكامل";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "الرجاء إدخال بريد إلكتروني صحيح";
  }

  // Phone validation (basic: at least 7 digits)
  const phoneDigits = formData.phone ? formData.phone.replace(/\D/g, "") : "";
  if (!formData.phone || phoneDigits.length < 7) {
    errors.phone = "الرجاء إدخال رقم هاتف صحيح";
  }

  // Current Status validation
  if (!formData.currentStatus) {
    errors.currentStatus = "الرجاء اختيار حالتك الحالية";
  }

  return errors;
}

// Show field error
function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(fieldName + "Error");
  const formGroup = field?.closest(".form-group");

  if (field && formGroup) {
    formGroup.classList.add("error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }
}

// Clear field error
function clearFieldError(fieldName) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(fieldName + "Error");
  const formGroup = field?.closest(".form-group");

  if (field && formGroup) {
    formGroup.classList.remove("error");
    if (errorElement) {
      errorElement.classList.remove("show");
      errorElement.textContent = "";
    }
  }
}

// Clear all errors
function clearAllErrors() {
  Object.keys(FORM_FIELD_MAPPING).forEach((fieldName) => {
    clearFieldError(fieldName);
  });
}

// Reset form state
function resetFormState() {
  const form = document.getElementById("registrationForm");
  const successDiv = document.getElementById("formSuccess");
  const errorDiv = document.getElementById("formError");
  const submitBtn = document.getElementById("submitBtn");

  if (form) {
    form.reset();
  }
  if (successDiv) {
    successDiv.style.display = "none";
  }
  if (errorDiv) {
    errorDiv.style.display = "none";
  }
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
  clearAllErrors();
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = document.getElementById("submitBtn");
  const successDiv = document.getElementById("formSuccess");
  const errorDiv = document.getElementById("formError");

  // Clear previous errors
  clearAllErrors();
  if (successDiv) successDiv.style.display = "none";
  if (errorDiv) errorDiv.style.display = "none";

  // Collect form data
  const formData = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    age: form.age?.value.trim() || "",
    location: form.location?.value.trim() || "",
    currentStatus: form.currentStatus.value,
    hearAbout: form.hearAbout?.value || "",
    notes: form.notes?.value.trim() || "",
  };

  // Validate form
  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    // Show errors
    Object.keys(errors).forEach((fieldName) => {
      showFieldError(fieldName, errors[fieldName]);
    });
    return;
  }

  // Disable submit button and show page loader
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
  }

  // Show page loader during form submission
  showLoader(true);

  // Prepare data for Google Forms
  const googleFormData = new URLSearchParams();

  // Map form fields to Google Form entry IDs
  if (FORM_FIELD_MAPPING.fullName && formData.fullName) {
    googleFormData.append(FORM_FIELD_MAPPING.fullName, formData.fullName);
  }
  if (FORM_FIELD_MAPPING.email && formData.email) {
    googleFormData.append(FORM_FIELD_MAPPING.email, formData.email);
  }
  if (FORM_FIELD_MAPPING.phone && formData.phone) {
    googleFormData.append(FORM_FIELD_MAPPING.phone, formData.phone);
  }
  if (FORM_FIELD_MAPPING.age && formData.age) {
    googleFormData.append(FORM_FIELD_MAPPING.age, formData.age);
  }
  if (FORM_FIELD_MAPPING.location && formData.location) {
    googleFormData.append(FORM_FIELD_MAPPING.location, formData.location);
  }
  if (FORM_FIELD_MAPPING.currentStatus && formData.currentStatus) {
    googleFormData.append(
      FORM_FIELD_MAPPING.currentStatus,
      formData.currentStatus
    );
  }
  if (FORM_FIELD_MAPPING.hearAbout && formData.hearAbout) {
    googleFormData.append(FORM_FIELD_MAPPING.hearAbout, formData.hearAbout);
  }
  if (FORM_FIELD_MAPPING.notes && formData.notes) {
    googleFormData.append(FORM_FIELD_MAPPING.notes, formData.notes);
  }

  try {
    // Submit to Google Forms
    const response = await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      mode: "no-cors", // Required for Google Forms (CORS limitation)
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: googleFormData.toString(),
    });

    // With no-cors mode, we can't read the response
    // Assume success if no error was thrown
    hideLoader(true); // Hide page loader on success

    if (successDiv) {
      successDiv.style.display = "block";
      form.style.display = "none";
    }

    // Reset form after 3 seconds
    setTimeout(() => {
      resetFormState();
      form.style.display = "block";
      const modal = document.getElementById("registrationModal");
      if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
      }
    }, 3000);
  } catch (error) {
    // Hide loader on error
    hideLoader(true);

    // Show error message
    if (errorDiv) {
      errorDiv.style.display = "block";
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  }
}

// Real-time validation on input
function initFormValidation() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  // Clear errors on input
  form.addEventListener("input", function (e) {
    if (e.target.id) {
      clearFieldError(e.target.id);
    }
  });

  // Clear errors on select change
  form.addEventListener("change", function (e) {
    if (e.target.id) {
      clearFieldError(e.target.id);
    }
  });
}

// Registration modal initialization is called from main DOMContentLoaded handler above
