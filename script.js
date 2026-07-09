document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  
  // Image Growth Fallback Elements
  const imgStage2 = document.querySelector('.img-stage2');
  const tagStage1 = document.querySelector('.tag-stage1');
  const tagStage2 = document.querySelector('.tag-stage2');
  const mainContact = 'maddiashok@gmail.com';

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  });

  // Close mobile menu on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });

  /* ==========================================================================
     SCROLL INTERACTION FALLBACKS
     ========================================================================== */
  const supportsScrollDriven = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

  const handleScrollFallbacks = () => {
    const scrollY = window.scrollY;
    
    // 1. Header Shrink Fallback
    if (scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // 2. Image and Tag Transitions Fallback
    // Over first 350px of scroll, transition image1 -> image2
    const transitionRange = 350;
    const progress = Math.min(1, Math.max(0, scrollY / transitionRange));

    if (imgStage2 && tagStage1 && tagStage2) {
      imgStage2.style.opacity = progress;
      tagStage1.style.opacity = 1 - progress;
      tagStage2.style.opacity = progress;
    }
  };

  // Bind listener only if browser lacks native CSS support
  if (!supportsScrollDriven) {
    window.addEventListener('scroll', handleScrollFallbacks);
    handleScrollFallbacks(); // Trigger once on load
  }

  /* ==========================================================================
     ACTIVE NAVIGATION SYNC (INTERSECTION OBSERVER)
     ========================================================================== */
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, sectionObserverOptions);

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  /* ==========================================================================
     BACK-TO-TOP BUTTON
     ========================================================================== */
  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     FORM VALIDATION
     ========================================================================== */
  const validationRules = {
    name: (val) => val.trim().length >= 2,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    message: (val) => val.trim().length >= 8
  };

  const inputs = {
    name: document.getElementById('contact-name'),
    email: document.getElementById('contact-email'),
    message: document.getElementById('contact-message')
  };

  const validateField = (name) => {
    const input = inputs[name];
    if (!input) return true;
    
    const isValid = validationRules[name](input.value);
    
    if (isValid) {
      input.classList.remove('invalid');
      input.setAttribute('aria-invalid', 'false');
    } else {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
    }
    return isValid;
  };

  let attemptedSubmit = false;
  
  Object.keys(inputs).forEach(key => {
    if (inputs[key]) {
      inputs[key].addEventListener('input', () => {
        if (attemptedSubmit) validateField(key);
      });
      
      inputs[key].addEventListener('blur', () => {
        validateField(key);
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Enforce rate limiting: check if last submission was less than 60s ago
    const lastSubmit = localStorage.getItem('lastContactSubmit');
    const successMsg = document.getElementById('form-success-msg');
    
    if (lastSubmit) {
      const timePassed = Date.now() - parseInt(lastSubmit, 10);
      if (timePassed < 60000) {
        const remainingSeconds = Math.ceil((60000 - timePassed) / 1000);
        
        // Show validation/error feedback inside the message banner
        successMsg.style.display = 'flex';
        successMsg.style.borderColor = '#ef4444';
        successMsg.style.color = '#ef4444';
        successMsg.style.background = 'rgba(239, 68, 68, 0.08)';
        successMsg.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Please wait ${remainingSeconds}s before requesting suggestions again.</span>
        `;
        
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
        return;
      }
    }

    attemptedSubmit = true;

    const isFormValid = Object.keys(inputs).reduce((acc, currentKey) => {
      const fieldValid = validateField(currentKey);
      return acc && fieldValid;
    }, true);

    if (isFormValid) {
      const submitBtn = document.getElementById('form-submit-btn');
      const submitText = submitBtn.querySelector('span');
      const spinner = submitBtn.querySelector('.submit-spinner');

      submitBtn.disabled = true;
      submitText.textContent = 'Submitting...';
      spinner.style.display = 'inline-block';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitText.textContent = 'Request Suggestions';
        
        const formData = {
          name: inputs.name.value,
          email: inputs.email.value,
          message: inputs.message.value
        };
        
        const emailData = {
          to: mainContact,
          subject: 'New Contact Form Submission',
          body: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
        };
        
        fetch('https://api.example.com/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

        spinner.style.display = 'none';
        
        // Reset success banner styling and show it
        successMsg.style.display = 'flex';
        successMsg.style.borderColor = 'rgba(16, 185, 129, 0.25)';
        successMsg.style.color = 'var(--accent)';
        successMsg.style.background = 'rgba(16, 185, 129, 0.08)';
        successMsg.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Thank you! An advisor will reach out with wealth suggestions.</span>
        `;
        
        contactForm.reset();
        attemptedSubmit = false;
        
        // Set local storage item to rate limit subsequent requests
        localStorage.setItem('lastContactSubmit', Date.now());

        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }, 1500);
    } else {
      const firstInvalid = Object.values(inputs).find(input => input.classList.contains('invalid'));
      if (firstInvalid) firstInvalid.focus();
    }
  });

  /* ==========================================================================
     REVEAL FALLBACK ON SCROLL (FIREFOX)
     ========================================================================== */
  const supportsViewTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsViewTimeline) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.98)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      revealObserver.observe(el);
    });
  }
});
