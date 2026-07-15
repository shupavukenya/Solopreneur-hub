// pesapal.js - Handles PesaPal API 3.0 Integration

// 1. Configuration (Replace with your actual keys from the PesaPal Portal)
const PESAPAL_CONFIG = {
    consumer_key: "YOUR_LIVE_CONSUMER_KEY_HERE",
    consumer_secret: "YOUR_LIVE_CONSUMER_SECRET_HERE",
    api_base_url: "https://pay.pesapal.com/v3", // Use https://cybspg.pesapal.com/v3 for sandbox testing
    ipn_id: "YOUR_IPN_ID_HERE" // The IPN ID registered in your PesaPal dashboard
};

/**
 * Step 1: Authenticate and get a Bearer Token
 */
async function getAuthToken() {
    const url = `${PESAPAL_CONFIG.api_base_url}/api/Auth/RegisterIPN`;
    
    const payload = {
        consumer_key: PESAPAL_CONFIG.consumer_key,
        consumer_secret: PESAPAL_CONFIG.consumer_secret
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Authentication failed');
        const data = await response.json();
        return data.token; // This token is valid for 5 minutes
    } catch (error) {
        console.error("Error getting auth token:", error);
        alert("Payment initialization failed. Please check credentials.");
    }
}

/**
 * Step 2: Submit the Order (Register Customer & Trigger Payment)
 */
async function processPayment(customerData) {
    try {
        const token = await getAuthToken();
        if (!token) return;

        const url = `${PESAPAL_CONFIG.api_base_url}/api/Transactions/SubmitOrderRequest`;
        
        const payload = {
            id: "TXN_" + Date.now(), // Generates a unique transaction ID
            currency: "KES",
            amount: parseFloat(customerData.amount),
            description: "Ride payment / Deal registration",
            callback_url: window.location.origin + "/payment-callback.html", // Redirects back to your site
            notification_id: PESAPAL_CONFIG.ipn_id,
            billing_address: {
                email_address: customerData.email,
                phone_number: customerData.phone,
                first_name: customerData.firstName,
                last_name: customerData.lastName
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.redirect_url) {
            // Redirect the customer to the secure PesaPal payment page
            window.location.href = data.redirect_url;
        } else {
            console.error("Failed to generate payment link:", data);
            alert("Could not generate payment link. Check console for details.");
        }

    } catch (error) {
        console.error("Payment processing error:", error);
    }
}

// Attach the process payment function globally so index.html can call it
window.processPayment = processPayment;

