document.addEventListener("DOMContentLoaded", () => {
    // 1. Intersection Observer for elements with .fade-in
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    // 2. Initial check for Reveal elements in case they are already in view
    reveal();

    // 3. Safety check for menu-toggle (Fixes your console error)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleNav);
    }

    // 4. Έλεγχος αποθηκευμένου Theme κατά το φόρτωμα της σελίδας
    const savedTheme = localStorage.getItem('theme');
    const themeBtn = document.getElementById('theme-toggle');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-sun'; // Αλλάζει το εικονίδιο σε ήλιο
        }
    }
});

// Η συνάρτηση toggle που καλείται από το onclick="toggleTheme()" του button σου
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    
    body.classList.toggle('light-mode');
    
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        if (icon) {
            if (body.classList.contains('light-mode')) {
                icon.className = 'fa-solid fa-sun'; // Ήλιος για Light Mode
                localStorage.setItem('theme', 'light');
            } else {
                icon.className = 'fa-solid fa-moon'; // Φεγγάρι για Dark Mode
                localStorage.setItem('theme', 'dark');
            }
        }
    }
}

// Function για το ακορντεόν (Slide Down/Up) του BibTeX
function toggleBibtex(button) {
  const entry = button.closest('.paper-entry');
  const wrapper = entry.querySelector('.bibtex-wrapper');
  wrapper.classList.toggle('show');
}

// Function για την αντιγραφή του κειμένου στο clipboard
function copyBibtex(button) {
  const wrapper = button.closest('.bibtex-wrapper');
  const codeText = wrapper.querySelector('.bibtex-code code').innerText;
  
  navigator.clipboard.writeText(codeText).then(() => {
    const originalText = button.innerHTML;
    button.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
    button.style.color = "#34d399"; // Πράσινο χρώμα επιτυχίας
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.color = "";
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// Reveal function for scrolling cards
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// Listen for scroll events
window.addEventListener("scroll", reveal);

// Sidebar Navigation Logic
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    
    // Check width or computed style
    if (sidebar.style.width === "300px") {
        closeNav();
    } else {
        openNav();
    }
}

function openNav() {
    document.getElementById("mySidebar").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}
