const sliderImages = Array.from(document.querySelectorAll('.slider-container img'));
const slidesCount = sliderImages.length;
let currentSlide = 1;
let autoplayInterval = null;
let isPlaying = true;
const slideNumberElement = document.getElementById('slide-number');
const slideNumberTop = document.getElementById('slide-number-top');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const playPauseButton = document.getElementById('play-pause');
const sliderContainer = document.querySelector('.slider-container');
const nextArrow = document.querySelector('.next-arrow');
const prevArrow = document.querySelector('.prev-arrow');

// إنشاء الـ Pagination
const paginationElement = document.createElement('ul');
paginationElement.id = 'pagination-ul';
for (let i = 1; i <= slidesCount; i++) {
    const paginationItem = document.createElement('li');
    paginationItem.dataset.index = i;
    paginationItem.textContent = i;
    paginationElement.appendChild(paginationItem);
}
document.getElementById('indicators').appendChild(paginationElement);
const paginationsBullets = Array.from(paginationElement.children);

// إنشاء المصغرات
const thumbnailsContainer = document.getElementById('thumbnails');
sliderImages.forEach((img, index) => {
    const thumb = document.createElement('img');
    thumb.src = img.src;
    thumb.dataset.index = index + 1;
    if(index === 0) thumb.classList.add('active');
    thumbnailsContainer.appendChild(thumb);
});
const thumbnailImages = Array.from(thumbnailsContainer.children);

// الأحداث
nextButton.onclick = nextSlide;
prevButton.onclick = prevSlide;
nextArrow.onclick = nextSlide;
prevArrow.onclick = prevSlide;
playPauseButton.onclick = toggleAutoplay;

paginationElement.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        currentSlide = parseInt(e.target.dataset.index);
        theChecker();
        resetAutoplay();
    }
});

thumbnailsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        currentSlide = parseInt(e.target.dataset.index);
        theChecker();
        resetAutoplay();
    }
});

// دعم السحب باللمس
let touchStartX = 0;
let touchEndX = 0;
sliderContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
sliderContainer.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) { nextSlide(); }
    if (touchEndX > touchStartX + swipeThreshold) { prevSlide(); }
    resetAutoplay();
}

// دعم الكيبورد
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') nextSlide();
    if(e.key === 'ArrowLeft') prevSlide();
    resetAutoplay();
});

function nextSlide() {
    if (currentSlide === slidesCount) { currentSlide = 1; }
    else { currentSlide++; }
    theChecker();
}
function prevSlide() {
    if (currentSlide === 1) { currentSlide = slidesCount; }
    else { currentSlide--; }
    theChecker();
}

function theChecker() {
    slideNumberElement.textContent = `${currentSlide.toString().padStart(2,'0')} / ${slidesCount}`;
    slideNumberTop.textContent = `Slide ${currentSlide} / ${slidesCount}`;
    removeAllActive();
    sliderImages[currentSlide - 1].classList.add('active');
    paginationsBullets[currentSlide - 1].classList.add('active');
    thumbnailImages[currentSlide - 1].classList.add('active');
}

function removeAllActive() {
    sliderImages.forEach(img => img.classList.remove('active'));
    paginationsBullets.forEach(bullet => bullet.classList.remove('active'));
    thumbnailImages.forEach(thumb => thumb.classList.remove('active'));
}

// Autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000);
    isPlaying = true;
    playPauseButton.textContent = 'Pause';
}
function stopAutoplay() {
    clearInterval(autoplayInterval);
    isPlaying = false;
    playPauseButton.textContent = 'Play';
}
function toggleAutoplay() { isPlaying? stopAutoplay() : startAutoplay(); }
function resetAutoplay() { if (isPlaying) { stopAutoplay(); startAutoplay(); } }

sliderContainer.addEventListener('mouseenter', stopAutoplay);
sliderContainer.addEventListener('mouseleave', () => { if (isPlaying) startAutoplay(); });

theChecker();
startAutoplay();