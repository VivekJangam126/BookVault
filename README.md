
# BookVault

BookVault is a modern web application for managing, searching, and reviewing books. Built with React and Node.js, it offers a seamless experience for users and admins to explore, favorite, and provide feedback on books.

## Features

- Browse and search books
- View detailed book information
- Add books to favorites
- Submit and monitor feedback
- Admin dashboard for activity logs and feedback management

## Demo

View your app in AI Studio: [BookVault Demo](https://ai.studio/apps/6c85fcdc-b874-48f8-8c36-40519fedf0fb)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VivekJangam126/BookVault.git
   cd BookVault
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```
4. Run the app locally:
   ```bash
   npm run dev
   ```

## Folder Structure

```
BookVault/
├── data/                # JSON data files
├── src/                 # Source code
│   ├── components/      # React components
│   ├── data/            # Book data
│   ├── pages/           # Page components
│   ├── services/        # Service modules
│   └── styles/          # CSS styles
├── server.js            # Node.js server
├── package.json         # Project metadata
└── README.md            # Project documentation
```

## Environment Variables

Set your Gemini API key in `.env.local`:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
