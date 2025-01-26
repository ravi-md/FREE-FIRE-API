const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

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
        // Target API URL
        const targetApiUrl = `https://api.davidcyriltech.my.id/ffstalk?id=${id}`;

        // Fetch data from the target API
        const response = await axios.get(targetApiUrl);

        // Check if the response indicates success
        if (response.data && response.data.success) {
            // Modify the "creator" field to "Dexter"
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
