// Game state variables
let currentLevel = null;
let cards = [];
let score = 0;
let timeRemaining = 0;
let timerInterval = null;
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let matchedWords = [];
let isHintActive = false;
let hintTimeout = null;

// Sound effects
const flipSound = new Audio();
flipSound.src = 'https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3';
const matchSound = new Audio();
matchSound.src = 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3';
const successSound = new Audio();
successSound.src = 'https://assets.mixkit.co/active_storage/sfx/1990/1990-preview.mp3';
const failSound = new Audio();
failSound.src = 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3';

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');
const timeRemainingDisplay = document.getElementById('time-remaining');
const pairsFoundDisplay = document.getElementById('pairs-found');
const successMessage = document.getElementById('success-message');
const failureMessage = document.getElementById('failure-message');
const levelCompleted = document.getElementById('level-completed');
const learnedWordsSection = document.getElementById('learned-words');
const wordPairsContainer = document.getElementById('word-pairs');

// Button Elements
const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
const hintButton = document.getElementById('hint-btn');
const restartButton = document.getElementById('restart-btn');
const menuButton = document.getElementById('menu-btn');
const playAgainButton = document.getElementById('play-again-btn');
const returnMenuButton = document.getElementById('return-menu-btn');

// Initialize the game
function init() {
    // Add event listeners for difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level');
            startGame(level);
        });
    });

    // Add event listeners for game control buttons
    hintButton.addEventListener('click', showHint);
    restartButton.addEventListener('click', restartGame);
    menuButton.addEventListener('click', returnToMenu);
    playAgainButton.addEventListener('click', restartGame);
    returnMenuButton.addEventListener('click', returnToMenu);
}

// Start a new game with selected difficulty
function startGame(level) {
    currentLevel = level;
    
    // Reset game state
    score = 0;
    matchedPairs = 0;
    matchedWords = [];
    flippedCards = [];
    isHintActive = false;
    
    // Get time limit from settings
    timeRemaining = difficultySettings[level].timeLimit;
    
    // Update the UI
    scoreDisplay.textContent = score;
    updateTimerDisplay();
    
    // Generate and shuffle cards
    generateCards(level);
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start the timer
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
    
    // Show game screen, hide other screens
    hideAllScreens();
    gameScreen.classList.add('active');
}

// Generate cards based on difficulty level
function generateCards(level) {
    // Clear game board
    gameBoard.innerHTML = '';
    
    // Filter word pairs by difficulty
    const filteredWordPairs = wordPairs.filter(pair => pair.difficulty === level);
    
    // Determine number of pairs needed for this level
    const pairsNeeded = difficultySettings[level].cardCount / 2;
    totalPairs = pairsNeeded;
    
    // Select random word pairs
    const selectedPairs = [];
    const availablePairs = [...filteredWordPairs];
    
    for (let i = 0; i < pairsNeeded && availablePairs.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availablePairs.length);
        selectedPairs.push(availablePairs[randomIndex]);
        availablePairs.splice(randomIndex, 1);
    }
    
    // Create cards array with both Spanish and English cards
    cards = [];
    selectedPairs.forEach(pair => {
        // Spanish card
        cards.push({
            id: `card-${pair.id}-spanish`,
            pairId: pair.id,
            text: pair.spanish,
            language: 'spanish',
            isFlipped: false,
            isMatched: false
        });
        
        // English card
        cards.push({
            id: `card-${pair.id}-english`,
            pairId: pair.id,
            text: pair.english,
            language: 'english',
            isFlipped: false,
            isMatched: false
        });
    });
    
    // Shuffle cards
    shuffleCards();
    
    // Create card elements
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.id = card.id;
        cardElement.dataset.pairId = card.pairId;
        cardElement.dataset.language = card.language;
        
        // Create front and back of card
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = card.text;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '?';
        
        // Add front and back to card
        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        
        // Add click event
        cardElement.addEventListener('click', () => flipCard(card.id));
        
        // Add to game board
        gameBoard.appendChild(cardElement);
    });
}

// Shuffle cards array
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Handle card flipping
function flipCard(cardId) {
    // Find the card in our cards array
    const cardIndex = cards.findIndex(card => card.id === cardId);
    const card = cards[cardIndex];
    
    // Don't allow flipping if:
    // - Card is already flipped or matched
    // - Two cards are already flipped and being checked
    // - Game is over
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2 || !timerInterval) {
        return;
    }
    
    // Play flip sound
    flipSound.play();
    
    // Flip the card
    card.isFlipped = true;
    const cardElement = document.getElementById(cardId);
    cardElement.classList.add('flipped');
    
    // Add to flipped cards array
    flippedCards.push(card);
    
    // If we have 2 flipped cards, check for a match
    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 1000);
    }
}

