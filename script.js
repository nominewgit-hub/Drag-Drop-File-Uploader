/* =========================
   DOM ELEMENTS
========================= */
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const errorMessage = document.getElementById("errorMessage");
const fileInfo = document.getElementById("fileInfo");
const fileNameEl = document.querySelector(".file-name");
const fileSizeEl = document.querySelector(".file-size");
const progressWrapper = document.getElementById("progressWrapper");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const actionButtons = document.getElementById("actionButtons");
const replaceBtn = document.querySelector(".replace-btn");
const removeBtn = document.querySelector(".remove-btn");

/* =========================
   CREATE SUCCESS ANIMATION
========================= */
function createSuccessAnimation() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-checkmark';
  successDiv.innerHTML = `
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
    <p style="color: #10b981; font-weight: 600;">Upload Complete!</p>
  `;
  
  const uploaderCard = document.querySelector('.uploader-card');
  uploaderCard.insertBefore(successDiv, actionButtons);
  
  return successDiv;
}

let successAnimation = createSuccessAnimation();

/* =========================
   CREATE LOADING DOTS
========================= */
function createLoadingDots() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-dots';
  loadingDiv.innerHTML = '<span></span><span></span><span></span>';
  
  const uploaderCard = document.querySelector('.uploader-card');
  uploaderCard.insertBefore(loadingDiv, progressWrapper);
  
  return loadingDiv;
}

let loadingDots = createLoadingDots();

/* =========================
   CONSTANTS
========================= */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* =========================
   EVENT LISTENERS - Enhanced
========================= */

// Click to open file dialog with animation
dropZone.addEventListener("click", () => {
  fileInput.click();
  dropZone.classList.add('click-active');
  setTimeout(() => dropZone.classList.remove('click-active'), 300);
});

// File selected via input
fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    handleFile(fileInput.files[0]);
  }
});

// Drag events with enhanced visual feedback
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  
  // Add particles effect on drag over
  if (!dropZone.classList.contains('active')) {
    createParticles(e.clientX, e.clientY);
  }
  
  dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  if (!dropZone.contains(e.relatedTarget)) {
    dropZone.classList.remove("active");
  }
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("active");
  
  // Add drop animation
  dropZone.style.transform = 'scale(0.98)';
  setTimeout(() => dropZone.style.transform = '', 200);
  
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// Replace & Remove with feedback
replaceBtn.addEventListener("click", () => {
  replaceBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Replace Image';
  fileInput.click();
});

removeBtn.addEventListener("click", () => {
  removeImage();
  // Show removal feedback
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f56565;
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    animation: slideInRight 0.3s ease;
    z-index: 1000;
  `;
  notification.innerHTML = '<i class="fas fa-trash"></i> Image removed';
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
});

/* =========================
   PARTICLE EFFECT FUNCTION
========================= */
function createParticles(x, y) {
  const colors = ['#667eea', '#764ba2', '#ed64a6', '#f56565'];
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 6px;
      height: 6px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      left: ${x - 3}px;
      top: ${y - 3}px;
    `;
    
    document.body.appendChild(particle);
    
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    
    particle.animate([
      {
        transform: `translate(0, 0) scale(1)`,
        opacity: 1
      },
      {
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
        opacity: 0
      }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }).onfinish = () => particle.remove();
  }
}

/* =========================
   CORE LOGIC - Enhanced
========================= */
function handleFile(file) {
  resetUI();
  hideSuccessAnimation();
  
  // Show loading state
  loadingDots.style.display = 'block';
  
  setTimeout(() => {
    loadingDots.style.display = 'none';
    
    if (!validateFile(file)) {
      showError("Invalid file type. Please upload JPG, PNG, or GIF.");
      triggerErrorAnimation();
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      showError("File too large. Maximum size is 5MB.");
      triggerErrorAnimation();
      return;
    }
    
    showFileInfo(file);
    simulateUpload(file);
  }, 800); // Simulate validation delay
}

/* =========================
   VALIDATION
========================= */
function validateFile(file) {
  return ALLOWED_TYPES.includes(file.type);
}

/* =========================
   ERROR ANIMATION
========================= */
function triggerErrorAnimation() {
  dropZone.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' }
  ], {
    duration: 300,
    easing: 'ease-in-out'
  });
}

/* =========================
   UI HANDLERS - Enhanced
========================= */
function showError(message) {
  errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  errorMessage.style.display = "block";
  
  // Auto-hide error after 5 seconds
  setTimeout(() => {
    errorMessage.style.opacity = '0';
    errorMessage.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      errorMessage.style.display = 'none';
      errorMessage.style.opacity = '';
      errorMessage.style.transform = '';
    }, 300);
  }, 5000);
}

function showFileInfo(file) {
  fileNameEl.textContent = truncateFileName(file.name, 30);
  fileSizeEl.textContent = formatFileSize(file.size);
  
  // Add file type icon
  const fileType = file.type.split('/')[1];
  const icon = fileType === 'png' ? '🖼️' : fileType === 'jpeg' ? '📷' : '🎨';
  fileNameEl.innerHTML = `${icon} ${fileNameEl.textContent}`;
  
  fileInfo.style.display = "flex";
  fileInfo.style.animation = 'slideIn 0.5s ease forwards';
}

