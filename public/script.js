document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileNavPanel = document.getElementById('mobileNavPanel');

    mobileMenuButton.addEventListener('click', () => {
        mobileNavPanel.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    mobileNavPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavPanel.classList.remove('open');
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (event) => {
        if (!mobileNavPanel.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileNavPanel.classList.remove('open');
        }
    });

    // --- Mouse Motion Tracking Effect ---
    const root = document.documentElement; // Get the root HTML element
    window.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to the center of the viewport
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Map mouse position to a smaller offset range (e.g., -20px to 20px)
        // Adjust the divisor (e.g., 20) to control sensitivity
        const offsetX = (mouseX / centerX) * 20; // Max 20px offset
        const offsetY = (mouseY / centerY) * 20; // Max 20px offset

        root.style.setProperty('--mouse-x-offset', `${offsetX}px`);
        root.style.setProperty('--mouse-y-offset', `${offsetY}px`);
    });

    // --- Dynamic Typing Effect for Hero Title ---
    const dynamicTitleTextElement = document.getElementById('dynamic-title-text');
    const titlePhrases = [
        "Profitable Domain",
        "Online Empire",
        "Startup Idea",
        "Digital Future",
        "Next Big Brand"
    ];
    let titlePhraseIndex = 0;
    let titleCharIndex = 0;
    let isTitleDeleting = false;

    function typeDynamicTitleText() {
        const currentPhrase = titlePhrases[titlePhraseIndex];
        if (isTitleDeleting) {
            dynamicTitleTextElement.textContent = currentPhrase.substring(0, titleCharIndex - 1);
            titleCharIndex--;
            if (titleCharIndex === 0) {
                isTitleDeleting = false;
                titlePhraseIndex = (titlePhraseIndex + 1) % titlePhrases.length;
                setTimeout(typeDynamicTitleText, 700); // Pause before typing next
            } else {
                setTimeout(typeDynamicTitleText, 30); // Deleting speed
            }
        } else {
            dynamicTitleTextElement.textContent = currentPhrase.substring(0, titleCharIndex + 1);
            titleCharIndex++;
            if (titleCharIndex === currentPhrase.length) {
                isTitleDeleting = true;
                setTimeout(typeDynamicTitleText, 2000); // Pause after typing
            } else {
                setTimeout(typeDynamicTitleText, 50); // Typing speed
            }
        }
    }

    // --- Dynamic Typing Effect for Hero Subtitle and Search Input Placeholder ---
    const dynamicSubtitleTextElement = document.getElementById('dynamic-subtitle-text');
    const keywordInput = document.getElementById('keywordInput'); // Get the keyword input element

    const subtitleData = [
        {
            text: "Leverage cutting-edge AI and comprehensive SEO data to find, analyze, and flip high-value domain names effortlessly.",
            placeholder: "e.g., AI domain analysis"
        },
        {
            text: "Discover hidden gems and capitalize on emerging market trends with smart AI insights.",
            placeholder: "e.g., emerging tech trends"
        },
        {
            text: "Get detailed SEO metrics, brandability scores, and market valuation for every domain.",
            placeholder: "e.g., SEO metrics, brandability"
        }
    ];
    let subtitlePhraseIndex = 0;
    let subtitleCharIndex = 0;
    let isSubtitleDeleting = false;

    function typeDynamicSubtitleText() {
        const currentData = subtitleData[subtitlePhraseIndex];
        if (isSubtitleDeleting) {
            dynamicSubtitleTextElement.textContent = currentData.text.substring(0, subtitleCharIndex - 1);
            subtitleCharIndex--;
            if (subtitleCharIndex === 0) {
                isSubtitleDeleting = false;
                subtitlePhraseIndex = (subtitlePhraseIndex + 1) % subtitleData.length;
                // Update placeholder immediately when starting to type the next subtitle
                keywordInput.placeholder = subtitleData[subtitlePhraseIndex].placeholder;
                setTimeout(typeDynamicSubtitleText, 700); // Pause before typing next
            } else {
                setTimeout(typeDynamicSubtitleText, 30); // Deleting speed
            }
        } else {
            dynamicSubtitleTextElement.textContent = currentData.text.substring(0, subtitleCharIndex + 1);
            subtitleCharIndex++;
            if (subtitleCharIndex === currentData.text.length) {
                isSubtitleDeleting = true;
                setTimeout(typeDynamicSubtitleText, 2000); // Pause after typing
            } else {
                setTimeout(typeDynamicSubtitleText, 50); // Typing speed
            }
        }
    }

    // Start the typing animations
    typeDynamicTitleText();
    typeDynamicSubtitleText();
    // Set initial placeholder
    keywordInput.placeholder = subtitleData[0].placeholder;


    // Initialize Firebase (replace with your config)
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY", // Replace with your Firebase API Key
        authDomain: "YOUR_AUTH_DOMAIN", // Replace with your Firebase Auth Domain
        projectId: "YOUR_PROJECT_ID", // Replace with your Firebase Project ID
        storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your Firebase Storage Bucket
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Firebase Messaging Sender ID
        appId: "YOUR_APP_ID" // Replace with your Firebase App ID
    };
    // Check if firebase is already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    // DOM Elements (update IDs as per new HTML if needed, or map them)
    const domainTypeRadios = document.querySelectorAll('input[name="domainType"]');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeBtnText = document.getElementById('analyzeBtnText');
    const analyzeBtnSpinner = document.getElementById('analyzeBtnSpinner');
    const domainResultsDiv = document.getElementById('domainResults');
    const searchLimitMessage = document.getElementById('searchLimitMessage');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const resultsSection = document.getElementById('resultsSection');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Auth Controls
    const authControlsAnon = document.getElementById('authControlsAnon');
    const authControlsUser = document.getElementById('authControlsUser');
    const userAvatar = document.getElementById('userAvatar');

    // Progress Bar Elements
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBarFill = document.getElementById('progressBarFill');

    // More Info Modal Elements
    const moreInfoModal = document.getElementById('moreInfoModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const modalDomainName = document.getElementById('modalDomainName');
    const modalUseCase = document.getElementById('modalUseCase');
    const modalFlipScore = document.getElementById('modalFlipScore');
    const modalAvailability = document.getElementById('modalAvailability');
    const modalEstimatedValue = document.getElementById('modalEstimatedValue');
    const modalSearchVolume = document.getElementById('modalSearchVolume');
    const modalSeoDifficulty = document.getElementById('modalSeoDifficulty');
    const modalBrandability = document.getElementById('modalBrandability');
    const modalDomainAge = document.getElementById('modalDomainAge');
    const modalAffiliateLink = document.getElementById('modalAffiliateLink');

    // Login/Signup Modal Elements
    const authModal = document.getElementById('authModal');
    const closeAuthModalButton = document.getElementById('closeAuthModalButton');
    const authForm = document.getElementById('authForm');
    const authEmailInput = document.getElementById('authEmail');
    const authPasswordInput = document.getElementById('authPassword');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');
    const authMessage = document.getElementById('authMessage');


    let currentUser = null; // To store Firebase user object
    let userPlan = 'free'; // 'free', 'logged_in', 'pro'
    let dailySearches = 0;
    let currentDomainsData = []; // Store the full domain data for modal access

    // Function to update UI based on user status and plan
    function updateUI() {
        if (currentUser) {
            authControlsAnon.style.display = 'none';
            authControlsUser.style.display = 'flex'; // Show user controls
            mobileLoginBtn.style.display = 'none';
            mobileLogoutBtn.style.display = 'inline-flex';
            if (userAvatar) {
                // You might want to update the avatar image if the user has one
                // userAvatar.src = currentUser.photoURL || 'https://placehold.co/40x40/805AD5/FFFFFF?text=User';
            }

            // In a real app, fetch user's plan and daily searches from backend
            // This part assumes you have a backend API endpoint '/api/user-status'
            // For now, let's mock it for logged-in users
            userPlan = 'logged_in'; // Assume logged-in users get a higher tier
            dailySearches = 0; // Reset for demo, or fetch from backend if implemented
            updateSearchLimitMessage();
            // Assuming 'pro' status would be fetched from backend
            // if (userPlan === 'pro') {
            //     downloadPdfBtn.style.display = 'block';
            // } else {
            //     downloadPdfBtn.style.display = 'none';
            // }
            downloadPdfBtn.style.display = 'none'; // Keep hidden until Pro plan is implemented via backend
            
        } else {
            authControlsAnon.style.display = 'flex'; // Show anon controls
            authControlsUser.style.display = 'none'; // Hide user controls
            mobileLoginBtn.style.display = 'inline-flex';
            mobileLogoutBtn.style.display = 'none';
            userPlan = 'free';
            dailySearches = 0; // Reset for unauthenticated users
            updateSearchLimitMessage();
            downloadPdfBtn.style.display = 'none';
        }
    }

    function updateSearchLimitMessage() {
        let maxSearches;
        if (userPlan === 'free') maxSearches = 5;
        else if (userPlan === 'logged_in') maxSearches = 10; // Assuming 'logged_in' is a plan tier
        else maxSearches = 'Unlimited'; // For 'pro'

        if (searchLimitMessage) {
            if (maxSearches === 'Unlimited') {
                searchLimitMessage.textContent = `You have Unlimited searches (Pro Plan).`;
                analyzeBtn.disabled = false;
            } else {
                const remaining = maxSearches - dailySearches;
                searchLimitMessage.textContent = `You have ${remaining} / ${maxSearches} searches remaining today.`;
                analyzeBtn.disabled = remaining <= 0;
            }
        }
    }

    // Firebase Auth State Listener
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateUI();
    });

    // --- Authentication Modal Functions ---
    function openAuthModal() {
        authModal.style.display = 'flex'; // Show the modal container
        setTimeout(() => authModal.classList.add('open'), 10); // Add class to trigger transition
        authMessage.textContent = ''; // Clear previous messages
        authEmailInput.value = ''; // Clear input fields
        authPasswordInput.value = '';
    }

    function closeAuthModal() {
        authModal.classList.remove('open');
        setTimeout(() => { authModal.style.display = 'none'; }, 300); // Hide after transition
        authMessage.textContent = ''; // Clear message on close
    }

    function displayAuthMessage(message, isError = false) {
        authMessage.textContent = message;
        authMessage.className = 'auth-message'; // Reset classes
        if (isError) {
            authMessage.classList.add('error');
        } else {
            authMessage.classList.add('success');
        }
    }

    // Event listeners for opening auth modal
    [loginBtn, mobileLoginBtn].forEach(btn => {
        btn.addEventListener('click', openAuthModal);
    });

    // Event listener for closing auth modal
    closeAuthModalButton.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (event) => {
        if (event.target === authModal) { // Clicked on the backdrop
            closeAuthModal();
        }
    });

    // Login Form Submission
    loginSubmitBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const email = authEmailInput.value;
        const password = authPasswordInput.value;

        if (!email || !password) {
            displayAuthMessage("Please enter both email and password.", true);
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
            displayAuthMessage("Logged in successfully!", false);
            setTimeout(closeAuthModal, 1500); // Close modal after success
        } catch (error) {
            console.error("Login Error:", error);
            displayAuthMessage(`Login failed: ${error.message}`, true);
        }
    });

    // Signup Form Submission
    signupSubmitBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const email = authEmailInput.value;
        const password = authPasswordInput.value;

        if (!email || !password) {
            displayAuthMessage("Please enter both email and password.", true);
            return;
        }
        if (password.length < 6) {
            displayAuthMessage("Password should be at least 6 characters.", true);
            return;
        }

        try {
            await auth.createUserWithEmailAndPassword(email, password);
            displayAuthMessage("Account created and logged in!", false);
            setTimeout(closeAuthModal, 1500); // Close modal after success
        } catch (error) {
            console.error("Signup Error:", error);
            displayAuthMessage(`Signup failed: ${error.message}`, true);
        }
    });


    // Logout Button Click (Desktop & Mobile)
    [logoutBtn, mobileLogoutBtn].forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                console.log("Logged out successfully!");
                updateUI(); // Update UI immediately after logout
            } catch (error) {
                console.error("Logout Error:", error.message);
                // Potentially display a temporary message on the main page if logout fails
            }
        });
    });


    // Function to open the More Info Modal
    function openMoreInfoModal(domainData) {
        modalDomainName.textContent = domainData.name;
        modalUseCase.textContent = domainData.use_case || 'N/A';
        modalFlipScore.textContent = domainData.flip_score || 'N/A';
        modalAvailability.textContent = domainData.available ? 'Available' : 'Taken';
        modalAvailability.style.color = domainData.available ? 'var(--accent-green)' : 'var(--accent-red)';
        modalEstimatedValue.textContent = domainData.estimated_value || 'N/A';
        modalSearchVolume.textContent = domainData.search_volume || 'N/A';
        modalSeoDifficulty.textContent = domainData.seo_difficulty || 'N/A';
        modalBrandability.textContent = domainData.brandability || 'N/A';
        modalDomainAge.textContent = domainData.domain_age || 'N/A';
        
        modalAffiliateLink.href = domainData.affiliate_link || '#';
        if (domainData.available) {
            modalAffiliateLink.style.display = 'inline-flex'; // Show buy button if available
        } else {
            modalAffiliateLink.style.display = 'none'; // Hide if not available
        }

        moreInfoModal.style.display = 'flex'; // Show the modal container
        // Add a class to trigger CSS transition
        setTimeout(() => moreInfoModal.classList.add('open'), 10); 
    }

    // Function to close the More Info Modal
    function closeMoreInfoModal() {
        moreInfoModal.classList.remove('open');
        // Hide the modal after transition completes
        setTimeout(() => { moreInfoModal.style.display = 'none'; }, 300); 
    }

    // Event listener for closing modal
    closeModalButton.addEventListener('click', closeMoreInfoModal);
    // Close modal if clicked outside the content
    moreInfoModal.addEventListener('click', (event) => {
        if (event.target === moreInfoModal) {
            closeMoreInfoModal();
        }
    });


    // Analyze Button Click
    analyzeBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const keyword = keywordInput.value.trim();
        if (!keyword) {
            console.warn("Please enter a keyword.");
            // Display a custom message box instead of alert
            return;
        }

        const domainType = Array.from(domainTypeRadios).find(radio => radio.checked).value;

        // Check user plan and limits (client-side check for immediate feedback)
        if (userPlan !== 'pro') {
            if (userPlan === 'free' && dailySearches >= 5) {
                console.warn("You have reached your daily search limit. Please log in or upgrade to Pro for more searches.");
                // Display a custom message box
                return;
            }
            if (userPlan === 'logged_in' && dailySearches >= 10) {
                console.warn("You have reached your daily search limit. Please upgrade to Pro for unlimited searches.");
                // Display a custom message box
                return;
            }
        }

        // Show loading indicator and progress bar
        analyzeBtnText.style.display = 'none';
        analyzeBtnSpinner.style.display = 'block';
        analyzeBtn.disabled = true;
        domainResultsDiv.innerHTML = ''; // Clear previous results
        resultsSection.style.display = 'none';
        noResultsMessage.style.display = 'none';

        progressBarContainer.style.display = 'block'; // Show the progress bar container
        progressBarFill.style.width = '0%'; // Reset progress bar fill

        // Animate progress bar to 50% immediately to indicate start
        setTimeout(() => {
            progressBarFill.style.width = '50%';
        }, 100);


        try {
            let headers = {
                'Content-Type': 'application/json'
            };
            if (currentUser) {
                const token = await currentUser.getIdToken();
                headers['Authorization'] = `Bearer ${token}`;
            }

            // --- Fetch call to your Flask Backend API ---
            const response = await fetch('http://127.0.0.1:5000/api/analyze-domain', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ keyword: keyword, domainType: domainType })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze domains from backend.');
            }

            const data = await response.json();
            currentDomainsData = data.domains; // Store the full data

            if (currentDomainsData && currentDomainsData.length > 0) {
                resultsSection.style.display = 'block';
                currentDomainsData.forEach((domain, index) => {
                    const domainCard = document.createElement('article'); // Changed to article for semantic HTML
                    domainCard.classList.add('domain-card');
                    
                    // Store index for easy lookup in modal
                    domainCard.dataset.domainIndex = index; 

                    // Ensure boolean 'available' is handled correctly for display
                    const isAvailable = domain.available ? 'Available' : 'Taken';
                    const availableColor = domain.available ? 'var(--accent-green)' : 'var(--accent-red)';
                    const availableBg = domain.available ? 'rgba(56, 161, 105, 0.15)' : 'rgba(229, 62, 62, 0.15)';
                    const availableBorder = domain.available ? 'rgba(56, 161, 105, 0.4)' : 'rgba(229, 62, 62, 0.4)';

                    domainCard.innerHTML = `
                        <div class="card-header">
                            <h3 class="domain-name">${domain.name}</h3>
                            <span class="available-badge" style="color:${availableColor}; border-color:${availableBorder}; background-color:${availableBg};">${isAvailable}</span>
                        </div>
                        <p class="domain-use-case">${domain.use_case || 'No specific use case provided.'}</p>
                        <div class="flip-score-wrapper">
                            <p class="flip-score">${domain.flip_score || 'N/A'}</p>
                            <p class="flip-score-label">Flip Score</p>
                        </div>
                        <button class="more-info-button">More Info <i class="fas fa-arrow-right"></i></button>
                    `;
                    domainResultsDiv.appendChild(domainCard);
                });

                // Add event listeners for "More Info" buttons
                domainResultsDiv.querySelectorAll('.domain-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        // Check if the click was on the buy button or its icon, to prevent modal opening
                        if (e.target.closest('.buy-button')) {
                            return; 
                        }
                        const index = parseInt(card.dataset.domainIndex);
                        if (!isNaN(index) && currentDomainsData[index]) {
                            openMoreInfoModal(currentDomainsData[index]);
                        }
                    });
                });

                // Update daily searches based on backend response (if backend sends it)
                // If your backend doesn't send this, you'll need a separate API call for limits
                if (data.daily_searches_after_request !== undefined) {
                    dailySearches = data.daily_searches_after_request;
                }
            } else {
                resultsSection.style.display = 'block'; // Still show section, but with no results message
                noResultsMessage.style.display = 'block';
                noResultsMessage.textContent = "No suitable domains found for your search. Try a different keyword or domain type!";
            }
            // Animate progress bar to 100% on success
            progressBarFill.style.width = '100%';

        } catch (error) {
            console.error("Error during domain analysis:", error);
            resultsSection.style.display = 'block'; // Show section even on error
            noResultsMessage.style.display = 'block';
            noResultsMessage.textContent = "Error fetching domains. Please try again later. " + error.message;
            // Animate progress bar to 100% on error (or reset it)
            progressBarFill.style.width = '100%';
        } finally {
            // Hide loading indicator and progress bar after a short delay
            setTimeout(() => {
                analyzeBtnText.style.display = 'block';
                analyzeBtnSpinner.style.display = 'none';
                analyzeBtn.disabled = false; // Re-enable button after request (even if limited)
                progressBarContainer.style.display = 'none'; // Hide the progress bar container
                progressBarFill.style.width = '0%'; // Reset for next use
                updateSearchLimitMessage(); // Re-check limits
            }, 500); // Short delay to allow progress bar animation to complete
        }
    });

    // Download PDF Button Logic (Requires jsPDF)
    downloadPdfBtn.addEventListener('click', () => {
        if (userPlan !== 'pro') {
            console.warn("This feature is available only for Pro Plan users. Please upgrade to download PDF reports.");
            // Display a custom message box
            return;
        }

        const doc = new window.jspdf.jsPDF();
        let yPos = 10;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 10;
        const lineHeight = 7; // Approximate line height

        doc.setFontSize(22);
        doc.text("Domain Analysis Report", margin, yPos);
        yPos += 15;

        doc.setFontSize(12);
        const keyword = keywordInput.value.trim();
        doc.text(`Keyword: ${keyword}`, margin, yPos);
        yPos += lineHeight;
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 15;

        // Use currentDomainsData for PDF generation
        if (currentDomainsData.length === 0) {
            doc.text("No domains found for this report.", margin, yPos);
        } else {
            currentDomainsData.forEach((domain, index) => {
                if (yPos + 70 > pageHeight - margin) { // Check if new page is needed (approx height of a card section)
                    doc.addPage();
                    yPos = margin;
                }

                doc.setFontSize(16);
                doc.text(`${index + 1}. ${domain.name}`, margin, yPos);
                yPos += lineHeight * 1.5;

                doc.setFontSize(10);
                doc.text(`Availability: ${domain.available ? 'Available' : 'Taken'}`, margin + 5, yPos);
                yPos += lineHeight;
                doc.text(`Flip Score: ${domain.flip_score || 'N/A'}`, margin + 5, yPos);
                yPos += lineHeight;
                doc.text(`Use Case: ${domain.use_case || 'N/A'}`, margin + 5, yPos);
                yPos += lineHeight;
                doc.text(`Estimated Value: ${domain.estimated_value || 'N/A'}`, margin + 5, yPos); yPos += lineHeight;
                doc.text(`Search Volume: ${domain.search_volume || 'N/A'}`, margin + 5, yPos); yPos += lineHeight;
                doc.text(`SEO Difficulty: ${domain.seo_difficulty || 'N/A'}`, margin + 5, yPos); yPos += lineHeight;
                doc.text(`Brandability: ${domain.brandability || 'N/A'}`, margin + 5, yPos); yPos += lineHeight;
                doc.text(`Domain Age: ${domain.domain_age || 'N/A'}`, margin + 5, yPos); yPos += lineHeight;
                doc.text(`Affiliate Link: ${domain.affiliate_link || 'N/A'}`, margin + 5, yPos); yPos += lineHeight;
                
                yPos += 10; // Space between domain entries
            });
        }
        
        doc.save(`DomainFlipAI_Report_${keyword}.pdf`);
        console.log("PDF report downloaded!");
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
