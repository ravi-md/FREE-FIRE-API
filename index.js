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
        if (response.data && response.data.success && response.data.data) {
            const accountData = response.data.data.account;
            const petInfo = response.data.data.pet_info || {};
            const guild = response.data.data.guild || {};
            const guildLeader = response.data.data.guild_leader || {};

            // Restructure the response data with "creator" set to "Dexter Tech"
            const modifiedData = {
                success: response.data.success,
                creator: "Dexter Tech", // Set creator to Dexter Tech
                account: {
                    id: accountData.id,
                    name: accountData.name,
                    level: accountData.level,
                    xp: accountData.xp,
                    region: accountData.region,
                    likes: accountData.likes,
                    created_at: accountData.created_at,
                    last_login: accountData.last_login,
                    honor_score: accountData.honor_score,
                    booyah_pass_badge: accountData.booyah_pass_badge,
                    BR_points: accountData.BR_points,
                    CS_points: accountData.CS_points,
                },
                pet_info: {
                    name: petInfo.name,
                    level: petInfo.level,
                    type: petInfo.type,
                    xp: petInfo.xp,
                },
                guild: {
                    name: guild.name,
                    id: guild.id,
                    level: guild.level,
                    member_count: guild.member_count,
                    capacity: guild.capacity,
                },
                guild_leader: {
                    id: guildLeader.id,
                    name: guildLeader.name,
                    level: guildLeader.level,
                    xp: guildLeader.xp,
                    likes: guildLeader.likes,
                    last_login: guildLeader.last_login,
                    BR_points: guildLeader.BR_points,
                    CS_points: guildLeader.CS_points,
                },
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