function hideSuccessAnimation() {
  successAnimation.style.display = 'none';
}

function resetUI() {
  errorMessage.style.display = "none";
  fileInfo.style.display = "none";
  progressWrapper.style.display = "none";
  previewContainer.style.display = "none";
  actionButtons.style.display = "none";
  successAnimation.style.display = 'none';
  
  progressFill.style.width = "0%";
  progressPercent.textContent = "0%";
}

/* =========================
   UPLOAD SIMULATION - Enhanced
========================= */
function simulateUpload(file) {
  let progress = 0;
  progressWrapper.style.display = "block";
  
  // Add upload start animation
  progressWrapper.style.animation = 'fadeIn 0.5s ease';
  
  const uploadInterval = setInterval(() => {
    // Simulate realistic upload speed
    const increment = Math.min(
      Math.floor(Math.random() * 15) + 3,
      100 - progress
    );
    progress += increment;
    
    // Add subtle bounce effect at certain percentages
    if (progress % 25 === 0) {
      progressPercent.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
      ], { duration: 300, easing: 'ease-out' });
    }
    
    progressFill.style.width = progress + "%";
    progressPercent.textContent = progress + "%";
    
    if (progress >= 100) {
      clearInterval(uploadInterval);
      progress = 100;
      progressFill.style.width = "100%";
      progressPercent.textContent = "100%";
      
      // Add completion animation
      setTimeout(() => {
        progressFill.style.background = '#4ade80';
        showPreview(file);
        showSuccessAnimation();
      }, 500);
    }
  }, 150 + Math.random() * 150); // Variable speed for realism
}

/* =========================
   IMAGE PREVIEW - Enhanced
========================= */
function showPreview(file) {
  const reader = new FileReader();
  
  reader.onloadstart = () => {
    previewContainer.style.display = "block";
    previewContainer.style.opacity = "0.5";
  };
  
  reader.onload = () => {
    previewImage.src = reader.result;
    previewContainer.style.opacity = "1";
    previewContainer.style.animation = 'popIn 0.6s ease forwards';
    
    // Add lazy loading effect
    previewImage.style.opacity = '0';
    setTimeout(() => {
      previewImage.style.transition = 'opacity 0.5s ease';
      previewImage.style.opacity = '1';
    }, 300);
    
    actionButtons.style.display = "flex";
    
    saveToLocalStorage(reader.result);
  };
  
  reader.onerror = () => {
    showError("Failed to load image preview.");
  };
  
  reader.readAsDataURL(file);
}

/* =========================
   SUCCESS ANIMATION
========================= */
function showSuccessAnimation() {
  successAnimation.style.display = 'block';
  
  // Auto-hide success animation after 3 seconds
  setTimeout(() => {
    successAnimation.style.opacity = '0';
    successAnimation.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      successAnimation.style.display = 'none';
      successAnimation.style.opacity = '';
      successAnimation.style.transform = '';
    }, 500);
  }, 3000);
}

/* =========================
   LOCAL STORAGE - Enhanced
========================= */
function saveToLocalStorage(imageData) {
  try {
    localStorage.setItem("uploadedImage", imageData);
    localStorage.setItem("uploadTimestamp", new Date().toISOString());
  } catch (e) {
    console.warn("Local storage is full or not available");
  }
}

function loadFromLocalStorage() {
  const savedImage = localStorage.getItem("uploadedImage");
  if (savedImage) {
    const timestamp = localStorage.getItem("uploadTimestamp");
    const uploadTime = timestamp ? new Date(timestamp).toLocaleString() : 'Previously';
    
    previewImage.src = savedImage;
    previewContainer.style.display = "block";
    actionButtons.style.display = "flex";
    
    // Add loaded from storage indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      text-align: center;
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 10px;
      font-style: italic;
    `;
    indicator.textContent = `Loaded from storage (${uploadTime})`;
    previewContainer.appendChild(indicator);
  }
}

function removeImage() {
  localStorage.removeItem("uploadedImage");
  localStorage.removeItem("uploadTimestamp");
  previewContainer.style.display = "none";
  actionButtons.style.display = "none";
  fileInput.value = "";
  resetUI();
}

/* =========================
   HELPER FUNCTIONS - Enhanced
========================= */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function truncateFileName(name, maxLength) {
  if (name.length <= maxLength) return name;
  const extension = name.split('.').pop();
  const nameWithoutExt = name.slice(0, -(extension.length + 1));
  const truncated = nameWithoutExt.slice(0, maxLength - extension.length - 3);
  return `${truncated}...${extension}`;
}

/* =========================
   INITIALIZATION - Enhanced
========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Add page load animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
    loadFromLocalStorage();
  }, 100);
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      removeImage();
    }
    if (e.key === 'r' && e.ctrlKey) {
      fileInput.click();
    }
  });
});

// Add custom styles for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .click-active {
    animation: clickPulse 0.3s ease;
  }
  
  @keyframes clickPulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.98); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);