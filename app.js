// Application Data
const appData = {
  brand: {
    name: "Roar Threads",
    tagline: "Where Heritage Meets High Fashion - Roar Threads: Crafted for the Elite",
    description: "High End Fashion"
  },
  products: [
    {
      name: "Heritage Cashmere Coat",
      price: "$1,899",
      originalPrice: "$2,199",
      image: "luxury coat",
      category: "Outerwear",
      rating: 4.9
    },
    {
      name: "Signature Silk Dress",
      price: "$799",
      originalPrice: "$899",
      image: "silk dress",
      category: "Dresses",
      rating: 4.8
    },
    {
      name: "Artisan Leather Handbag",
      price: "$1,299",
      originalPrice: "$1,499",
      image: "leather handbag",
      category: "Accessories",
      rating: 5.0
    },
    {
      name: "Tailored Wool Blazer",
      price: "$1,199",
      originalPrice: "$1,399",
      image: "wool blazer",
      category: "Blazers",
      rating: 4.9
    }
  ]
};

// Authentication state management
class AuthManager {
  constructor() {
    this.isAuthenticated = this.checkAuthStatus();
    this.setupEventListeners();
    this.showCorrectPage();
  }

  checkAuthStatus() {
    const authData = localStorage.getItem('roarThreadsAuth');
    if (authData) {
      try {
        const { timestamp, expiresIn } = JSON.parse(authData);
        const now = Date.now();
        if (now - timestamp < expiresIn) {
          return true;
        } else {
          localStorage.removeItem('roarThreadsAuth');
        }
      } catch (e) {
        localStorage.removeItem('roarThreadsAuth');
      }
    }
    return false;
  }

  authenticate(userData) {
    const authData = {
      user: userData,
      timestamp: Date.now(),
      expiresIn: 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
    };
    localStorage.setItem('roarThreadsAuth', JSON.stringify(authData));
    this.isAuthenticated = true;
    this.showCorrectPage();
  }

  logout() {
    localStorage.removeItem('roarThreadsAuth');
    this.isAuthenticated = false;
    this.showCorrectPage();
  }

  showCorrectPage() {
    const authPage = document.getElementById('auth-page');
    const homepage = document.getElementById('homepage');
    
    if (this.isAuthenticated) {
      if (authPage) authPage.classList.add('hidden');
      if (homepage) homepage.classList.remove('hidden');
      this.initHomepage();
    } else {
      if (authPage) authPage.classList.remove('hidden');
      if (homepage) homepage.classList.add('hidden');
    }
  }

