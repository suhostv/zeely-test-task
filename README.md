# Zeely Test Task App

This app is a React + TypeScript project for generating and managing background ideas for a person image. Users can type a prompt, generate backgrounds, view and select from generated ideas, and manage their own background gallery. The UI features a sidebar for prompt input, generation controls, and a gallery of backgrounds.

## Demo

Link for deployed version: https://zeely-test-task-alpha.vercel.app/

https://github.com/user-attachments/assets/9a31e5a2-34ae-42ca-9081-ab77709eb5b3

## Features

- Enter a prompt to generate background ideas
- Regenerate backgrounds for the current prompt
- Browse and select from your background gallery
- Progress indicator while generating

## How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Open the app:**
   Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

To build the app for production:

```bash
npm run build
```

The output will be in the `dist` folder.

## Technologies Used

- React
- TypeScript
- Vite
- Shadcn
- Tailwind

## Important notes

- Main focus was made on UX and UI (user interaction, hover/disabled states, features completion, etc.)
- Images could take long to load initially, since they were taken from Figma in big size and I didn't bother to play with their minification for this test task
- Even though code quality was a priority, file system was not, so most of the main functionality lives in one React component
- Other small things are up for discussion
