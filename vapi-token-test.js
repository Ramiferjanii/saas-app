// VAPI Token Validator
// Add this to your browser console to test your VAPI token

const testVAPIToken = async (token) => {
  try {
    const response = await fetch('https://api.vapi.ai/assistant', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ VAPI token is valid!');
      return true;
    } else {
      console.log('❌ VAPI token is invalid:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing VAPI token:', error);
    return false;
  }
};

// Test your current token
testVAPIToken('2b8b1320-28c2-4503-8598-a41311f9d3df');
