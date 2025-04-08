// This file contains all the Spanish-English word pairs for our memory game
const wordPairs = [
    { id: 1, spanish: "hola", english: "hello", difficulty: "easy" },
    { id: 2, spanish: "adiós", english: "goodbye", difficulty: "easy" },
    { id: 3, spanish: "gracias", english: "thank you", difficulty: "easy" },
    { id: 4, spanish: "por favor", english: "please", difficulty: "easy" },
    { id: 5, spanish: "sí", english: "yes", difficulty: "easy" },
    { id: 6, spanish: "no", english: "no", difficulty: "easy" },
    { id: 7, spanish: "buenos días", english: "good morning", difficulty: "easy" },
    { id: 8, spanish: "buenas noches", english: "good night", difficulty: "easy" },
    { id: 9, spanish: "agua", english: "water", difficulty: "easy" },
    { id: 10, spanish: "comida", english: "food", difficulty: "easy" },
    
    { id: 11, spanish: "tiempo", english: "time", difficulty: "medium" },
    { id: 12, spanish: "dinero", english: "money", difficulty: "medium" },
    { id: 13, spanish: "trabajo", english: "work", difficulty: "medium" },
    { id: 14, spanish: "familia", english: "family", difficulty: "medium" },
    { id: 15, spanish: "amigo", english: "friend", difficulty: "medium" },
    { id: 16, spanish: "libro", english: "book", difficulty: "medium" },
    { id: 17, spanish: "escuela", english: "school", difficulty: "medium" },
    { id: 18, spanish: "casa", english: "house", difficulty: "medium" },
    { id: 19, spanish: "ciudad", english: "city", difficulty: "medium" },
    { id: 20, spanish: "país", english: "country", difficulty: "medium" },
    
    { id: 21, spanish: "aprender", english: "to learn", difficulty: "hard" },
    { id: 22, spanish: "desarrollar", english: "to develop", difficulty: "hard" },
    { id: 23, spanish: "experiencia", english: "experience", difficulty: "hard" },
    { id: 24, spanish: "conocimiento", english: "knowledge", difficulty: "hard" },
    { id: 25, spanish: "entender", english: "to understand", difficulty: "hard" },
    { id: 26, spanish: "recuerdo", english: "memory", difficulty: "hard" },
    { id: 27, spanish: "encontrar", english: "to find", difficulty: "hard" },
    { id: 28, spanish: "pensar", english: "to think", difficulty: "hard" },
    { id: 29, spanish: "comenzar", english: "to begin", difficulty: "hard" },
    { id: 30, spanish: "terminar", english: "to finish", difficulty: "hard" }
];

// Game settings for different difficulty levels
const difficultySettings = {
    easy: {
        timeLimit: 60, // in seconds
        cardCount: 12  // 6 pairs (must be even)
    },
    medium: {
        timeLimit: 90, // in seconds
        cardCount: 16  // 8 pairs (must be even)
    },
    hard: {
        timeLimit: 120, // in seconds
        cardCount: 20   // 10 pairs (must be even)
    }
};