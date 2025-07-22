# Vona Backend

The Vona Backend is a Node.js-based REST API for a commerce platform, powering features like a chatbot, product search, user authentication, and order management. Built with TypeScript, Express, Prisma, MySQL, Elasticsearch, and Google Generative AI, it provides a scalable and secure backend for the Vona e-commerce application.

## Features

- **Chatbot**: Handles user queries (e.g., price checks, product comparisons) using Google Generative AI for natural language processing and Elasticsearch for product search.
- **Product Search**: Indexes and searches products using Elasticsearch.
- **User Authentication**: JWT-based authentication for secure access.
- **Database**: MySQL with Prisma ORM for managing users, conversations, messages, products, and orders.
- **Dockerized Services**: Runs MySQL and Elasticsearch in Docker containers for consistent development and deployment.

## Project Structure

```
project/
├── configs/                   # Configuration files (e.g., database)
├── controllers/               # API controllers (e.g., chatbot, user, order)
├── middleware/                # Express middleware (e.g., JWT, error handling)
├── repositories/              # Data access layer (Prisma queries)
├── routes/                    # Express route definitions
├── types/                     # TypeScript interfaces
├── utils/                     # Utility functions (e.g., NLP, LLM)
├── prisma/                    # Prisma schema and seed scripts
├── scripts/                   # Utility scripts (e.g., indexing, token generation)
├── docker/                    # Docker volume data (MySQL)
├── .env                       # Environment variables
├── app.ts                     # Main application entry
├── docker-compose.yml         # Docker services (MySQL, Elasticsearch)
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher
- **Docker**: For running MySQL and Elasticsearch
- **MySQL**: v5.7 (via Docker or local)
- **Elasticsearch**: v8.15.0 (via Docker or local)
- **Google Generative AI API Key**: For chatbot NLP and responses
- **JWT Secret**: For authentication

## Setup

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd tiki-backend
   ```

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=mysql://root:root@localhost:3306/tiki_backend
   ELASTICSEARCH_URL=http://localhost:9200
   GOOGLE_AI_API_KEY=your_google_api_key
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

   Replace `your_google_api_key` and `your_jwt_secret` with valid values.

4. **Set Up Docker**:

   Start MySQL and Elasticsearch:

   ```bash
   docker compose up -d
   ```

   Verify services:

   ```bash
   docker ps
   curl http://localhost:9200
   mysql -h localhost -P 3306 -u root -p tiki_backend
   ```

5. **Run Database Migrations**:

   ```bash
   npx prisma migrate dev --name init
   ```

6. **Seed the Database**:

   ```bash
   pnpm prisma:seed
   ```

7. **Index Products in Elasticsearch**:

   ```bash
   ts-node -r tsconfig-paths/register scripts/indexProducts.ts
   ```

8. **Start the Application**:

   ```bash
   pnpm start
   ```

   The server runs on `http://localhost:3000`.

## Usage

### API Endpoints

- **Chatbot**:

  - `POST /chatbot`: Send a user query to the chatbot.
    ```bash
    curl -X POST http://localhost:3000/chatbot \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <token>" \
      -d '{
        "question": "So sánh iPhone 14 Pro Max với Samsung Galaxy S23",
        "conversationId": "chat_2",
        "chatTitle": "Product Comparison"
      }'
    ```
  - `GET /chatbot/conversations`: List user conversations.
  - `GET /chatbot/messages/:chatId`: Get messages for a conversation.
  - `PUT /chatbot/:chatId`: Update conversation title.
  - `DELETE /chatbot/:chatId`: Delete a conversation.

- **Authentication**:
  - (Assumed) `POST /login`: Generate a JWT token.
    ```bash
    curl -X POST http://localhost:3000/login \
      -H "Content-Type: application/json" \
      -d '{"username": "admin", "password": "your_password"}'
    ```

### Generating a JWT Token

Run the token generation script:

```bash
ts-node -r tsconfig-paths/register scripts/generateToken.ts
```

Use the output token in API requests.

## Testing

1. **Compile TypeScript**:

   ```bash
   npx tsc
   ```

2. **Test Chatbot Endpoint**:

   ```bash
   curl -X POST http://localhost:3000/chatbot \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{
       "question": "Giá của Sữa Ensure là bao nhiêu?",
       "conversationId": "chat_1",
       "chatTitle": "Price Inquiry"
     }'
   ```

3. **Verify Database**:

   ```sql
   SELECT * FROM conversations;
   SELECT * FROM messages;
   ```

4. **Verify Elasticsearch**:

   ```bash
   curl http://localhost:9200/products/_search
   ```

5. **Unit Tests** (if implemented):

   ```bash
   pnpm test
   ```

