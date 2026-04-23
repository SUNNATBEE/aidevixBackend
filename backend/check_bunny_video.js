const axios = require('axios');
require('dotenv').config();

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const API_KEY = process.env.BUNNY_STREAM_API_KEY;
const VIDEO_ID = '03bda3b1-c05e-4a36-9edc-d1772ffa1312';

async function getBunnyVideo() {
    try {
        const response = await axios.get(
            `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${VIDEO_ID}`,
            {
                headers: {
                    AccessKey: API_KEY,
                    accept: 'application/json',
                }
            }
        );
        console.log('START_BUNNY_VIDEO');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('END_BUNNY_VIDEO');
    } catch (error) {
        console.error('Error fetching video from Bunny:', error.response ? error.response.data : error.message);
    }
}

getBunnyVideo();
