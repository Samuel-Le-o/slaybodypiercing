/* 
========================================
SLAY BODYPIERCING - MAIN JAVASCRIPT FILE
========================================
Complete JavaScript functionality for SLAY BodyPiercing website
Last updated: 2025

FUNCTIONALITY OVERVIEW:
1. Mobile Navigation Toggle
2. Reviews System (Firebase integration)
3. Smooth Scroll Navigation
4. Gallery Modal System
5. Shopping Cart Functionality
6. Service Selection & Pricing
7. EmailJS Booking Integration
8. PDF Receipt Generation
9. Form Validation & Submission
10. Confirmation Modal System

DEPENDENCIES:
- Firebase (Firestore database)
- EmailJS (email service)
- jsPDF (PDF generation)
========================================
*/

// Main DOM Ready Function - Consolidates all functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== DOM LOADED - INITIALIZING ALL FUNCTIONALITY ===');
  
  /* 
  ========================================
  WELCOME MODAL FUNCTIONALITY
  ========================================
  Shows a welcome message on first visit
  Uses localStorage to remember user preference
  */
  function setupWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    const closeWelcome = document.getElementById('closeWelcome');
    const dontShowAgain = document.getElementById('dontShowAgain');
    
    // Check if user has seen the welcome message before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    // Only show if it's the first visit to the site
    if (!hasSeenWelcome && welcomeModal) {
      welcomeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      // Close button functionality
      if (closeWelcome) {
        closeWelcome.addEventListener('click', function() {
          welcomeModal.style.display = 'none';
          document.body.style.overflow = '';
        });
      }
      
      // Don't show again functionality
      if (dontShowAgain) {
        dontShowAgain.addEventListener('click', function() {
          localStorage.setItem('hasSeenWelcome', 'true');
          welcomeModal.style.display = 'none';
          document.body.style.overflow = '';
        });
      }
      
      // Close when clicking outside the modal content
      welcomeModal.addEventListener('click', function(e) {
        if (e.target === welcomeModal) {
          welcomeModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  }
  
  // Clear welcome modal flag to re-enable for all visitors
  localStorage.removeItem('hasSeenWelcome');
  
  // Initialize the welcome modal
  setupWelcomeModal();
  
  // Set minimum date to today for booking form
  function setupDatePicker() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      // Set minimum date to today
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      dateInput.min = todayString;
      
      // For mobile browsers that don't respect min attribute
      dateInput.addEventListener('focus', function() {
        this.type = 'date';
        // Set a default value if empty to ensure min attribute works
        if (!this.value) {
          this.value = todayString;
        }
      });

      // Validate on form submission
      const form = dateInput.closest('form');
      if (form) {
        form.addEventListener('submit', function(e) {
          const selectedDate = new Date(dateInput.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            e.preventDefault();
            alert('Please select today\'s date or a future date.');
            dateInput.focus();
            return false;
          }
        });
      }
      
      // Add event listener to prevent selecting past dates
      dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          // On mobile, we need to be more aggressive with validation
          this.value = todayString;
          // Trigger change event to update any dependent UI
          this.dispatchEvent(new Event('change'));
        }
      });
      
      // Initialize with today's date if empty
      if (!dateInput.value) {
        dateInput.value = todayString;
      }
    }
  }
  
  // Initialize date picker
  setupDatePicker();
  
  /* 
  ========================================
  SMOOTH SCROLLING FOR INTERNAL LINKS
  ========================================
  Enhances navigation with smooth scrolling to anchor links
  */
  function setupSmoothScrolling() {
    // Handle all anchor links that point to sections on the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    // Handle cross-page navigation with smooth scrolling
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTo = urlParams.get('scrollTo');
    
    if (scrollTo) {
      setTimeout(() => {
        const targetElement = document.getElementById(scrollTo);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }
  
  // Initialize smooth scrolling
  setupSmoothScrolling();
  
  /* 
  ========================================
  1. MOBILE NAVIGATION SYSTEM
  ========================================
  Handles hamburger menu toggle for mobile devices
  Elements: #hamburger (button), #mobile-nav (menu container)
  Functions: toggleMobileNav(), close button handler
  */
  console.log('Setting up mobile navigation...');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  
  console.log('Mobile nav elements:', { 
    hamburger: !!hamburger, 
    mobileNav: !!mobileNav 
  });
  
  if (hamburger && mobileNav) {
    function toggleMobileNav() {
      const isActive = mobileNav.classList.contains('active');
      console.log('Toggle mobile nav, current state:', isActive);
      
      if (isActive) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Mobile nav closed');
      } else {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Mobile nav opened');
      }
    }
    
    hamburger.addEventListener('click', function(e) {
      console.log('Hamburger clicked!');
      e.preventDefault();
      toggleMobileNav();
    });
    
    const closeBtn = mobileNav.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        console.log('Close button clicked!');
        e.preventDefault();
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    console.log('Mobile navigation setup complete');
  } else {
    console.error('Mobile navigation elements not found!');
  }
  
  /* 
  ========================================
  2. REVIEWS SYSTEM (FIREBASE INTEGRATION)
  ========================================
  Handles customer reviews with Firebase Firestore
  Elements: #review-form, #reviews-list, #reviewer-name, #reviewer-text
  Functions: renderReviews(), listenForReviews(), form submission
  Database: Firebase collection 'reviews'
  */
  console.log('Setting up reviews functionality...');
  const reviewForm = document.getElementById('review-form');
  const reviewsList = document.getElementById('reviews-list');
  
  if (reviewForm && reviewsList) {
    const defaultReviews = [
      
    ];

    function renderReviews(reviews) {
      reviewsList.innerHTML = '';
      [...defaultReviews, ...reviews].forEach(r => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="review-name">${r.name}</div><div class="small">${r.text}</div>`;
        reviewsList.appendChild(card);
      });
    }

    function listenForReviews() {
      if (typeof db !== 'undefined') {
        db.collection('reviews').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          const reviews = [];
          snapshot.forEach(doc => {
            reviews.push(doc.data());
          });
          renderReviews(reviews);
        });
      }
    }

    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('reviewer-name').value.trim();
      const text = document.getElementById('reviewer-text').value.trim();
      if (!name || !text) return;
      
      if (typeof db !== 'undefined') {
        db.collection('reviews').add({
          name,
          text,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          reviewForm.reset();
        });
      }
    });

    listenForReviews();
    console.log('Reviews functionality setup complete');
  } else {
    console.log('Reviews elements not found, skipping setup');
  }
  
  /* 
  ========================================
  3. SMOOTH SCROLL NAVIGATION
  ========================================
  Enables smooth scrolling for anchor links
  Targets: All links with href starting with "#"
  Behavior: Prevents default jump, uses smooth scroll animation
  */
  console.log('Setting up smooth scroll...');
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  /* 
  ========================================
  4. GALLERY MODAL SYSTEM
  ========================================
  Image gallery with modal popup functionality
  Elements: .gallery img.expandable, #gallery-modal, #gallery-modal-img, .gallery-modal-close
  Features: Click to expand, ESC key close, click outside to close, body scroll lock
  */
  console.log('Setting up gallery functionality...');
  const galleryImages = document.querySelectorAll('.gallery img.expandable');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const modalClose = document.querySelector('.gallery-modal-close');

  if (galleryImages.length && modal && modalImg && modalClose) {
    galleryImages.forEach(img => {
      img.addEventListener('click', function() {
        modal.classList.add('active');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.body.style.overflow = 'hidden';
      });
    });
    
    modalClose.addEventListener('click', function() {
      modal.classList.remove('active');
      modalImg.src = '';
      document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        modalImg.src = '';
        document.body.style.overflow = '';
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (modal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
        modal.classList.remove('active');
        modalImg.src = '';
        document.body.style.overflow = '';
      }
    });
    
    console.log('Gallery functionality setup complete');
  } else {
    console.log('Gallery elements not found, skipping setup');
  }
  
  /* 
  ========================================
  5. SHOPPING CART FUNCTIONALITY
  ========================================
  Complete cart system for booking page
  Elements: .svc checkboxes, #cart-items, #total, #previewBtn, #checkoutBtn
  Features: Add/remove services, calculate totals, mandatory treatment package
  Storage: Uses DOM checkboxes and localStorage for persistence
  */
  console.log('Setting up cart functionality...');
  
  // Cart elements
  const svcCheckboxes = Array.from(document.querySelectorAll('.svc'));
  const cartItemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  const previewBtn = document.getElementById('previewBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartModal = document.getElementById('modal');
  const receiptEl = document.getElementById('receipt');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const closeModalBtn = document.getElementById('closeModal');
  
  if (cartItemsEl && totalEl) {
    // Mandatory treatment price
    const TREATMENT_PRICE = 65;
    
    // Shop add (belly rings)
    function addShop(name, price) {
      // push to cart as service
      // create a temporary checkbox and check it
      const tempCB = document.createElement('input');
      tempCB.type = 'checkbox';
      tempCB.className = 'svc';
      tempCB.dataset.name = name;
      tempCB.dataset.price = price;
      document.getElementById('shop-cart').appendChild(tempCB);
      tempCB.checked = true;
      renderCart();
    }
    
    function getSelectedServices() {
      // recompute: find all checkboxes with class 'svc' including dynamically added
      const all = Array.from(document.querySelectorAll('.svc'));
      return all.filter(cb => cb.checked).map(cb => ({name: cb.dataset.name, price: Number(cb.dataset.price)}));
    }
    
    function renderCart() {
      const selected = getSelectedServices();
      cartItemsEl.innerHTML = '';
      let total = 0;
      
      if (selected.length === 0) {
        // No items selected, show total as zero, do not add treatment
        totalEl.textContent = '0.00';
      } else {
        // Items selected, add each and then treatment
        selected.forEach((s, idx) => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${s.name}</span><strong>GHS ${s.price.toFixed(2)}</strong> <button class="remove-btn" data-index="${idx}" aria-label="Remove">Remove</button>`;
          cartItemsEl.appendChild(li);
          total += s.price;
        });
        // Add treatment (no remove button)
        const treatLi = document.createElement('li');
        treatLi.innerHTML = `<span>Mandatory Treatment Package</span><strong>GHS ${TREATMENT_PRICE.toFixed(2)}</strong>`;
        cartItemsEl.appendChild(treatLi);
        total += TREATMENT_PRICE;
        totalEl.textContent = total.toFixed(2);
      }
      
      // Show 50% deposit
      const depositEl = document.getElementById('deposit');
      if (depositEl) {
        depositEl.textContent = (total * 0.5).toFixed(2);
      }
      
      // Add remove button event listeners
      Array.from(cartItemsEl.querySelectorAll('.remove-btn')).forEach(btn => {
        btn.addEventListener('click', function(e) {
          const idx = parseInt(btn.getAttribute('data-index'));
          // Find the corresponding checkbox and uncheck it
          const all = Array.from(document.querySelectorAll('.svc'));
          const checkedSvcs = all.filter(cb => cb.checked);
          if (checkedSvcs[idx]) {
            checkedSvcs[idx].checked = false;
            renderCart();
          }
        });
      });
      return {selected, total};
    }
    
    // Re-render when user toggles checkboxes
    document.addEventListener('change', function(e) {
      if (e.target && e.target.classList && e.target.classList.contains('svc')) {
        renderCart();
      }
    });
    
    // Initial render
    renderCart();
    
    // Preview button functionality
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        const {selected, total} = renderCart();
        const details = collectFormSnapshot(selected, total);
        showReceipt(details);
      });
    }
    
    // Close modal button
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
      });
    }
    
    // Helper: collect snapshot for receipt
    function collectFormSnapshot(selected, total) {
      const name = document.getElementById('name')?.value?.trim() || '';
      const phone = document.getElementById('phone')?.value?.trim() || '';
      const email = document.getElementById('email')?.value?.trim() || '';
      const region = document.getElementById('region')?.value?.trim() || '';
      const city = document.getElementById('city')?.value?.trim() || '';
      const date = document.getElementById('date')?.value || '';
      const time = document.getElementById('time')?.value || '';
      
      return {
        name, phone, email, region, city, date, time,
        services: selected.map(s => `${s.name} — GHS ${s.price.toFixed(2)}`),
        total: `GHS ${total.toFixed(2)}`
      };
    }
    
    // Show receipt modal
    function showReceipt(payload) {
      if (!receiptEl || !cartModal) return;
      
      // Save payload to sessionStorage for PDF download
      sessionStorage.setItem('slay_receipt', JSON.stringify(payload));
      
      const lines = [];
      lines.push(`Booking reference: SP-${Date.now().toString().slice(-6)}`);
      lines.push(`Name: ${payload.name}`);
      lines.push(`Email: ${payload.email}`);
      lines.push(`Phone: ${payload.phone}`);
      lines.push(`Region/City: ${payload.region} / ${payload.city}`);
      lines.push(`Date: ${payload.date}  Time: ${payload.time}`);
      lines.push('');
      lines.push('Services:');
      (payload.services || []).forEach(s => lines.push('  • ' + s));
      lines.push('');
      lines.push(`Total: ${payload.total}`);
      
      receiptEl.textContent = lines.join('\n');
      cartModal.style.display = 'flex';
    }
    
    // Download PDF button
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        console.log('PDF download button clicked');
        const saved = sessionStorage.getItem('slay_receipt') || null;
        console.log('Saved receipt data:', saved);
        
        const payload = saved ? JSON.parse(saved) : null;
        if (payload) {
          console.log('Generating PDF with payload:', payload);
          const uri = generatePdfDataUri(payload);
          if (uri) {
            // convert data URI to blob to trigger download
            const a = document.createElement('a');
            a.href = uri;
            a.download = 'SLAY_Booking_Receipt.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            console.log('PDF download triggered');
          } else {
            console.error('Failed to generate PDF URI');
            alert('Error generating PDF. Please try again.');
          }
        } else {
          console.error('No receipt data found');
          alert('No receipt data available. Please preview your booking first.');
        }
      });
    }
    
    // Generate PDF Data URI (jsPDF)
    function generatePdfDataUri(payload) {
      console.log('Checking jsPDF availability...');
      
      // Check multiple possible jsPDF locations
      let jsPDF = null;
      if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
        console.log('Found jsPDF at window.jspdf.jsPDF');
      } else if (typeof window.jsPDF !== 'undefined') {
        jsPDF = window.jsPDF;
        console.log('Found jsPDF at window.jsPDF');
      } else if (typeof jsPDF !== 'undefined') {
        console.log('Found global jsPDF');
      } else {
        console.error('jsPDF not found in any expected location');
        alert('PDF library not loaded. Please refresh the page and try again.');
        return '';
      }
      
      try {
        console.log('Creating PDF document...');
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        let y = 40;
        
        // Header
        doc.setFontSize(18);
        doc.text('SLAY BodyPiercing — Booking Receipt', 40, y); y += 28;
        
        // Reference and date
        doc.setFontSize(11);
        doc.text(`Reference: SP-${Date.now().toString().slice(-6)}`, 40, y); y += 18;
        doc.text(`Date: ${new Date().toLocaleString()}`, 40, y); y += 18;
        
        // Customer info
        doc.setFontSize(12);
        doc.text('Customer:', 40, y); y += 16;
        doc.setFontSize(10);
        doc.text(`Name: ${payload.name || 'N/A'}`, 60, y); y += 14;
        doc.text(`Email: ${payload.email || 'N/A'}`, 60, y); y += 14;
        doc.text(`Phone: ${payload.phone || 'N/A'}`, 60, y); y += 14;
        doc.text(`Region/City: ${payload.region || 'N/A'} / ${payload.city || 'N/A'}`, 60, y); y += 18;
        
        // Appointment info
        doc.setFontSize(12);
        doc.text('Appointment:', 40, y); y += 16;
        doc.setFontSize(10);
        doc.text(`Date: ${payload.date || 'N/A'}   Time: ${payload.time || 'N/A'}`, 60, y); y += 18;
        
        // Services
        doc.setFontSize(12);
        doc.text('Services:', 40, y); y += 16;
        doc.setFontSize(10);
        if (payload.services && payload.services.length > 0) {
          payload.services.forEach(s => {
            doc.text(`• ${s}`, 60, y);
            y += 14;
            if (y > 720) { doc.addPage(); y = 40; }
          });
        } else {
          doc.text('• No services selected', 60, y);
          y += 14;
        }
        
        // Total
        y += 6;
        doc.setFontSize(12);
        doc.text(`Total: ${payload.total || 'GHS 0.00'}`, 40, y);
        
        console.log('PDF generated successfully');
        return doc.output('datauristring');
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message);
        return '';
      }
    }
    
    console.log('Cart functionality setup complete');
  } else {
    console.log('Cart elements not found, skipping setup');
  }
  
  /* 
  ========================================
  6. PIERCING CARDS SCROLL ANIMATIONS
  ========================================
  Intersection Observer for staggered card animations
  Elements: .piercing-card elements
  Features: Fade-in on scroll, staggered timing, one-time animation
  */
  console.log('Setting up piercing cards animations...');
  
  const piercingCards = document.querySelectorAll('.piercing-card');
  
  if (piercingCards.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay based on card position within its section
          const card = entry.target;
          const categorySection = card.closest('.category-section');
          const cardsInSection = categorySection.querySelectorAll('.piercing-card');
          const cardIndex = Array.from(cardsInSection).indexOf(card);
          
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, cardIndex * 100); // 100ms delay between each card
          
          cardObserver.unobserve(card);
        }
      });
    }, observerOptions);
    
    piercingCards.forEach(card => {
      cardObserver.observe(card);
    });
    
    console.log(`Piercing cards animations setup complete for ${piercingCards.length} cards`);
  } else {
    console.log('No piercing cards found, skipping animations setup');
  }
  
  /* 
  ========================================
  7. SERVICES PAGE CART FUNCTIONALITY
  ========================================
  Cart integration for services page "BOOK NOW" buttons
  Elements: .p-btn[data-service] buttons
  Features: Add to cart, localStorage persistence, notification system
  Integration: Syncs with booking page cart system
  */
  console.log('Setting up services page cart functionality...');
  
  // Service prices object matching booking page
  const servicePrices = {
    'Baby Lobe': 85,
    'Lobe': 75,
    'Transverse': 100,
    'Helix': 120,
    'Tragus': 220,
    'Conch': 200,
    'Daith': 220,
    'Forward Helix': 220,
    'Snug': 200,
    'Rook': 230,
    'Industrial': 250,
    'Surface': 250,
    'Flat-Conch': 220,
    'Anti-Tragus': 250,
    'Nostril': 270,
    'Septum': 250,
    'Eyebrow': 300,
    'Lip': 300,
    'Tongue': 350,
    'Smiley': 250,
    'Nipple': 380,
    'Belly': 320,
    'Sternum': 350,
    'Dermal': 450
  };
  
  // Get cart from localStorage
  function getCart() {
    const cart = localStorage.getItem('slayCart');
    return cart ? JSON.parse(cart) : [];
  }
  
  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem('slayCart', JSON.stringify(cart));
  }
  
  // Add service to cart
  function addToCart(serviceName, price) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === serviceName);
    
    if (!existingItem) {
      cart.push({
        name: serviceName,
        price: price
      });
      saveCart(cart);
      showCartNotification(`${serviceName} added to cart!`);
    } else {
      showCartNotification(`${serviceName} is already in your cart!`);
    }
  }
  
  // Show cart notification
  function showCartNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('cart-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'cart-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
    }, 3000);
  }
  
  // Handle BOOK NOW button clicks on services page
  const bookNowButtons = document.querySelectorAll('.p-btn[data-service]');
  if (bookNowButtons.length > 0) {
    bookNowButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const serviceName = button.getAttribute('data-service');
        const servicePrice = parseInt(button.getAttribute('data-price'));
        
        if (serviceName && servicePrice) {
          addToCart(serviceName, servicePrice);
        }
      });
    });
    console.log(`Services page cart functionality setup complete for ${bookNowButtons.length} buttons`);
  } else {
    console.log('No service buttons found, skipping services cart setup');
  }
  
  /* 
  ========================================
  8. BOOKING PAGE CART DISPLAY
  ========================================
  Loads cart items from localStorage onto booking page
  Elements: .svc checkboxes on booking page
  Features: Auto-check services from cart, trigger cart render
  Integration: Bridges services page selections to booking form
  */
  console.log('Setting up booking page cart display...');
  
  // Load cart items on booking page
  function loadCartOnBookingPage() {
    const cart = getCart();
    if (cart.length > 0) {
      // Find corresponding checkboxes and check them
      cart.forEach(item => {
        const checkbox = document.querySelector(`.svc[data-name="${item.name}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
      
      // Trigger cart render if on booking page
      if (typeof renderCart === 'function') {
        renderCart();
      }
    }
  }
  
  // Load cart items if we're on the booking page
  if (document.querySelector('.svc')) {
    loadCartOnBookingPage();
    console.log('Booking page cart display setup complete');
  }
  
  /* 
  ========================================
  9. EMAILJS INTEGRATION
  ========================================
  Complete email service integration for booking form submission
  Configuration: Public key, service ID, template ID
  Elements: #booking-form, all form inputs
  Features: Form validation, email sending, error handling
  Template Parameters: Maps form data to EmailJS template variables
  */
  console.log('Setting up EmailJS integration...');
  
  // EmailJS configuration
  const EMAILJS_CONFIG = {
    publicKey: '0-kKEp4ff20FCDLk7',
    serviceId: 'service_mam22qv',
    adminTemplateId: 'template_xrpyhzc',
    clientTemplateId: 'template_s0nnhf6'
  };
  
  // Initialize EmailJS
  function initializeEmailJS() {
    console.log('Checking EmailJS availability...');
    if (typeof emailjs !== 'undefined') {
      try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully with public key:', EMAILJS_CONFIG.publicKey);
        return true;
      } catch (error) {
        console.error('Error initializing EmailJS:', error);
        return false;
      }
    }
    console.error('EmailJS library not loaded - check if script is included in HTML');
    return false;
  }
  
  // Show professional booking confirmation modal
  function showBookingConfirmation(bookingData) {
    // Create modal HTML
    const modalHTML = `
      <div id="bookingConfirmationModal" class="booking-confirmation-modal">
        <div class="booking-confirmation-content">
          <div class="confirmation-header">
            <div class="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <button class="close-confirmation" type="button">&times;</button>
          </div>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="label">Client:</span>
              <span class="value">${bookingData.clientName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${bookingData.bookingDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span>
              <span class="value">${bookingData.bookingTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Services:</span>
              <span class="value">${bookingData.services}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span class="value">GHS ${bookingData.totalAmount}</span>
            </div>
            <div class="detail-row highlight">
              <span class="label">Deposit Required (50%):</span>
              <span class="value">GHS ${bookingData.depositAmount}</span>
            </div>
            <div class="detail-row">
              <span class="label">Reference:</span>
              <span class="value">${bookingData.reference}</span>
            </div>
          </div>
          
          <div class="payment-instructions">
            <h3>💳 Payment Instructions</h3>
            <div class="payment-info">
              <p><strong>Send your deposit via MTN Mobile Money:</strong></p>
              <div class="momo-details">
                <div class="momo-number">📱 0550396789</div>
                <div class="momo-name">👤 Juliet Sena Dogbe</div>
                <div class="momo-amount">💰 GHS ${bookingData.depositAmount}</div>
                <div class="momo-reference">📋 Reference: ${bookingData.reference}</div>
              </div>
              <p class="payment-note">
                <strong>Important:</strong> Please include the reference number when making payment.
                Your appointment will be confirmed once payment is received.
              </p>
            </div>
          </div>
          
          <div class="mandatory-notice">
            <p class="mandatory-text">* <strong>MANDATORY:</strong> Please download your receipt before closing this window</p>
          </div>
          
          <div class="confirmation-actions">
            <button class="btn-secondary" type="button">📄 Download Receipt</button>
            <button class="btn-primary" type="button">Got it!</button>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('bookingConfirmationModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Store booking data globally for PDF generation
    window.currentBookingData = bookingData;
    
    // Add event listeners for modal close and buttons
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeBookingConfirmation();
      }
    });
    
    // Add event listeners to buttons
    const closeBtn = modal.querySelector('.close-confirmation');
    const gotItBtn = modal.querySelector('.btn-primary');
    const downloadBtn = modal.querySelector('.btn-secondary');
    
    closeBtn.addEventListener('click', closeBookingConfirmation);
    gotItBtn.addEventListener('click', closeBookingConfirmation);
    downloadBtn.addEventListener('click', function() {
      downloadReceipt(bookingData.reference, bookingData);
    });
  }
  
  // Close booking confirmation modal
  window.closeBookingConfirmation = function() {
    const modal = document.getElementById('bookingConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
      modal.remove();
      document.body.style.overflow = '';
      // Redirect to home page after closing
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }
  }
  
  // Download receipt as PDF
  window.downloadReceipt = function(reference, bookingData) {
    console.log('Download receipt clicked', reference, bookingData);
    
    // Use the global booking data if not passed
    const data = bookingData || window.currentBookingData;
    
    if (!data) {
      alert('Booking data not available. Please try again.');
      return;
    }
    
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
      alert('PDF library not loaded. Please refresh the page and try again.');
      console.error('jsPDF not found. Make sure the library is loaded.');
      return;
    }
    
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Set colors
      const primaryColor = [225, 29, 114]; // Hot pink
      const textColor = [51, 51, 51]; // Dark gray
      const lightGray = [245, 245, 245];
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SLAY BodyPiercing', 20, 25);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Booking Confirmation Receipt', 20, 35);
      
      // Reset text color
      doc.setTextColor(...textColor);
      
      // Booking details
      let yPos = 60;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Details', 20, yPos);
      
      yPos += 15;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const details = [
        ['Client Name:', data.clientName],
        ['Date:', data.bookingDate],
        ['Time:', data.bookingTime],
        ['Services:', data.services],
        ['Total Amount:', `GHS ${data.totalAmount}`],
        ['Deposit Required (50%):', `GHS ${data.depositAmount}`],
        ['Reference Number:', data.reference]
      ];
      
      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 8;
      });
      
      // Payment instructions
      yPos += 10;
      doc.setFillColor(...lightGray);
      doc.rect(15, yPos - 5, 180, 50, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Payment Instructions', 20, yPos + 5);
      
      doc.setTextColor(...textColor);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPos += 15;
      
      doc.text('Send your deposit via MTN Mobile Money:', 20, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.text('Number: 0550396789', 20, yPos);
      yPos += 6;
      doc.text('Name: Juliet Sena Dogbe', 20, yPos);
      yPos += 6;
      doc.text(`Amount: GHS ${data.depositAmount}`, 20, yPos);
      yPos += 6;
      doc.text(`Reference: ${data.reference}`, 20, yPos);
      
      // Footer
      yPos += 25;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for choosing SLAY BodyPiercing!', 20, yPos);
      doc.text('Contact: info@slaybodypiercing.com | +233 24 123 4567', 20, yPos + 8);
      
      // Save the PDF
      doc.save(`SLAY-Booking-Receipt-${reference}.pdf`);
      console.log('PDF generated successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again or contact support.');
    }
  }

  // Enhanced form submission with EmailJS
  async function submitBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return { success: false, error: 'Form not found' };
    
    // Ensure EmailJS is initialized
    if (!initializeEmailJS()) {
      return { success: false, error: 'EmailJS not available. Please refresh the page and try again.' };
    }
    
    // Get form values
    const clientName = document.getElementById('name').value.trim();
    const clientEmail = document.getElementById('email').value.trim();
    const clientPhone = document.getElementById('phone').value.trim();
    const region = document.getElementById('region').value;
    const city = document.getElementById('city').value.trim();
    const bookingDate = document.getElementById('date').value;
    const bookingTime = document.getElementById('time').value;
    const notes = document.getElementById('notes').value.trim() || 'No additional notes';
    
    // Get selected services
    const selectedServices = getSelectedServices();
    const servicesText = selectedServices.map(s => `${s.name} (GHS ${s.price})`).join('\n');
    const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0) + 65; // Include treatment
    const depositAmount = Math.ceil(totalAmount * 0.5);
    const reference = `SP-${Date.now().toString().slice(-6)}`;
    
    // 1. Email to Admin (You)
    const adminTemplateParams = {
      to_email: 'charisdogbe@gmail.com', // Your admin email
      from_name: clientName,
      reply_to: clientEmail,
      phone: clientPhone,
      region: region,
      city: city,
      service: servicesText,
      preferred_date: bookingDate,
      preferred_time: bookingTime,
      message: notes,
      total_amount: `GHS ${totalAmount.toFixed(2)}`,
      deposit_amount: `GHS ${depositAmount.toFixed(2)}`,
      reference_number: reference
    };
    
    // 2. Email to Client - Different parameters for client confirmation
    const clientTemplateParams = {
      to_email: clientEmail, // Client's email address
      client_name: clientName,
      client_email: clientEmail,
      business_name: 'SLAY BodyPiercing',
      appointment_date: new Date(bookingDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      appointment_time: bookingTime,
      selected_services: servicesText,
      total_cost: `GHS ${totalAmount.toFixed(2)}`,
      deposit_required: `GHS ${depositAmount.toFixed(2)}`,
      remaining_balance: `GHS ${(totalAmount - depositAmount).toFixed(2)}`,
      booking_reference: reference,
      business_email: 'info@slaybodypiercing.com',
      business_phone: '+233 24 123 4567',
      payment_instructions: 'Make payment via Mobile Money to complete your booking'
    };
    
    try {
      console.log('Processing booking confirmation...');
      
      // Send admin notification via email only
      console.log('Sending admin email notification...');
      const adminResult = await emailjs.send(
        EMAILJS_CONFIG.serviceId, 
        EMAILJS_CONFIG.adminTemplateId, 
        adminTemplateParams
      );
      console.log('Admin email sent successfully:', adminResult);
      
      return { 
        success: true,
        reference: reference,
        depositAmount: depositAmount,
        clientName: clientName,
        bookingDate: new Date(bookingDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        bookingTime: bookingTime,
        services: selectedServices.map(s => s.name).join(', '),
        totalAmount: totalAmount.toFixed(2),
        adminEmailStatus: adminResult.status
      };
    } catch (error) {
      console.error('Detailed error sending emails:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error text:', error.text);
      
      return { 
        success: false, 
        error: `Email sending failed: ${error.message || error.text || 'Unknown error'}`,
        errorDetails: error
      };
    }
  }
  
  // Preview button functionality
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const {selected, total} = renderCart();
      const details = collectFormSnapshot(selected, total);
      showReceipt(details);
    });
  }
  
  // Enhanced checkout button functionality
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      const {selected, total} = renderCart();
      
      if (selected.length === 0) {
        alert('Please select at least one service before checking out.');
        return;
      }
      
      // Collect and validate form data
      const name = document.getElementById('name')?.value?.trim();
      const email = document.getElementById('email')?.value?.trim();
      const phone = document.getElementById('phone')?.value?.trim();
      const region = document.getElementById('region')?.value?.trim();
      const city = document.getElementById('city')?.value?.trim();
      const date = document.getElementById('date')?.value;
      const time = document.getElementById('time')?.value;
      
      if (!name || !email || !phone || !region || !city || !date || !time) {
        alert('Please fill in all required fields before submitting.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Show loading state
      const originalText = checkoutBtn.textContent;
      checkoutBtn.textContent = 'Sending...';
      checkoutBtn.disabled = true;
      
      try {
        // EmailJS should already be initialized, but double-check
        console.log('Checking EmailJS before form submission...');
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS library not loaded');
        }
        
        console.log('Submitting booking form...');
        const result = await submitBookingForm();
        console.log('EmailJS response:', result);
        
        if (result.success) {
          // Show professional confirmation modal
          showBookingConfirmation(result);
        } else {
          throw new Error(result.error || 'Failed to process booking');
        }
        
        // Clear form and cart
        document.getElementById('booking-form').reset();
        localStorage.removeItem('slayCart');
        renderCart();
        
      } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error message:', error.message);
        console.error('Error text:', error.text);
        
        let errorMessage = 'There was an error submitting your booking. ';
        if (error.text) {
          errorMessage += `Error: ${error.text}`;
        } else if (error.message) {
          errorMessage += `Error: ${error.message}`;
        } else {
          errorMessage += 'Please try again or contact us directly.';
        }
        
        alert(errorMessage);
      } finally {
        // Restore button state
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
      }
    });
  }
  
  /* 
  ========================================
  10. CONFIRMATION MODAL SYSTEM
  ========================================
  Success modal after booking form submission
  Features: Animated modal, booking reference, deposit amount, auto-close
  Elements: Dynamic modal creation, confirmation styling
  Functions: showConfirmationModal(), closeConfirmationModal()
  */
  
  // Modern confirmation modal function
  function showConfirmationModal(reference, email, deposit, selectedServices) {
    // Create modal HTML
    const modalHTML = `
      <div class="confirmation-modal" id="confirmationModal">
        <div class="confirmation-content">
          <div class="confirmation-icon">🎉</div>
          <h2 class="confirmation-title">Booking Submitted Successfully!</h2>
          
          <div class="confirmation-reference">
            Reference: ${reference}
          </div>
          
          <div class="confirmation-details">
            <h4>Confirmation email sent to:</h4>
            <ul>
              <li>${email}</li>
              <li>Your booking details</li>
              <li>Payment instructions</li>
              <li>Our Mobile Money details</li>
            </ul>
          </div>
          
          <div class="confirmation-deposit">
            <div class="deposit-amount">GHS ${deposit}</div>
            <div class="deposit-text">50% deposit required to confirm appointment</div>
          </div>
          
          <p class="confirmation-message">
            Please complete your deposit to confirm your appointment.<br>
            We'll contact you shortly with further details.
          </p>
          
          <div class="confirmation-footer">
            <button class="confirmation-close-btn" onclick="closeConfirmationModal()">
              Got it, thanks!
            </button>
            <div class="confirmation-brand">SLAY BodyPiercing 💎</div>
          </div>
        </div>
      </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('confirmationModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal with animation
    setTimeout(() => {
      document.getElementById('confirmationModal').classList.add('show');
    }, 100);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
      closeConfirmationModal();
    }, 10000);
  }
  
  // Close confirmation modal function
  window.closeConfirmationModal = function() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }
  
  // Close modal when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('confirmation-modal')) {
      closeConfirmationModal();
    }
  });

  // Initialize EmailJS on page load
  initializeEmailJS();
  
  console.log('EmailJS integration setup complete');
  
  console.log('=== ALL FUNCTIONALITY INITIALIZED ===');
});
