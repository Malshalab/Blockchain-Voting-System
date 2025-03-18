export const isTokenValid = (): boolean => {
    const token = localStorage.getItem("token");

    if (!token) return false; // No token = Not logged in

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        return decodedToken.exp > currentTime; // Check if token is still valid
    } catch (error) {
        return false; // Token is invalid
    }
};
