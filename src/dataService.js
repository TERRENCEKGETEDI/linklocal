import usersData from './data/users.json';
import postsData from './data/posts.json';
import toolRequestsData from './data/toolRequests.json';
import serviceRequestsData from './data/serviceRequests.json';

// In a real app, this would be a database, but here we simulate with in-memory data and localStorage persistence
let users = [...usersData];
let posts = JSON.parse(localStorage.getItem('posts')) || [...postsData];
if (!localStorage.getItem('posts')) {
  localStorage.setItem('posts', JSON.stringify(posts));
}
let toolRequests = [...toolRequestsData];
let serviceRequests = [...serviceRequestsData];

export const getUsers = () => users;
export const getPosts = () => posts;
export const getToolRequests = () => toolRequests;
export const getServiceRequests = () => serviceRequests;

export const addUser = (user) => {
  users.push({ ...user, id: Date.now().toString() });
};

export const updateUser = (id, updates) => {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
  }
};

export const deleteUser = (id) => {
  users = users.filter(u => u.id !== id);
};

export const addPost = (post) => {
  posts.push({ ...post, id: Date.now().toString(), createdAt: new Date().toISOString() });
  localStorage.setItem('posts', JSON.stringify(posts));
};

export const updatePost = (id, updates) => {
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    localStorage.setItem('posts', JSON.stringify(posts));
  }
};

export const deletePost = (id) => {
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index].deleted = true;
    localStorage.setItem('posts', JSON.stringify(posts));
  }
};

export const addToolRequest = (request) => {
  toolRequests.push({ ...request, id: Date.now().toString(), submittedAt: new Date().toISOString() });
};

export const updateToolRequest = (id, updates) => {
  const index = toolRequests.findIndex(r => r.id === id);
  if (index !== -1) {
    toolRequests[index] = { ...toolRequests[index], ...updates };
  }
};

export const addServiceRequest = (request) => {
  serviceRequests.push({ ...request, id: Date.now().toString(), submittedAt: new Date().toISOString() });
};

export const updateServiceRequest = (id, updates) => {
  const index = serviceRequests.findIndex(r => r.id === id);
  if (index !== -1) {
    serviceRequests[index] = { ...serviceRequests[index], ...updates };
  }
};