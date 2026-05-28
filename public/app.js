document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const homepageContent = document.getElementById('homepage-content');
    const searchResultsSection = document.getElementById('search-results-section');
    const resultsGrid = document.getElementById('results-grid');
    const searchQueryDisplay = document.getElementById('search-query-display');
    const resultsCount = document.getElementById('results-count');
    const backToHomeBtn = document.getElementById('back-to-home');
    const homeLink = document.getElementById('home-link');
    const footerHomeLink = document.getElementById('footer-home-link');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const ctaSearchBtn = document.getElementById('cta-search-btn');

    function renderVideos(videos) {
        resultsGrid.innerHTML = '';
        resultsCount.textContent = videos.length;

        if (videos.length === 0) {
            resultsGrid.innerHTML = `
                <div id="loader">
                    <p>No videos found for this search. Try a different topic.</p>
                </div>`;
            return;
        }

        videos.forEach(video => {
            const date = new Date(video.snippet.publishTime).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            const card = document.createElement('a');
            card.href = `https://www.youtube.com/watch?v=${video.id.videoId}`;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';
            card.innerHTML = `
                <div class="video-card">
                    <div class="video-thumb-wrap">
                        <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" loading="lazy" onerror="this.src='https://placehold.co/480x270/0f1f38/4da3ff?text=No+Thumbnail'">
                        <div class="video-play-overlay">
                            <div class="video-play-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="video-card-body">
                        <p class="video-title">${video.snippet.title}</p>
                        <p class="video-channel">${video.snippet.channelTitle}</p>
                        <p class="video-date">${date}</p>
                    </div>
                </div>`;
            resultsGrid.appendChild(card);
        });
    }

    async function performSearch(query) {
        if (!query.trim()) return;

        searchQueryDisplay.textContent = `"${query}"`;
        homepageContent.classList.add('section-hidden');
        searchResultsSection.classList.remove('section-hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        resultsGrid.innerHTML = `
            <div id="loader">
                <div class="loader-spinner"></div>
                <p>Finding lectures on "${query}"...</p>
            </div>`;

        const url = `https://hci-project-3pg4.onrender.com/search?q=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            renderVideos(data.items || []);
        } catch (error) {
            console.error('Search failed:', error);
            resultsGrid.innerHTML = `
                <div id="loader">
                    <p>Failed to load videos. Please try again.</p>
                </div>`;
        }
    }

    function showHomepage() {
        homepageContent.classList.remove('section-hidden');
        searchResultsSection.classList.add('section-hidden');
        searchInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value);
    });

    document.querySelectorAll('.trending-search-btn, .category-card').forEach(el => {
        el.addEventListener('click', (e) => {
            const query = e.currentTarget.dataset.category
                || e.currentTarget.dataset.channel
                || e.currentTarget.textContent.trim();
            searchInput.value = query;
            performSearch(query);
        });
    });

    document.querySelectorAll('.channel-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const channelName = card.dataset.channel;
            if (channelName && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                searchInput.value = channelName;
                performSearch(channelName);
            }
        });
    });

    backToHomeBtn.addEventListener('click', showHomepage);

    [homeLink, footerHomeLink].forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showHomepage();
            });
        }
    });

    if (ctaSearchBtn) {
        ctaSearchBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => searchInput.focus(), 600);
        });
    }

    // Theme toggle — light/dark
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

    // Header scroll effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.borderBottomColor = 'var(--border)';
        } else {
            header.style.borderBottomColor = 'transparent';
        }
    }, { passive: true });

    // Modal
    loginBtn.addEventListener('click', () => loginModal.classList.add('visible'));
    modalCloseBtn.addEventListener('click', () => loginModal.classList.remove('visible'));
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.classList.remove('visible');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') loginModal.classList.remove('visible');
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login is for demonstration only.');
        loginModal.classList.remove('visible');
    });
});
