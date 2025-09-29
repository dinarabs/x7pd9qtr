# Comments App - React + TypeScript + RxDB

A modern, local-first comment system with nested replies, real-time persistence, and cross-tab synchronization.

## ✨ Features
- 💬 **Nested Comments** - Unlimited reply depth with visual hierarchy
- 💾 **Local Persistence** - Data saved in IndexedDB via RxDB
- 🔄 **Cross-tab Sync** - Real-time updates across browser tabs
- 🎨 **Modern UI** - Clean, responsive design with smooth interactions
- 🗑️ **Cascade Delete** - Deleting a comment removes all replies

## 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript
- **Database**: RxDB with Dexie (IndexedDB)
- **Styling**: Inline styles (modern CSS-in-JS approach)
- **Testing**: Vitest + React Testing Library

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📱 Usage
1. Type a comment and click "Add"
2. Reply to any comment using the "Send" button
3. Delete comments (and all their replies) with "Delete"
4. All changes persist automatically and sync across tabs

## 🏗️ Architecture
- **Database Layer**: RxDB with Dexie storage
- **State Management**: Custom React hooks
- **Component Structure**: Recursive tree rendering
- **Data Flow**: Reactive queries with automatic UI updates
