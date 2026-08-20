# Output Response Architecture & Guidelines

This document outlines the standard behavior and UI/UX expectations for handling AI agent output responses (the "assistant" messages) across the application. These guidelines ensure a consistent, interactive, and highly premium reading experience.

## 1. Rich Content Rendering
- **Markdown & Typography**: All output responses must support robust markdown rendering, including hierarchical headings (`h2`, `h3`), lists, bolding, and inline code. 
- **Layout Margins**: Responses must sit flush below their generating workflow or query (using `mt-0`), avoiding unnecessary whitespace gaps.

## 2. Interactive Text Selection
Output text must not be static. 
- **SelectableText Wrapper**: Critical text blocks should be wrapped in a selectable component that intercepts the native browser selection.
- **Context Toolbar**: When a user highlights a snippet of text, a floating toolbar must appear offering contextual actions:
  - **Quote**: For quoting the selected text in the next user query.
  - **Explain**: To spawn a sub-query asking the agent to clarify the selection.
  - **Rewrite**: To ask the agent to rewrite the selected snippet.

## 3. Embedded Media and Artifacts
Output responses are multimodal and can return actionable items alongside text:
- **Artifacts**: Code blocks or extensive documents should be rendered as an `ArtifactCard`, providing a clean, clickable entry point to open the dedicated Artifact Editor panel.
- **Attachments**: Standard files and images should be rendered via the `MessageAttachments` component.
- **Image Lightboxing**: Any image attachments clicked within the response must open in a full-screen `ImageViewer` lightbox.

## 4. Message Action Bar
Every output response must include a hover-activated action bar at the bottom. 

### Hover Visibility Rules
- **Container Hover**: The entire action bar remains hidden (`opacity-0`) until the user hovers anywhere over the parent message block (`group-hover:opacity-100`). This ensures a clean reading experience until interaction is desired.
- **Transitions**: The fade-in must be smooth (`transition-opacity duration-200`).

### Action Buttons & Micro-interactions
Individual buttons within the action bar must be highly responsive to cursor hover:
- **Copy Message**: Copies the raw markdown. On hover, the button background changes to a neutral shade (`hover:bg-gray-100`) and the icon darkens (`hover:text-gray-800`).
- **Feedback (RLHF)**: 
  - **Thumbs Up**: On hover, the background must transition to a subtle green (`hover:bg-green-50`) and the icon to bold green (`hover:text-green-600`).
  - **Thumbs Down**: On hover, the background must transition to a subtle red (`hover:bg-red-50`) and the icon to bold red (`hover:text-red-600`).
- **Regenerate**: On hover, the background must transition to a subtle blue (`hover:bg-blue-50`) and the icon to bold blue (`hover:text-blue-600`).
- **Tooltips**: Every button must include a native tooltip (`title` attribute) indicating its explicit function.

## 5. Telemetry & Timing 
- **Stats Display**: At the bottom right of the message (aligned with the action bar), the `MessageTiming` component must be displayed.
- **Hover Visibility Rules**: Just like the action bar, the telemetry stats must remain hidden (`opacity-0`) and smoothly fade in on hover (`group-hover:opacity-100 transition-opacity duration-200`) to maintain a clean reading experience.
- **Metrics**: It should convey performance transparency, including metrics like:
  - `ttft` (Time to First Token)
  - `total` (Total generation time)
  - `tok/s` (Tokens per second)
  - `tokens` (Total tokens used)
  - `cost` (Estimated cost)

## 6. Suggestions (Next Steps)
When an agent completes a workflow or provides a final response, it should proactively offer follow-up actions:
- **Placement**: Suggestions must be rendered at the very bottom of the response block, immediately after the action bar/telemetry.
- **Format**: They should be presented as clickable pills or buttons (via the `Suggestions` component).
- **Behavior**: Clicking a suggestion should instantly populate the main input query box and grant it keyboard focus, allowing the user to seamlessly continue the conversation.
