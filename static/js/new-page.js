function showCategories() {
    document.getElementById('new-page').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden'); // Ensure game page is hidden
    document.getElementById('categories-page').classList.remove('hidden');
}

function showLotr() {
    startGame('lotr');
}

function showMarvel() {
    startGame('marvel');
}

function showLegends() {
    startGame('legends');
}

function showCollection() {
    document.getElementById('new-page').classList.add('hidden');
    document.getElementById('collection-page').classList.remove('hidden');
    const container = document.getElementById('collection-container');
    container.innerHTML = '';
    userImages.forEach(image => {
        const img = document.createElement('img');
        img.src = `../static/images/${image}`;
        img.alt = image;
        img.onclick = () => showImageModal(img.src); // Add click event to show modal
        container.appendChild(img);
    });
}

function showImageModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = modal.querySelector('img');
    modalImg.src = src;
    modal.style.display = 'block';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

function showHowToPlay() {
    document.getElementById('new-page').classList.add('hidden');
    document.getElementById('how-to-play-page').classList.remove('hidden');
}

function showNewPage() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden');
    document.getElementById('categories-page').classList.add('hidden');
    document.getElementById('collection-page').classList.add('hidden'); // Ensure collection page is hidden
    document.getElementById('how-to-play-page').classList.add('hidden'); // Ensure how to play page is hidden
    document.getElementById('new-page').classList.remove('hidden');
}
