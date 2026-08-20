# Input Query Architecture & Guidelines

This document outlines the standard behavior and UI/UX expectations for handling user input queries across the application. These guidelines must be strictly adhered to whenever implementing or refactoring query inputs.

## 1. Core Submission Flow
- **State Management**: Input text should be tracked in a localized state (e.g., `promptText`). Upon submission, the finalized string must be committed to a submitted state (e.g., `submittedQuery`) and the input box cleared.
- **UI Reset on Submit**: 
  - The textarea height must be reset to its default size.
  - Keyboard focus must be removed (`blur()`) to prevent ghost inputs.
  - Active application flows (like error states or Human-in-the-Loop active flags) should be reset unless explicitly designed to persist.

## 2. Query Branching & Editing (Mandatory for standard queries)
All standard input queries must support ChatGPT-style branching and editing.
- **Edit Mode**: Standard query bubbles must display an "Edit" (pencil) action on hover. Clicking this replaces the bubble with an editable textarea.
- **Branch History**: Submitting an edited query **must not overwrite** the original query. Instead, it must be pushed to a branch history array (e.g., `queryBranches`).
- **Pagination**: If multiple branches exist, a pagination control (e.g., `< 1 / 2 >`) must be displayed next to the query bubble, allowing the user to navigate back and forth between previous versions of their prompt.

## 3. Human-in-the-Loop (HITL) Submissions
**EXCEPTION:** HITL (Human-in-the-Loop) submissions and questionnaire responses are explicitly **NON-EDITABLE**. 
- They must not feature the "Edit" pencil icon.
- They do not support branching or pagination.
- Once a HITL response is submitted, it is final for that specific workflow step.

## 4. Copy Action
- All standard query bubbles must include a "Copy" action next to the Edit action.
- This action must use the native `navigator.clipboard.writeText()` API to copy the exact submitted text to the user's clipboard.

## 5. Keyboard Shortcuts
Input areas must support standard messaging keybindings:
- **`Enter`**: Submits the query.
- **`Shift + Enter`**: Inserts a new line without submitting.

## 6. Interactions & Micro-animations
To maintain a premium feel, all query blocks must implement smooth interactive states:
- **Group Hover Actions**: The action bar (Edit/Copy) must be wrapped in a container that remains hidden (`opacity-0`) by default, and fades in (`opacity-100`) with a smooth transition (`transition-opacity duration-200`) when the user hovers over the entire message block (`group-hover`).
- **Button Hover States**: Individual action buttons (like Pencil or Copy) must feature micro-interactions:
  - On hover, the icon color should transition to a darker shade (e.g., `text-gray-400 hover:text-gray-800`).
  - The button background should transition to a solid or elevated color (e.g., `hover:bg-white hover:shadow-sm`) to indicate it is clickable.
- **Tooltips**: Every action button must have a descriptive tooltip (using the `title` attribute or a custom tooltip component) explaining its function (e.g., "Edit query", "Copy query").
- **Disabled States**: For branch navigation (e.g., `< 1 / 2 >`), arrows must clearly indicate disabled boundaries (e.g., when at the first or last branch) by dropping their opacity (`disabled:opacity-30`) and disabling hover effects.
