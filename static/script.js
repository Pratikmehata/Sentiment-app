// DOM Elements
const reviewText = document.getElementById('review-text');
const charCount = document.getElementById('char-count');
const analyzeBtn = document.getElementById('analyze-btn');
const resultCard = document.getElementById('result-card');
const sentimentText = document.getElementById('sentiment-text');
const sentimentIcon = document.getElementById('sentiment-icon');
const sentimentIndicator = document.getElementById('sentiment-indicator');
const confidenceBar = document.getElementById('confidence-bar');
const confidenceValue = document.getElementById('confidence-value');
const loadingOverlay = document.getElementById('loading-overlay');
const toast = document.getElementById('toast');

// Sample reviews
const sampleReviews = [
    "This movie was absolutely fantastic! The acting was superb and the storyline kept me engaged throughout. One of the best films I've seen this year.",
    "I was really disappointed with this film. The plot was predictable and the characters were poorly developed. Would not recommend.",
    "The cinematography was beautiful, but the pacing felt too slow. Overall it's an average movie with some good moments.",
    "Terrible experience from start to finish. The dialogue was cringe-worthy and the special effects looked cheap. Save your money!",
    "A masterpiece of modern cinema. Every aspect of this film was carefully crafted and it shows. The performances were Oscar-worthy."
];

// Character counter
reviewText.addEventListener('input', () => {
    const count = reviewText.value.length;
    charCount.textContent = count;
    
    // Change color when approaching limit
    if (count > 450) {
        charCount.style.color = '#ef233c';
    } else if (count > 400) {
        charCount.style.color = '#ffaa00';
    } else {
        charCount.style.color = '#6c757d';
    }
});

// Analyze sentiment
async function analyzeSentiment() {
    const text = reviewText.value.trim();
    
    if (!text) {
        showToast('Please enter a review before analyzing');
        return;
    }
    
    // Show loading state
    loadingOverlay.classList.add('visible');
    analyzeBtn.disabled = true;
    
    try {
        // Simulate API delay for demo (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(text)}`
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        
        // Update UI with results
        updateResultUI(data.sentiment);
        
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred during analysis');
    } finally {
        loadingOverlay.classList.remove('visible');
        analyzeBtn.disabled = false;
    }
}

// Update result display
function updateResultUI(sentiment) {
    // Set sentiment text and styling
    sentimentText.textContent = sentiment;
    
    // Update icon and colors based on sentiment
    if (sentiment === 'Positive') {
        sentimentIndicator.className = 'sentiment-positive';
        sentimentIcon.innerHTML = '<i class="fas fa-smile-beam"></i>';
        confidenceBar.style.width = '80%';
        confidenceBar.style.background = 'linear-gradient(90deg, var(--negative), var(--positive))';
        confidenceValue.textContent = '80%';
    } else if (sentiment === 'Negative') {
        sentimentIndicator.className = 'sentiment-negative';
        sentimentIcon.innerHTML = '<i class="fas fa-frown-open"></i>';
        confidenceBar.style.width = '20%';
        confidenceBar.style.background = 'linear-gradient(90deg, var(--negative), var(--positive))';
        confidenceValue.textContent = '20%';
    } else {
        sentimentIndicator.className = 'sentiment-neutral';
        sentimentIcon.innerHTML = '<i class="fas fa-meh"></i>';
        confidenceBar.style.width = '50%';
        confidenceBar.style.background = 'linear-gradient(90deg, var(--negative), var(--positive))';
        confidenceValue.textContent = '50%';
    }
    
    // Show result card with animation
    resultCard.classList.add('visible');
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Load sample review
function loadSample() {
    const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    reviewText.value = randomReview;
    reviewText.dispatchEvent(new Event('input'));
    showToast('Sample review loaded');
}

// Clear text
function clearText() {
    reviewText.value = '';
    reviewText.dispatchEvent(new Event('input'));
    resultCard.classList.remove('visible');
    showToast('Text cleared');
}

// Send feedback
function sendFeedback(type) {
    const message = type === 'correct' 
        ? 'Thanks for your positive feedback!' 
        : 'We appreciate your feedback and will improve our model.';
    
    showToast(message);
    
    // In a real app, you would send this to your backend
    console.log(`User feedback: ${type}`);
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
});