const fetch = require('node-fetch'); // Or use built-in fetch if Node 18+

const API_URL = 'http://localhost:4000/api';

async function testEnquiryFetch() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'mantujak82@gmail.com',
                password: 'mantuja@2002'
            })
        });

        if (!loginRes.ok) {
            const err = await loginRes.json();
            throw new Error(`Login failed: ${JSON.stringify(err)}`);
        }

        const loginData = await loginRes.json();
        console.log('Login successful. Token:', loginData.token);
        console.log('Role:', loginData.role);

        // 2. Fetch Enquiries
        console.log('Fetching enquiries...');
        const enquiriesRes = await fetch(`${API_URL}/enquiries`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });

        console.log('Enquiries Status:', enquiriesRes.status);
        if (!enquiriesRes.ok) {
            const err = await enquiriesRes.json();
            console.error('Enquiries Fetch Error Body:', err);
            throw new Error(`Fetch failed with status ${enquiriesRes.status}`);
        }

        const enquiries = await enquiriesRes.json();
        console.log(`Successfully fetched ${enquiries.length} enquiries.`);
        console.log('First enquiry:', enquiries[0]);

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testEnquiryFetch();
