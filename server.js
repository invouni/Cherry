// -----------------------------
// Required Modules
// -----------------------------
const express = require('express');
const path = require('path');
const { init, cherry } = require('./controllers/talkController.js');

// -----------------------------
// App Initialization
// -----------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// Middleware
// -----------------------------

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse JSON request bodies
app.use(express.json());

// -----------------------------
// View Engine Setup
// -----------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize async function (like DB or AI model)
(async () => {
    await init();
})();

// -----------------------------
// Routes
// -----------------------------

// Home Page - renders the main talk UI
app.get('/', (req, res) => {
    res.render('talk', {
        userType: null,                 // 'student' | 'teacher'
        classes: ['6A', '6B', '7A'],     // Example class list
        teachers: ['Mr. Sharma', 'Ms. Gupta'], // Example teacher list
        timetable: null                 // Could be dynamically loaded
    });
});

// Voice Assistant Page
app.get('/talk', (req, res) => {
    res.render('talk');
});

// AI Question Handling Route
app.post('/ques', async (req, res) => {
    try {
        console.log('Request body:', req.body);

        // Call your AI / logic handler "cherry"
        const response = await cherry(req.body);

        // Send back AI reply
        res.json({ responce: response.text });

    } catch (error) {
        console.error('Error in /ques route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// -----------------------------
// 404 Fallback
// -----------------------------
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
