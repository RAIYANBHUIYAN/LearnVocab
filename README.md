# Daily Dictionary

Daily Dictionary is a fullstack web application that helps you keep track of new words you learn. Store the words along with their definitions, example usage, and categorize them with tags for easy reference later.

![Daily Dictionary App Screenshot](assets/screenshot.png)

## Features

- **Word Management**: Add, edit, and delete words in your personal dictionary
- **Rich Word Information**: Store the word, definition, example usage, tags, and date learned
- **Search & Filter**: Easily find words by searching or filtering by tags
- **Responsive Design**: Works great on desktop and mobile devices
- **Persistent Storage**: Uses PostgreSQL database to securely store your words

## Tech Stack

### Frontend
- React
- TanStack Query (React Query)
- Tailwind CSS
- Shadcn UI Component Library
- Wouter for Routing

### Backend
- Node.js
- Express.js
- PostgreSQL database
- Drizzle ORM
- Zod for validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RAIYANBHUIYAN/LearnVocab.git
   cd LearnVocab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/daily_dictionary
   ```

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5000`

## Usage

### Adding a Word

1. Click the "+" button in the header
2. Fill in the word details (word, definition, example, tags)
3. Click "Add Word"

### Filtering Words

Use the tag dropdown to filter words by specific categories.

### Searching Words

Use the search box to find words by matching text in the word, definition, or example.

## Deployment

The application can be deployed to any platform that supports Node.js applications and PostgreSQL databases. Popular options include:

- Heroku
- Render
- Vercel
- Railway

Make sure to set up the appropriate environment variables for your database connection.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [TanStack Query](https://tanstack.com/query) for data fetching
