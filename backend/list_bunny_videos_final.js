const axios = require('axios');
require('dotenv').config();

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const API_KEY = process.env.BUNNY_STREAM_API_KEY;

async function listVideos() {
    try {
        const response = await axios.get(
            `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
            {
                headers: {
                    AccessKey: API_KEY,
                    accept: 'application/json',
                }
            }
        );
        console.log('START_BUNNY_VIDEOS');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('END_BUNNY_VIDEOS');
    } catch (error) {
        console.error('Error fetching videos from Bunny:', error.response ? error.response.data : error.message);
    }
}

listVideos();
