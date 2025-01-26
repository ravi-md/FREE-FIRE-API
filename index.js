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

        // Log the raw response for debugging
        console.log(response.data);

        // Check if response.data and required fields are defined
        if (response.data && response.data.success && response.data.account) {
            const accountData = response.data.account;

            // Restructure the response data
            const modifiedData = {
                success: response.data.success,
                creator: response.data.creator || "Dexter", // Default to Dexter if not present
                account: {
                    id: accountData.id,
                    name: accountData.name,
                    level: accountData.level,
                    xp: accountData.xp,
                    region: accountData.region,
                    likes: accountData.likes,
                    bio: accountData.bio,
                    created_at: accountData.created_at,
                    last_login: accountData.last_login,
                    honor_score: accountData.honor_score,
                    booyah_pass: accountData.booyah_pass,
                    booyah_pass_badge: accountData.booyah_pass_badge,
                    evo_access_badge: accountData.evo_access_badge,
                    equipped_title: accountData.equipped_title,
                    BR_points: accountData.BR_points,
                    CS_points: accountData.CS_points,
                },
                pet_info: response.data.pet_info || {},
                guild: response.data.guild || {},
                guild_leader: response.data.guild_leader || {},
                creator: response.data.creator || "Dexter",
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
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
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
