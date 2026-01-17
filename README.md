
# 🌳 Nest Filter

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/nest-filter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0%2B-38B2AC.svg)](https://tailwindcss.com/)

**Nest Filter** is an enterprise-grade, highly optimized advanced filtering component for React. It allows users to build complex, nested logical queries (AND/OR) through a beautiful, accessible modal interface.

---

## ✨ Features

- 🚀 **Zero Configuration Logic**: Automatically generates operators based on data types (String, Number, Date, Boolean, Select).
- 🌲 **Infinite Nesting**: Build complex query trees with recursive AND/OR logical blocks.
- ⚡ **Optimized Performance**: Memoized components and stable state management to handle large datasets.
- 🎨 **Shadcn/UI Aesthetic**: Built with Tailwind CSS for a modern, professional look that fits into any dashboard.
- 🛠 **Type Safe**: Fully written in TypeScript with Generic support for your data models.
- 🔍 **Robust Matching**: Built-in normalization (trimming and case-insensitivity) to prevent common filtering bugs.

---

<!-- ## 📺 Visual Preview

### 🖼️ Modal UI
![Advanced Filter Modal Placeholder](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/layers.svg) 
*(Imagine a sleek modal here with nested logic blocks, dropdowns, and clear action buttons)* -->

<!-- ### 🎥 Demo in Action
> [!TIP]
> **View the Interactive Demo Video**
> [![Watch the video](https://img.shields.io/badge/Video-Play_Demo-red?style=for-the-badge&logo=youtube)](https://your-video-link-here.com)

--- -->

## 📦 Installation

```bash
npm install nest-filter
```

> **Note**: This package requires `lucide-react` for icons and `tailwindcss` for styling.

---

## 🚀 Quick Start

```tsx
import { useState } from 'react';
import { AdvancedFilter } from 'nest-filter';

// 1. Define your columns
const COLUMNS = [
  { id: 'name', label: 'Full Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'status', label: 'Status', type: 'select', options: ['Active', 'Paused', 'Banned'] },
  { id: 'is_verified', label: 'Verified', type: 'boolean' },
  { id: 'created_at', label: 'Join Date', type: 'date' },
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(MY_RAW_DATA);
  const [filteredData, setFilteredData] = useState(MY_RAW_DATA);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Filters</button>
      
      <AdvancedFilter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
        columns={COLUMNS}
        setFilteredData={setFilteredData}
      />

      {/* Render your table using filteredData */}
    </div>
  );
}
```

---

## 📖 API Documentation

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | Yes | Controls the visibility of the modal. |
| `onClose` | `() => void` | Yes | Callback fired when the modal requests to close. |
| `data` | `T[]` | Yes | Your raw array of objects to be filtered. |
| `columns` | `ColumnDefinition<T>[]` | Yes | Configuration for which fields can be filtered. |
| `setFilteredData` | `(data: T[]) => void` | Yes | Callback that receives the newly filtered array after "Apply". |
| `initialFilters` | `FilterGroup<T>` | No | Pass an existing filter tree to restore state. |

### Column Definition Object

```typescript
interface ColumnDefinition<T> {
  id: keyof T;        // The key in your data object
  label: string;      // Human-readable name shown in UI
  type: ColumnType;   // 'string' | 'number' | 'date' | 'boolean' | 'select'
  options?: string[]; // Required ONLY if type is 'select'
}
```

---

## 🔍 Filtering Logic Details

**Nest Filter** uses a deep-recursive evaluation engine. Here is how it handles different types:

- **String**: Normalizes both data and input (trimmed, lowercase) to ensure "Exact Match" works even with copy-pasted whitespace.
- **Select**: Provides a dropdown of your predefined `options`. It performs an exact, case-insensitive match against the record.
- **Number**: Converts inputs to floats and supports standard mathematical operators (`>`, `<`, `<=`, etc.).
- **Date**: Handles timestamp strings or Date objects, offering "Before", "After", and "On Date" comparisons.
- **Boolean**: Simply toggles the rule to filter for `true` or `false` states without needing an input value.

---

## 🎨 Customization

The component uses **Tailwind CSS**. To ensure the modal looks perfect, make sure your `tailwind.config.js` includes the `nest-filter` node module path (if you are shipping styles separately) or that your project has the standard Shadcn-like colors defined (`slate`, `blue`, etc.).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/nest-filter/issues).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ for the Developer Community
</p>
