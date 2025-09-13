// DOM Elements
const preloader = document.getElementById("preloader")
const header = document.getElementById("header")
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const navClose = document.getElementById("nav-close")
const navLinks = document.querySelectorAll(".nav__link")
const themeToggle = document.getElementById("theme-toggle")
const backToTop = document.getElementById("back-to-top")
const contactForm = document.getElementById("contact-form")
const typingText = document.getElementById("typing-text")

// Initialize everything when DOM is loaded - MOVED TO TOP
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing portfolio...")

  // Initialize typing animation
  setTimeout(typeWriter, 1000)

  // Initialize theme
  initTheme()

  // Initialize observers
  initializeObservers()

  console.log("Portfolio initialized successfully! 🎉")
})

// Typing Animation
const texts = ["Full Stack Developer", "React Specialist", "UI/UX Designer", "Problem Solver", "Tech Enthusiast"]

let textIndex = 0
let charIndex = 0
let isDeleting = false
let typingSpeed = 100

function typeWriter() {
  const currentText = texts[textIndex]

  if (isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex - 1)
    charIndex--
    typingSpeed = 50
  } else {
    typingText.textContent = currentText.substring(0, charIndex + 1)
    charIndex++
    typingSpeed = 100
  }

  if (!isDeleting && charIndex === currentText.length) {
    typingSpeed = 2000
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    textIndex = (textIndex + 1) % texts.length
    typingSpeed = 500
  }

  setTimeout(typeWriter, typingSpeed)
}

// Preloader - Fixed version
window.addEventListener("load", () => {
  // Hide preloader after a short delay
  setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = "0"
      preloader.style.visibility = "hidden"
      // Remove from DOM after transition
      setTimeout(() => {
        preloader.style.display = "none"
      }, 500)
    }
  }, 1000) // Reduced from 1500 to 1000ms
})

// Fallback: Hide preloader after 3 seconds regardless
setTimeout(() => {
  if (preloader) {
    preloader.style.opacity = "0"
    preloader.style.visibility = "hidden"
    preloader.style.display = "none"
  }
}, 3000)

// Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.add("active")
  navToggle.classList.add("active")
  document.body.style.overflow = "hidden"
})

navClose.addEventListener("click", () => {
  navMenu.classList.remove("active")
  navToggle.classList.remove("active")
  document.body.style.overflow = ""
})

// Close nav when clicking on links
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
    document.body.style.overflow = ""
  })
})

// Header Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Active Navigation Link
const sections = document.querySelectorAll("section[id]")

