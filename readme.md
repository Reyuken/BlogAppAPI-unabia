# S83 Mock Technical Exam – Blog Post API

## Application Name: Blog Post Management System
Blog Post API is a RESTful API designed for creating and managing blog content. The system allows users to register, authenticate, and manage their own blog posts. Admin users have elevated privileges to manage user roles and oversee platform access, while authenticated users can create, update, and manage their own posts.
---

## 👤 Developer
- Ray Unabia

---

## User Credentials

### Admin User
- **Email:** admin@mail.com
- **Password:** admin123

### Test User
- **Email:** user@mail.com
- **Password:** password123

---

## Features

### User Resources
- User Registration
- User Authentication (Login)
- Retrieve User Profile Details
- Update Username
- Update Password
- Set User as Admin (Admin only)

---

## Blog Post Features

### Blog Resources
- Create Blog Post
- Retrieve All Blog Posts
- Retrieve Specific Blog Post
- Update Blog Post (author only)
- Delete Blog Post (author and admin only)

---

## Notes
- Authentication required for protected routes
- Admin privileges required for admin-only actions
- Only the author of a blog post can modify or delete it