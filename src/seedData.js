import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const postsData = [
  {
    "userId": "user123",
    "title": "House Cleaning Service",
    "description": "Professional cleaning services for homes and offices.",
    "category": "cleaning",
    "price": 20,
    "priceUnit": "per hour",
    "location": "New York",
    "availability": "Weekdays 9am-5pm",
    "rating": 4.5,
    "likes": [],
    "favorites": [],
    "reports": [],
    "deleted": false,
    "createdAt": new Date().toISOString()
  },
  {
    "userId": "user456",
    "title": "Plumbing Repair",
    "description": "Fix leaks, install pipes, and more.",
    "category": "repair",
    "price": 50,
    "priceUnit": "per job",
    "location": "Los Angeles",
    "availability": "24/7",
    "rating": 4.8,
    "likes": [],
    "favorites": [],
    "reports": [],
    "deleted": false,
    "createdAt": new Date().toISOString()
  }
];

const usersData = [
  {
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "blocked": false,
    "badges": ["verified"],
    "points": 100
  },
  {
    "email": "user1@example.com",
    "name": "John Doe",
    "role": "user",
    "blocked": false,
    "badges": [],
    "points": 50
  }
];

const seedData = async () => {
  try {
    console.log('Seeding initial data...');

    // Seed posts one by one to avoid batch write issues
    for (const post of postsData) {
      await addDoc(collection(db, 'posts'), post);
      console.log('Added post:', post.title);
    }

    // Seed users one by one
    for (const user of usersData) {
      await addDoc(collection(db, 'users'), user);
      console.log('Added user:', user.email);
    }

    console.log('Data seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

export default seedData;