function updateActiveNav() {
  const scrollY = window.pageYOffset

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight
    const sectionTop = section.offsetTop - 200
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`)

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add("active")
    } else {
      navLink?.classList.remove("active")
    }
  })
}

window.addEventListener("scroll", updateActiveNav)

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector(".theme-toggle__icon")
  icon.textContent = theme === "light" ? "🌙" : "☀️"
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "light" ? "dark" : "light"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
})

// Back to Top Button
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.add("visible")
  } else {
    backToTop.classList.remove("visible")
  }
})

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

function initializeObservers() {
  const animateElements = document.querySelectorAll(".timeline__item, .skills__category, .skill, .tool, .project")
  animateElements.forEach((el) => observer.observe(el))

  // Stats observer
  const statsSection = document.querySelector(".about__stats")
  if (statsSection) {
    statsObserver.observe(statsSection)
  }

  // Skills observer
  const skillsSection = document.querySelector(".skills")
  if (skillsSection) {
    skillsObserver.observe(skillsSection)
  }

  // Stagger observer for skills categories
  document.querySelectorAll(".skills__category").forEach((category) => {
    staggerObserver.observe(category)
  })
}

// Counter Animation for Stats
function animateCounters() {
  const counters = document.querySelectorAll(".about__stat-number")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.ceil(current)
        setTimeout(updateCounter, 20)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  })
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters()
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillBars = entry.target.querySelectorAll(".skill__progress")

        skillBars.forEach((bar, index) => {
          const width = bar.getAttribute("data-width")
          setTimeout(() => {
            bar.style.width = width + "%"
          }, index * 200)
        })

        skillsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.3 },
)

// Staggered Animation for Skills and Tools
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(".skill, .tool")

        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("animate")
          }, index * 100)
        })

        staggerObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.2 },
)

// Project Filtering
const filterButtons = document.querySelectorAll(".filter-btn")
const projects = document.querySelectorAll(".project")

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter")

    // Update active button
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Filter projects
    projects.forEach((project) => {
      const categories = project.getAttribute("data-category").split(" ")

      if (filter === "all" || categories.includes(filter)) {
        project.classList.remove("hidden")
        setTimeout(() => {
          project.classList.add("animate")
        }, 100)
      } else {
        project.classList.add("hidden")
        project.classList.remove("animate")
      }
    })
  })
})

// Contact Form Validation and Submission
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Clear previous errors
    clearErrors()

    // Get form data
    const formData = new FormData(contactForm)
    const data = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      subject: formData.get("subject").trim(),
      message: formData.get("message").trim(),
    }

    // Validate form
    let isValid = true

    if (data.name.length < 2) {
      showError("name-error", "Name must be at least 2 characters long")
      isValid = false
    }

    if (!isValidEmail(data.email)) {
      showError("email-error", "Please enter a valid email address")
      isValid = false
    }

    if (data.subject.length < 5) {
      showError("subject-error", "Subject must be at least 5 characters long")
      isValid = false
    }

    if (data.message.length < 10) {
      showError("message-error", "Message must be at least 10 characters long")
      isValid = false
    }

    if (isValid) {
      await submitForm(data)
    }
  })
}

function clearErrors() {
  document.querySelectorAll(".form__error").forEach((error) => {
    error.textContent = ""
  })
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function submitForm(data) {
  const submitButton = contactForm.querySelector('button[type="submit"]')
  const buttonText = submitButton.querySelector(".btn__text")
  const buttonLoader = submitButton.querySelector(".btn__loader")
  const buttonSuccess = submitButton.querySelector(".btn__success")
  const successMessage = document.getElementById("form-success")

  // Show loading state
  submitButton.classList.add("loading")
  submitButton.disabled = true

  try {
    // Simulate API call (replace with actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Show success state
    submitButton.classList.remove("loading")
    submitButton.classList.add("success")

    // Show success message
    successMessage.classList.add("show")

    // Reset form
    contactForm.reset()

    // Reset button after 3 seconds
    setTimeout(() => {
      submitButton.classList.remove("success")
      submitButton.disabled = false
      successMessage.classList.remove("show")
    }, 3000)
  } catch (error) {
    // Show error state
    submitButton.classList.remove("loading")
    submitButton.disabled = false
    showError("message-error", "Failed to send message. Please try again.")
  }
}

// Parallax Effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".hero__bg-shape")

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.2
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px)`
  })
})

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu
  if (e.key === "Escape") {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Ctrl + Home goes to top
  if (e.ctrlKey && e.key === "Home") {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
})

// Performance Optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
  updateActiveNav()
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)

// Image Loading Optimization
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("load", () => {
    img.style.opacity = "1"
  })

  img.addEventListener("error", () => {
    img.src = "/placeholder.svg?height=400&width=400"
    img.alt = "Image not available"
  })

  // Set initial opacity for fade-in effect
  img.style.opacity = "0"
  img.style.transition = "opacity 0.3s ease"
})

// Console Welcome Message
console.log(`
🚀 Portfolio Website Loaded Successfully!
👨‍💻 Built with HTML, CSS, and JavaScript
📧 Contact: john.doe@example.com
🌐 Portfolio: https://johndoe.dev
`)

// Service Worker Registration (for PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Error Handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
})
