document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});

function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  var bg2 = document.getElementById("bg-photo-2");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    
    if (elementTop < windowHeight - 150) {
      reveals[i].classList.add("active");
      
      // If we reach the second card (Athlete's Mindset), fade in second photo
      if(i === 1) { 
          bg2.style.opacity = "1"; 
      }
    }
  }
}

window.addEventListener("scroll", reveal);
// Simple toggle functions
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    
    if (sidebar.style.width === "300px" || sidebar.classList.contains('active')) {
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

document.querySelector('.menu-toggle').addEventListener('click', toggleNav);
