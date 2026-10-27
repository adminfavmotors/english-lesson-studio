# One interface theme

Lesson Studio uses Source Sans 3 and one warm neutral/forest-green palette across
the public homepage, account entry, teacher workspace and student pages. Role
boundaries remain in navigation, labels and permissions. They do not replace the
global colour tokens or the document font.

- `theme.css` owns the font family, colours and shared radii. Component CSS uses
  semantic tokens, including success, error and warning states.
- `foundation.css` owns the reset, shared buttons, inputs and focus indicators.
- `workspace.css`, `students.css` and `materials.css` contain workspace layouts
  and component rules. `landing.css`, `auth.css` and `workspace-routes.css` own
  their respective layouts, using the same foundation.
- `app.css` imports all product CSS in a fixed order. `main.tsx` imports this one
  entry. Page components must not import CSS or append theme override rules.
- `index.html` preloads the four Latin font weights used by the interface.
  Fontsource keeps other scripts available for user-written names and answers.

There are no page-local colour palettes, alternative display fonts, legacy
role-choice screens or old teacher account form styles. The remaining
`!important` declarations apply only to the reduced-motion accessibility rule.

`AppLink` uses the existing client router for ordinary links within the public
pages or within one workspace, preserving the current document, styles and
loaded fonts. It retains normal behaviour for modified clicks and new tabs.
Invitation links, account callbacks and cross-workspace links initialise a fresh
document so startup credentials and workspace-specific stores remain isolated.
Hash links retain native anchor behaviour.

When changing the theme, check the public entry, sign-in, teacher navigation,
student practice and narrow layouts. Use local synthetic UI fixtures for style
review; do not grant production accounts additional roles for visual checks.