## Troubleshooting

- **JWT Errors**:

  - Ensure `JWT_SECRET` matches the token’s signing secret.
  - Regenerate the token:

    ```bash
    ts-node -r tsconfig-paths/register scripts/generateToken.ts
    ```

- **Database Errors**:

  - Check MySQL connection:

    ```bash
    mysql -h localhost -P 3306 -u root -p tiki_backend
    ```

  - Reseed:

    ```bash
    pnpm prisma:seed
    ```

- **Elasticsearch Errors**:

  - Verify service:

    ```bash
    curl http://localhost:9200
    ```

  - Reindex:

    ```bash
    ts-node -r tsconfig-paths/register scripts/indexProducts.ts
    ```

- **Gemini API Errors**:

  - Validate `GOOGLE_AI_API_KEY` in `.env`.
  - Test API:

    ```bash
    ts-node -r tsconfig-paths/register scripts/testGemini.ts
    ```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

---

### Explanation

1. **Content**:

   - **Overview**: Describes the Vona Backend as a Node.js/TypeScript API for e-commerce, highlighting key features (chatbot, product search, authentication).
   - **Project Structure**: Lists key directories and files, reflecting the structure from previous responses.
   - **Prerequisites**: Specifies required tools and versions (Node.js, pnpm, Docker, etc.).
   - **Setup**: Provides step-by-step instructions for cloning, installing, configuring, and running the app, including Docker, Prisma, and Elasticsearch.
   - **Usage**: Details API endpoints (focused on `/chatbot` routes) and token generation.
   - **Testing**: Guides on testing endpoints, database, and Elasticsearch, with placeholders for unit tests.
   - **Troubleshooting**: Addresses common issues (JWT, database, Elasticsearch, Gemini API) with fixes.
   - **Contributing**: Outlines standard Git workflow for contributions.
   - **License**: Uses MIT License as a default (adjust if needed).

2. **Alignment with Project**:

   - Reflects the Dockerized MySQL and Elasticsearch setup (`docker-compose.yml`).
   - Matches the TypeScript files (`chatbot.controller.ts`, `chatbot.route.ts`, `nlp.ts`, `chatbot.ts`).
   - Incorporates Prisma (`schema.prisma`, `seed.ts`), JWT (`verifyToken.middleware.ts`), and Google Generative AI (`nlp.ts`, `chatbot.ts`).
   - Assumes a `/login` endpoint for JWT generation (adjust if absent).

3. **Assumptions**:
   - The project name is “Vona Backend” (based on `tiki_backend` database).
   - No unit tests exist yet (added placeholder for `pnpm test`).
   - The repository URL is placeholder (`<repository-url>`).
   - MIT License is assumed (replace with your license if different).

---

### Next Steps

1. **Save the README**:

   - Place `README.md` in the project root.
   - Verify formatting in a Markdown viewer (e.g., GitHub, VS Code).

2. **Customize**:

   - Replace `<repository-url>` with the actual Git repository URL.
   - Update `your_password` and `your_google_api_key` if exposing publicly.
   - Add specific endpoints (e.g., `/order`, `/product`) if other controllers (`order.controller.ts`) are implemented.
   - Include unit test setup if tests exist (e.g., Jest, Mocha).

3. **Test Instructions**:

   - Run the commands in the “Setup” and “Usage” sections to ensure they work.
   - Example:

     ```bash
     docker compose up -d
     pnpm install
     npx prisma migrate dev --name init
     pnpm prisma:seed
     ts-node -r tsconfig-paths/register scripts/indexProducts.ts
     pnpm start
     ```

   - Test the `/chatbot` endpoint:

     ```bash
     curl -X POST http://localhost:3000/chatbot \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"question": "So sánh iPhone 14 Pro Max với Samsung Galaxy S23", "conversationId": "chat_2", "chatTitle": "Product Comparison"}'
     ```

4. **Add Missing Sections**:

   - If you have a front-end, deployment instructions (e.g., AWS, Heroku), or CI/CD (e.g., GitHub Actions), share details to include.
   - If PayPal integration (`paypalApi.util.ts`) is critical, add a section:

     ````markdown
     ### PayPal Integration

     - Configure PayPal credentials in `.env`:
       ```env
       PAYPAL_CLIENT_ID=your_client_id
       PAYPAL_SECRET=your_secret
       ```
     ````

     - Use the `/order` endpoint to process payments.

     ```

     ```

5. **Share Feedback**:
   - If sections need adjustment (e.g., specific deployment steps, additional features), share details.
   - If other files (e.g., `app.ts`, `order.controller.ts`) need documentation, provide them.
