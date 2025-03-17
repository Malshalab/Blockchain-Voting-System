// This file contains helper functions for poll-related API calls

// Function to get a list of polls with optional filtering via query parameters
export const getPolls = async (filters = {}) => {
    // Build query string from filters (e.g., { title: "favorite", status: "active" })
    const queryString = new URLSearchParams(filters).toString();
    const url = `http://localhost:5003/polls${queryString ? '?' + queryString : ''}`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch polls');
    }
  
    return response.json();
  };
  
  // Function to create a new poll
  export const createPoll = async (pollData, token) => {
    // pollData should be an object with title, description, options, startTime, and endTime
    const response = await fetch('http://localhost:5003/polls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // If authentication is required, include the JWT token:
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pollData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Poll creation failed');
    }
  
    return response.json();
  };
  
  // Function to update an existing poll
  export const updatePoll = async (pollId, updatedData, token) => {
    // pollId: the identifier of the poll
    // updatedData: an object with the updated poll fields
    const response = await fetch(`http://localhost:5003/polls/${pollId}`, {
      method: 'PUT', // or PATCH if you're partially updating
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Poll update failed');
    }
  
    return response.json();
  };
  
  // Function to delete a poll
  export const deletePoll = async (pollId, token) => {
    const response = await fetch(`http://localhost:5003/polls/${pollId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Poll deletion failed');
    }
  
    return response.json();
  };