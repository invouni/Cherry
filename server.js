const express = require('express');
const path = require('path');
const cherry = require('./controllers/talkController.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    // .
    res.render('talk', {
        userType: null,   // 'student' or 'teacher'
        classes: ['6A', '6B', '7A'], 
        teachers: ['Mr. Sharma', 'Ms. Gupta'],
        timetable: null   // can populate dynamically
    });
});

// Voice Assistant
app.get('/talk', (req, res) => {
    res.render('talk');
});

app.post('/ques', async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const response = await cherry(req.body);
        res.json(response);
    } catch (error) {
        console.error('Error in /ques route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Error page (fallback)
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});