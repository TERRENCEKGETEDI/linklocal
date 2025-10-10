import usersData from './data/users.json';
import postsData from './data/posts.json';
import toolRequestsData from './data/toolRequests.json';

// In a real app, this would be a database, but here we simulate with in-memory data
let users = [...usersData];
let posts = [...postsData];
let toolRequests = [...toolRequestsData];

export const getUsers = () => users;
export const getPosts = () => posts;
export const getToolRequests = () => toolRequests;

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
};

export const updatePost = (id, updates) => {
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
  }
};

export const deletePost = (id) => {
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index].deleted = true;
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