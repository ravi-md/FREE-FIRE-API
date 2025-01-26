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
            // Restructure the response data
            const modifiedData = {
                success: response.data.success,
                message: response.data.message,
                status: response.data.status,
                timestamp: response.data.timestamp,
                account: {
                    id: response.data.data.account.id,
                    name: response.data.data.account.name,
                    level: response.data.data.account.level,
                    xp: response.data.data.account.xp,
                    region: response.data.data.account.region,
                    created_at: response.data.data.account.created_at,
                    last_login: response.data.data.account.last_login,
                    honor_score: response.data.data.account.honor_score,
                    booyah_pass_badge: response.data.data.account.booyah_pass_badge,
                    BR_points: response.data.data.account.BR_points,
                    CS_points: response.data.data.account.CS_points,
                },
                pet_info: {
                    name: response.data.data.pet_info.name,
                    level: response.data.data.pet_info.level,
                    type: response.data.data.pet_info.type,
                    xp: response.data.data.pet_info.xp,
                },
                guild: {
                    name: response.data.data.guild.name,
                    id: response.data.data.guild.id,
                    level: response.data.data.guild.level,
                    member_count: response.data.data.guild.member_count,
                    capacity: response.data.data.guild.capacity,
                },
                guild_leader: {
                    id: response.data.data.guild_leader.id,
                    name: response.data.data.guild_leader.name,
                    level: response.data.data.guild_leader.level,
                    xp: response.data.data.guild_leader.xp,
                    likes: response.data.data.guild_leader.likes,
                    last_login: response.data.data.guild_leader.last_login,
                    BR_points: response.data.data.guild_leader.BR_points,
                    CS_points: response.data.data.guild_leader.CS_points,
                },
                accountStatus: response.data.data.accountStatus,
                retrievedAt: response.data.data.retrievedAt,
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
