const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware to handle form data and JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve your static files (HTML, CSS, JavaScript) from your current folder
app.use(express.static(__dirname));

// 3. The Route to handle your button click / form submission
app.post('/submit-deal', (req, res) => {
    console.log('\n=========================================');
    console.log(' SUCCESS: The button is working! 🎉');
    console.log(' Received Data:', req.body);
    console.log('=========================================\n');

    // Send a success message back to your browser/app
    res.status(200).json({
        success: true,
        message: 'Server received your submission successfully!',
        data: req.body
    });
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`Keep this terminal open to watch your logs!`);
});
         
