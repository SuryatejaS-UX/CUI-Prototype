# Image Generation and Expand Viewer Guidelines

This document outlines the architecture, layout structure, and interaction mechanics of the Image Generation feature and the full-screen Expand Viewer (`ImageViewer`) within the application.

## 1. Image Generation Flow (`ImageGeneration.tsx`)

The Image Generation component handles the rendering of AI-generated images within the chat interface.

### Structure & States
- **Loading State**: Displays a sleek, pulsing skeleton placeholder that mimics the dimensions of the final image. It includes a shimmering gradient effect to indicate processing.
- **Completed State**: The generated image is displayed within a `rounded-3xl` container. The container utilizes `overflow-hidden` to ensure the image respects the border radius.
- **Interaction**: The image container is wrapped in a clickable area (`cursor-pointer`). An invisible overlay with an "Expand" icon (`Maximize2`) appears on hover (`group-hover:opacity-100`).
- **Triggering the Modal**: Clicking the generated image sets an `isModalOpen` state to true, which mounts the `ImageViewer` component, passing the `src` and `alt` tags.

## 2. Expand Viewer (`ImageViewer.tsx`)

The Expand Viewer is a high-fidelity modal designed to let users inspect attachments or generated images closely without leaving their context.

### Modal Architecture & Portals
> [!IMPORTANT]
> The `ImageViewer` component utilizes **React Portals** (`createPortal(..., document.body)`).

**Why Portals?**
The Markdown Response chat blocks use CSS animations (like `animate-in` and `slide-in-from-bottom`). These animations rely on CSS `transform`. According to the CSS specification, any element with a `transform` creates a new containing block for `fixed` descendants. If the viewer was not portaled, its `fixed inset-0` would be trapped inside the chat bubble's bounding box instead of covering the viewport. Portaling to `document.body` guarantees a true full-screen overlay.

### Layout Details
The viewer mimics a dedicated application window with a white card layout:
- **Backdrop**: A `fixed` background (`bg-black/50 backdrop-blur-sm`) that covers the entire screen.
- **Modal Card**: A large, white container (`w-[95vw] max-w-[1600px] bg-white rounded-xl shadow-2xl`).
- **Header**: Contains the image title and a subtle `X` close button, defined as a `flex-none` container to keep it pinned to the top.
- **Content Area**: The middle section uses `flex-1 overflow-auto bg-white p-8`. This allows the image to scale independently.
- **Footer/Toolbar**: A `flex-none` bottom row containing a white toolbar with zoom, reset, and export buttons. Keeping it separate from the image container ensures the toolbar never obscures the image content.

## 3. Panning and Zooming Mechanics

The viewer features native-feeling pan and zoom capabilities tailored for both trackpad and mouse users.

### Touchpad Pinch-to-Zoom
- **Implementation**: Listens to the `wheel` event and checks for `e.ctrlKey` or `e.metaKey` (which modern touchpads emit for pinch gestures).
- **Global Interception**: The `wheel` listener is attached directly to the global `window` object with `{ passive: false }`.
  - **Why `window`?** The browser's native page-zoom is extremely aggressive. By attaching the listener globally while the modal is open, we guarantee the event is intercepted and stopped (`e.preventDefault()`, `e.stopPropagation()`) before the browser can zoom the entire application UI.
- **Scaling**: The pinch delta is converted into a `zoomLevel` state constraint between `0.25x` and `5x`, which is applied to the image via inline styles: `transform: scale(${zoomLevel})`.

### Panning
- **Trackpad Panning**: Native two-finger scrolling works automatically because the image container utilizes `overflow-auto`.
- **Mouse Drag-to-Pan**: 
  - Implemented via `onPointerDown`, `onPointerMove`, and `onPointerUp`.
  - Captures the initial pointer position and the container's `scrollLeft`/`scrollTop`.
  - Calculates the delta as the pointer moves and dynamically updates the scroll positions.
  - The cursor dynamically updates from `cursor-grab` to `cursor-grabbing`.
  - **Note**: The actual `<img>` tag must have `pointer-events-none` to prevent the browser's default "drag image" behavior from hijacking the custom pan logic.
