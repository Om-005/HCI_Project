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
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            const loginBtn = document.getElementById('login-btn');
            const loginModal = document.getElementById('login-modal');
            const modalCloseBtn = document.getElementById('modal-close-btn');

            

            function renderVideos(videos) {
                resultsGrid.innerHTML = '';
                resultsCount.textContent = videos.length;
                if (videos.length === 0) {
                    resultsGrid.innerHTML = `<p id="loader">No videos found matching your criteria.</p>`;
                    return;
                }
                videos.forEach(video => {
                    const videoCard = `
                        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" style="text-decoration: none; color: inherit;">
                            <div class="video-card card-hover-effect">
                                <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" onerror="this.onerror=null;this.src='https://placehold.co/400x225/7f1d1d/ffffff?text=Error';">
                                <div class="video-card-content">
                                    <h3>${video.snippet.title}</h3>
                                    <p class="channel-name">${video.snippet.channelTitle}</p>
                                    <div class="meta-info">
                                        <span>${new Date(video.snippet.publishTime).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    `;
                    resultsGrid.innerHTML += videoCard;
                });
            }
            
           async function performSearch(query) {
    if (!query.trim()) return;

    searchQueryDisplay.textContent = query;
    homepageContent.classList.add('section-hidden');
    searchResultsSection.classList.remove('section-hidden');
    window.scrollTo(0, 0);
    resultsGrid.innerHTML = `<p id="loader">Searching for videos...</p>`;

    const url = `http://localhost:5000/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        renderVideos(data.items);
    } catch (error) {
        console.error('Failed to fetch from YouTube API:', error);
        resultsGrid.innerHTML = `<p id="loader">Failed to load videos. Please check the console for errors.</p>`;
    }
}

            
            function showHomepage() {
                homepageContent.classList.remove('section-hidden');
                searchResultsSection.classList.add('section-hidden');
                searchInput.value = '';
            }

            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                performSearch(searchInput.value);
            });
            
            document.querySelectorAll('.trending-search-btn, .category-card').forEach(button => {
                button.addEventListener('click', (e) => {
                    const query = e.currentTarget.dataset.category || e.currentTarget.dataset.channel || e.currentTarget.textContent;
                    searchInput.value = query;
                    performSearch(query);
                });
            });

            backToHomeBtn.addEventListener('click', showHomepage);
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                showHomepage();
            });

            // Dark Mode Toggle
            darkModeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    darkModeToggle.innerHTML = '<span>☀️</span>';
                } else {
                    darkModeToggle.innerHTML = '<span>🌙</span>';
                }
            });

            // Login Modal Logic
            loginBtn.addEventListener('click', () => {
                loginModal.classList.add('visible');
            });

            modalCloseBtn.addEventListener('click', () => {
                loginModal.classList.remove('visible');
            });

            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.classList.remove('visible');
                }
            });

            document.getElementById('login-form').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Login functionality is for demonstration only.');
                loginModal.classList.remove('visible');
            });

        });
