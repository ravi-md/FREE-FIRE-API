const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch data by ID
app.get('/get-ff-account', async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID parameter is required!',
        });
    }

    try {
        const targetApiUrl = `https://api.davidcyriltech.my.id/ffstalk?id=${id}`;
        const response = await axios.get(targetApiUrl);

        if (response.data && response.data.success) {
            const modifiedData = {
                ...response.data,
                creator: "Dexter",
            };

            return res.json({
                success: true,
                data: modifiedData,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Account not found or API request failed.',
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the data.',
        });
    }
});

// Render web page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
