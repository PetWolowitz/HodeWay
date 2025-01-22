// src/lib/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

// User API
export const userAPI = {
    getUser: (id: string) => fetchAPI(`/users/${id}`),
    getUserByEmail: (email: string) => fetchAPI(`/users/email/${email}`),
    createUser: (userData: any) => fetchAPI('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
};

// Itinerary API
export const itineraryAPI = {
    getItineraries: (userId: string) => fetchAPI(`/itineraries?userId=${userId}`),
    getItinerary: (id: string) => fetchAPI(`/itineraries/${id}`),
    createItinerary: (data: any) => fetchAPI('/itineraries', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateItinerary: (id: string, data: any) => fetchAPI(`/itineraries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteItinerary: (id: string) => fetchAPI(`/itineraries/${id}`, {
        method: 'DELETE',
    }),
};

// Destination API
export const destinationAPI = {
    createDestination: (data: any) => fetchAPI('/destinations', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateDestination: (id: string, data: any) => fetchAPI(`/destinations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteDestination: (id: string) => fetchAPI(`/destinations/${id}`, {
        method: 'DELETE',
    }),
};

// Expense API
export const expenseAPI = {
    createExpense: (data: any) => fetchAPI('/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateExpense: (id: string, data: any) => fetchAPI(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteExpense: (id: string) => fetchAPI(`/expenses/${id}`, {
        method: 'DELETE',
    }),
};

// Transport API
export const transportAPI = {
    createTransport: (data: any) => fetchAPI('/transports', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateTransport: (id: string, data: any) => fetchAPI(`/transports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteTransport: (id: string) => fetchAPI(`/transports/${id}`, {
        method: 'DELETE',
    }),
};

// Collaborator API
export const collaboratorAPI = {
    addCollaborator: (data: any) => fetchAPI('/collaborators', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    removeCollaborator: (itineraryId: string, userId: string) =>
        fetchAPI(`/collaborators/${itineraryId}/${userId}`, {
            method: 'DELETE',
        }),
};