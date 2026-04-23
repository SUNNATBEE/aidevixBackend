const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const BUNNY_API_BASE = 'https://video.bunnycdn.com';

const listVideos = async () => {
    try {
        const res = await axios.get(
            `${BUNNY_API_BASE}/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
            {
                headers: {
                    AccessKey: process.env.BUNNY_STREAM_API_KEY,
                    accept: 'application/json'
                }
            }
        );
        
        console.log('Bunny.net Library Videos:');
        res.data.items.forEach(v => {
            console.log(`GUID: ${v.guid} | Title: ${v.title} | Status: ${v.status}`);
        });
    } catch (error) {
        console.error('Error fetching videos:', error.response ? error.response.data : error.message);
    }
};

listVideos();
