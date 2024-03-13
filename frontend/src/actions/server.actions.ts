"use server"
import { cookies } from 'next/headers';

import { ProfileResponseIface } from '@/interfaces/response';

const BACKEND_BASE_URL = process.env.BACKEND_URL

/**
 * Fetches the user's profile from the backend server.
 *
 * @return {Promise<ProfileResponseIface>} The user's profile.
 * @throws {Error} If there is an error while fetching the profile.
 */
export async function getProfileFromServer(): Promise<ProfileResponseIface> {
    // The endpoint for fetching the user's profile
    const endPoint = `${BACKEND_BASE_URL}/profile`;

    // Sending a GET request to the backend server
    const response = await fetch(endPoint, {
        method: "GET",  // The HTTP method for the request
        headers: {
            "Content-Type": "application/json",  // The content type of the request
            "Authorization": `Bearer ${cookies().get('you-token')?.value}`  // The authorization token for the request
        },
    });

    // Parsing the response body into a JSON object
    const resp = await response.json();

    // Returning the user's profile data
    return resp.data;
}


/**
 * Fetches a list of users from the backend server.
 *
 * @return {Promise<ProfileResponseIface[]>} An array of users.
 * @throws {Error} If there is an error while fetching the users.
 */
export async function getUsersFromServer(): Promise<ProfileResponseIface[]> {
    // The endpoint for fetching the list of users
    const endPoint = `${BACKEND_BASE_URL}/user/list`;

    // Sending a GET request to the backend server
    const response = await fetch(endPoint, {
        method: "GET",  // The HTTP method for the request
        headers: {
            "Content-Type": "application/json",  // The content type of the request
            "Authorization": `Bearer ${cookies().get('you-token')?.value}`  // The authorization token for the request
        },
    });

    // Parsing the response body into a JSON object
    const resp = await response.json();

    // Returning the array of users
    return resp.data;
}


/**
 * Fetches the detailed information of a user from the backend server.
 *
 * @param {string} userId - The ID of the user to fetch details for.
 * @return {Promise<ProfileResponseIface>} A Promise that resolves to the user's profile data.
 * @throws {Error} If there is an error while fetching the user's details.
 */
export async function getDetailUserFromServer(
    userId: string
): Promise<ProfileResponseIface> {
    // Construct the endpoint for fetching the user's details
    const endPoint = `${BACKEND_BASE_URL}/user/${userId}/detail`;

    // Send a GET request to the backend server
    const response = await fetch(endPoint, {
        method: "GET",  // The HTTP method for the request
        headers: {
            "Content-Type": "application/json",  // The content type of the request
            "Authorization": `Bearer ${cookies().get('you-token')?.value}`  // The authorization token for the request
        },
    });

    // Parse the response body into a JSON object
    const resp = await response.json();

    // Return the user's profile data
    return resp.data;
}

/**
 * Retrieves the session token from the cookies.
 *
 * @return {Promise<string | undefined>} A Promise that resolves to the session token,
 * if present, or undefined if not.
 */
export async function getSession(): Promise<string | undefined> {
    // Retrieve the session token from the cookies
    const token = cookies().get('you-token')?.value;

    // Resolve the Promise with the session token if it exists,
    // or undefined if it doesn't
    return token ? Promise.resolve(token) : Promise.resolve(undefined);
}

/**
 * Set a session token.
 *
 * @param {string} token - the session token to be set
 * @return {Promise<void>} a promise that resolves when the session token is set
 */
export async function setSession(token: string): Promise<void> {
    cookies().set("you-token", token as string)
}

/**
 * Asynchronously removes the session by clearing the "you-token" cookie.
 *
 * @return {Promise<void>} A Promise that resolves when the session is successfully removed.
 */
export async function removeSession(): Promise<void> {
    cookies().set("you-token", "", { expires: new Date(0) });
    return Promise.resolve();
}