  setupEventListeners() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attachEventListeners());
    } else {
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    // Form switch buttons
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (showSignupBtn && showLoginBtn && loginForm && signupForm) {
      showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
      });

      showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
      });
    }

    // Email/Password Login
    const loginEmailForm = document.getElementById('login-email-form');
    if (loginEmailForm) {
      loginEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        
        if (this.validateEmail(email) && password && password.length >= 6) {
          this.authenticate({ email, method: 'email' });
          this.showSuccessModal('Welcome Back!', 'Successfully signed in to your account.');
        } else {
          alert('Please enter a valid email and password (min 6 characters).');
        }
      });
    }

    // Email/Password Signup
    const signupEmailForm = document.getElementById('signup-email-form');
    if (signupEmailForm) {
      signupEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name')?.value;
        const email = document.getElementById('signup-email')?.value;
        const password = document.getElementById('signup-password')?.value;
        const confirmPassword = document.getElementById('signup-confirm-password')?.value;
        
        if (!name || !name.trim()) {
          alert('Please enter your full name.');
          return;
        }
        
        if (!this.validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
        }
        
        if (!password || password.length < 6) {
          alert('Password must be at least 6 characters long.');
          return;
        }
        
        if (password !== confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
        
        this.authenticate({ name, email, method: 'email' });
        this.showSuccessModal('Account Created!', 'Welcome to Roar Threads! Your account has been created successfully.');
      });
    }

    // Social Authentication Buttons
    const googleSigninBtn = document.getElementById('google-signin');
    const googleSignupBtn = document.getElementById('google-signup');
    const appleSigninBtn = document.getElementById('apple-signin');
    const appleSignupBtn = document.getElementById('apple-signup');

    if (googleSigninBtn) {
      googleSigninBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.simulateOAuthLogin('google', e.target);
      });
    }

    if (googleSignupBtn) {
      googleSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.simulateOAuthLogin('google', e.target);
      });
    }

    if (appleSigninBtn) {
      appleSigninBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.simulateOAuthLogin('apple', e.target);
      });
    }

    if (appleSignupBtn) {
      appleSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.simulateOAuthLogin('apple', e.target);
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  simulateOAuthLogin(provider, button) {
    const providerName = provider === 'google' ? 'Google' : 'Apple ID';
    const btn = button.closest('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    btn.disabled = true;
    
    setTimeout(() => {
      const userData = {
        email: `user@${provider}.com`,
        name: 'User Name',
        method: provider
      };
      
      this.authenticate(userData);
      this.showSuccessModal(`${providerName} Authentication`, `Successfully authenticated with ${providerName}!`);
      
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1500);
  }

  validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showSuccessModal(title, message) {
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    if (modal && modalTitle && modalMessage) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modal.classList.remove('hidden');
    }
  }

  initHomepage() {
    // Initialize homepage functionality
    this.renderProducts();
    this.setupHomepageEventListeners();
  }

  renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    
    appData.products.forEach(product => {
      const productCard = this.createProductCard(product);
      productsGrid.appendChild(productCard);
    });
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = '★'.repeat(Math.floor(product.rating)) + 
                 (product.rating % 1 !== 0 ? '☆' : '');
    
    card.innerHTML = `
      <div class="product-image">
        <span>${product.image}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">${product.price}</span>
          <span class="original-price">${product.originalPrice}</span>
        </div>
        <div class="product-rating">
          <span style="color: var(--brand-gold);">${stars}</span>
          <span>(${product.rating})</span>
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      this.showSuccessModal('Product Details', `Viewing ${product.name}. Full product page would be implemented in a real application.`);
    });
    
    return card;
  }

  setupHomepageEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim();
          if (query) {
            this.performSearch(query);
          }
        }
      });
    }

    // Newsletter signup
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]')?.value;
        if (this.validateEmail(email)) {
          this.showSuccessModal('Newsletter Subscription', 'Thank you for subscribing! You\'ll receive 15% off your first purchase via email.');
          e.target.reset();
        } else {
          alert('Please enter a valid email address.');
        }
      });
    }

    // Collection buttons
    const collectionBtns = document.querySelectorAll('.collection-card .btn');
    collectionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const collectionName = btn.closest('.collection-card')?.querySelector('h3')?.textContent;
        this.showSuccessModal('Collection', `Browsing ${collectionName} collection. Product listing would be implemented in a real application.`);
      });
    });

    // Hero CTA button
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      heroCta.addEventListener('click', () => {
        const collectionsSection = document.querySelector('.collections');
        if (collectionsSection) {
          collectionsSection.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
      });
    }

    // Cart functionality
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.product-card');
    
    addToCartBtns.forEach(card => {
      card.addEventListener('dblclick', () => {
        cartCount++;
        if (cartCountElement) {
          cartCountElement.textContent = cartCount;
        }
        const productName = card.querySelector('.product-name')?.textContent;
        this.showSuccessModal('Added to Cart', `${productName} has been added to your cart!`);
      });
    });

    // Modal close functionality
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.textContent;
        this.showSuccessModal('Navigation', `Browsing ${category} section. Category pages would be implemented in a real application.`);
      });
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
          const linkText = link.textContent;
          this.showSuccessModal('Page Navigation', `${linkText} page would be implemented in a real application.`);
        }
      });
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i')?.className.split('-')[1];
        if (platform) {
          this.showSuccessModal('Social Media', `Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)} page in a new tab.`);
        }
      });
    });
  }

  performSearch(query) {
    const filteredProducts = appData.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredProducts.length > 0) {
      this.showSuccessModal('Search Results', `Found ${filteredProducts.length} products matching "${query}". Search results page would be implemented in a real application.`);
    } else {
      this.showSuccessModal('Search Results', `No products found matching "${query}". Try searching for "cashmere", "silk", "leather", or "wool".`);
    }
  }
}

// Global variable to store auth manager instance
let authManager;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize authentication manager
  authManager = new AuthManager();
  
  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
      const modal = document.getElementById('success-modal');
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    }
    
    // Quick search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput && authManager.isAuthenticated) {
        searchInput.focus();
      }
    }
  });

  // Add visual feedback for interactive elements
  const interactiveElements = document.querySelectorAll('button, .btn, .product-card, .collection-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      if (!element.disabled) {
        element.style.transform = 'translateY(-2px)';
      }
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  });

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
  }

  // Add error handling for failed image loads
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', () => {
      console.warn(`Failed to load image: ${img.src}`);
      // Don't hide the image, let it show the alt text or placeholder
    });
  });
});

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function debounce(func, wait) {
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

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthManager };
}