// Check if the two flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    // Cards match if they have the same pairId but different languages
    if (card1.pairId === card2.pairId && card1.language !== card2.language) {
        // It's a match!
        handleMatch(card1, card2);
    } else {
        // Not a match, flip cards back
        handleMismatch(card1, card2);
    }
    
    // Clear flipped cards array
    flippedCards = [];
    
    // Check if all pairs are matched
    if (matchedPairs === totalPairs) {
        endGame(true);
    }
}

// Handle matched cards
function handleMatch(card1, card2) {
    // Play match sound
    matchSound.play();
    
    // Mark cards as matched
    card1.isMatched = true;
    card2.isMatched = true;
    
    // Add matched class for styling
    document.getElementById(card1.id).classList.add('matched');
    document.getElementById(card2.id).classList.add('matched');
    
    // Increment matched pairs
    matchedPairs++;
    
    // Update score
    score += calculateScore();
    scoreDisplay.textContent = score;
    
    // Add to matched words
    const matchedPair = wordPairs.find(pair => pair.id === card1.pairId);
    if (matchedPair) {
        matchedWords.push(matchedPair);
    }
}

// Handle mismatched cards
function handleMismatch(card1, card2) {
    // Flip cards back over
    card1.isFlipped = false;
    card2.isFlipped = false;
    
    // Remove flipped class
    document.getElementById(card1.id).classList.remove('flipped');
    document.getElementById(card2.id).classList.remove('flipped');
}

// Calculate score based on remaining time and difficulty
function calculateScore() {
    const timeBonus = Math.floor(timeRemaining / 10);
    const difficultyMultiplier = {
        easy: 1,
        medium: 2,
        hard: 3
    };
    
    return 10 + timeBonus * difficultyMultiplier[currentLevel];
}

// Show hint by briefly flipping all unmatched cards
function showHint() {
    if (isHintActive || !timerInterval) return;
    
    isHintActive = true;
    hintButton.disabled = true;
    
    // Get all unmatched cards
    const unmatchedCards = cards.filter(card => !card.isMatched);
    const unmatchedCardElements = unmatchedCards.map(card => document.getElementById(card.id));
    
    // Flip all unmatched cards
    unmatchedCardElements.forEach(card => card.classList.add('flipped'));
    
    // After 1 second, flip them back
    hintTimeout = setTimeout(() => {
        unmatchedCardElements.forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped');
            }
        });
        
        isHintActive = false;
        hintButton.disabled = false;
    }, 1000);
    
    // Penalty for using hint: reduce time
    timeRemaining = Math.max(0, timeRemaining - 5);
    updateTimerDisplay();
}

// End the game
function endGame(isSuccess) {
    // Clear timers
    clearInterval(timerInterval);
    timerInterval = null;
    if (hintTimeout) {
        clearTimeout(hintTimeout);
    }
    
    // Play sound based on success or failure
    if (isSuccess) {
        successSound.play();
    } else {
        failSound.play();
    }
    
    // Update game over screen
    finalScoreDisplay.textContent = score;
    timeRemainingDisplay.textContent = formatTime(timeRemaining);
    pairsFoundDisplay.textContent = `${matchedPairs}/${totalPairs}`;
    
    // Show/hide success or failure message
    if (isSuccess) {
        successMessage.classList.remove('hidden');
        failureMessage.classList.add('hidden');
    } else {
        successMessage.classList.add('hidden');
        failureMessage.classList.remove('hidden');
    }
    
    // Update level completed
    const levelNames = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
    };
    levelCompleted.textContent = levelNames[currentLevel];
    
    // Display matched words
    if (matchedWords.length > 0) {
        learnedWordsSection.classList.remove('hidden');
        
        // Clear previous words
        wordPairsContainer.innerHTML = '';
        
        // Add each matched word pair
        matchedWords.forEach(pair => {
            const wordPairDiv = document.createElement('div');
            
            const spanishWord = document.createElement('span');
            spanishWord.textContent = pair.spanish;
            spanishWord.className = 'spanish-word';
            
            const englishWord = document.createElement('span');
            englishWord.textContent = pair.english;
            
            wordPairDiv.appendChild(spanishWord);
            wordPairDiv.appendChild(englishWord);
            
            wordPairsContainer.appendChild(wordPairDiv);
        });
    } else {
        learnedWordsSection.classList.add('hidden');
    }
    
    // Show game over screen, hide other screens
    hideAllScreens();
    gameOverScreen.classList.add('active');
}

// Restart the current game
function restartGame() {
    startGame(currentLevel);
}

// Return to main menu
function returnToMenu() {
    // Clear any running timers
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    if (hintTimeout) {
        clearTimeout(hintTimeout);
    }
    
    // Show splash screen, hide other screens
    hideAllScreens();
    splashScreen.classList.add('active');
}

// Helper function to hide all screens
function hideAllScreens() {
    splashScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
}

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining);
}

// Initialize the game when the page loads
window.addEventListener('load', init);