﻿export interface ListResponse<T> {
    items: T[];
    totalNumberOfItems: number;
    page: number;
    nextPage: string;
    previousPage: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    displayName: string;
    username: string;
    email: string;
    profileImageUrl: string;
    coverImageUrl: string;
}

export interface Interaction {
    id: number;
    user: User;
    type: string;
    date: string;
}

export interface Post {
    id: number;
    message: string;
    imageUrl: string;
    postedAt: string;
    postedBy: User;
    likes: Interaction[];
    dislikes: Interaction[];
}

export interface NewPost {
    message: string;
    imageUrl: string;
    userId: number;
}

const myHeaders = new Headers();
//myHeaders.append("", "");
myHeaders.append("Authorization", "Basic bWJlYWRlbGwycjpWZXJ5SGFja2FibGVQYXNzd29yZA==");


export async function fetchUsers(searchTerm: string, page: number, pageSize: number): Promise<ListResponse<User>> {
    const request = new Request(`https://localhost:5001/users?search=${searchTerm}&page=${page}&pageSize=${pageSize}`,{
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    const response = await fetch(request);
    return await response.json();
}

export async function fetchUser(userId: string | number): Promise<User> {
    const request = new Request(`https://localhost:5001/users/${userId}`,{
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    const response = await fetch(request);
    return await response.json();
}

export async function fetchPosts(page: number, pageSize: number): Promise<ListResponse<Post>> {
    const request = new Request(`https://localhost:5001/feed?page=${page}&pageSize=${pageSize}`,{
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    const response = await fetch(request);
    return await response.json();
}

export async function fetchPostsForUser(page: number, pageSize: number, userId: string | number) {
    const request = new Request(`https://localhost:5001/feed?page=${page}&pageSize=${pageSize}&postedBy=${userId}`,{
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    const response = await fetch(request);
    return await response.json();
}

export async function fetchPostsLikedBy(page: number, pageSize: number, userId: string | number) {
    const request = new Request(`https://localhost:5001/feed?page=${page}&pageSize=${pageSize}&likedBy=${userId}`,{
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    const response = await fetch(request);
    return await response.json();
}

export async function fetchPostsDislikedBy(page: number, pageSize: number, userId: string | number) {
    const request = new Request(`https://localhost:5001/feed?page=${page}&pageSize=${pageSize}&dislikedBy=${userId}`,{
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    const response = await fetch(request);
    return await response.json();
}

export async function createPost(newPost: NewPost) {
    const response = await fetch(`https://localhost:5001/posts/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost),
    });
    
    if (!response.ok) {
        throw new Error(await response.json())
    }
}
