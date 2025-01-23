# TITLE = p2p_book_exchange

Brief Description 
This project is a book exchange system where users can list books they want to exchange and propose swaps with other users. The system manages book availability, user requests, and status updates.

## Technologies Used
- Frontend: React, CSS
- Backend: Node.js, Express
- Database: MongoDB
- Other: Axios, Mongoose

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/deniseLie/p2p_book_exchange.git
   ```
2. Navigate to the project directory:
   ```bash
   cd p2p_book_exchange
   ```
3. Install dependencies for both backend and frontend:
   ```bash
   npm install
   ```
4. Set up the environment variables
   - Create a `.env` file in the root directory of /backend.
   - Add the following:
     ```

     MONGO_URI=<Your MongoDB URI>
     JWT_SECRET=<Your JWT Secret>
     PORT=5000
    EMAIL_USERNAME=<email_username> # Not important for now
    EMAIL_PASSWORD=<email_password> # Not important for now
    ```
5. Start the application:
    frontend 
   ```bash
   npm start
   ```

   backend
    ```bash
   node server.js
   ```
## Features
- User authentication and authorization.
- Request and manage book exchanges.
- Real-time status updates for exchanges.

## Future extension 
This project aims to evolve into a "Facebook for book lovers" with additional features, including:
- Social Media Integration
    - WHY? : Foster a sense of community and engagement among users = retain user
    - Follow/Followed System: Introduce a feed where users can see updates from the people they follow (e.g., books added to their library, reviews posted, reading progress).
    - Personal Library: Allow customization—users can organize books into categories (e.g., "Read," "To Read," "Wishlist").
    - Gamification: Introduce badges for milestones (e.g., "Reviewed 10 books," "Added 50 books to the library").
    - Share: to show off to their friends and families

- Recommendation System:
    - Users can list books they're interested in, and the system will match them with other users' libraries, considering location and preferences.
    
- Messaging App centralized
    - will be similar to carousel where both users will discuss and decide mainly on the messaging app
    - will have more advance feature in the messaging (integrated book inventory, updated status on the messaging feature)
-   Different type of notifications 
- Review user and book
- Revenue Model:
    - Instead of charging users, the app will generate revenue through advertisements, once enough traction is gained.