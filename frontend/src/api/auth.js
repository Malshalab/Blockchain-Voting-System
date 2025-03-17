export const registerUser = async(userData) =>{
    // userData should be an object containing name, email, and password
    const response = await fetch('http://localhost:5003/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok){
        const errorData = await response.json() ;
        throw new Error(errorData.error || 'Registration Failed')
    }

    return response.json() ;
};

export const loginUser = async(userData) => {

    // User data should contain email and password
    const response = await fetch('http://localhost:5003/auth/login' ,{
        method: 'POST' ,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),

    });

    if (!response.ok){
        const errorData = await response.json() ;
        throw new Error(errorData.error || 'Login Failed')
    }

    return response.json() ;
}