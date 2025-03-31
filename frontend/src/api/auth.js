export const registerUser = async (userData) => {
    // userData should be an object containing name, email, and password
    const response = await fetch('http://localhost:5003/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration Failed');
    }

    return response.json();
};

export const loginUser = async (userData) => {
    // userData should contain email and password
    const response = await fetch('http://localhost:5003/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login Failed');
    }

    return response.json();
};

export const verifyMessage = async (token, address, message, signature) => {
    console.log("Token sent to backend:", token);

    const response = await fetch('http://localhost:5003/auth/link-wallet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ address, message, signature }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification Failed');
    }

    return response.json();
};

// New function for Google Registration
export const registerUserWithGoogle = async (userData) => {
    // userData should be an object containing { token: 'google_id_token' }
    const response = await fetch('http://localhost:5003/auth/google/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Google Registration Failed');
    }

    return response.json();
};

// New function for Google Login
export const loginUserWithGoogle = async (userData) => {
    // userData should be an object containing { token: 'google_id_token' }
    const response = await fetch('http://localhost:5003/auth/google/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Google Login Failed');
    }

    return response.json();
};