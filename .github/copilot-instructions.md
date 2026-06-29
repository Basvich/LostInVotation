# Copilot Instructions

This file helps coding agents work quickly and safely in this repository.

## Project Snapshot

- Framework: Angular 21 standalone app
- Package manager: npm (see packageManager in package.json)
- Styling: SCSS
- Tests: Angular unit tests via ng test (Vitest-backed in this template)

## High-Value Paths

- App entry: src/main.ts
- Root component: src/app/app.ts
- App config providers: src/app/app.config.ts
- Router config: src/app/app.routes.ts
- Project config: angular.json
- Scripts and dependencies: package.json
- Architecture guidance: context/agent.md
- Basic project usage: README.md

## Commands Agents Should Run

- Install dependencies: npm install
- Start dev server: npm start
- Run tests: npm test
- Build production bundle: npm run build
- Development watch build: npm run watch

Prefer npm scripts over direct ng commands unless a script is missing.

## Working Conventions

- Keep Angular code standalone-first, matching existing files.
- Use SCSS for component styles.
- Prefer separate files for component logic, template, and styles in pages and components, unless the component is very small and trivial.
- Prefer shared, global, or reusable style utilities over repeating the same styles in each component.
- Keep route definitions in src/app/app.routes.ts unless a feature introduces route files.
- Keep provider wiring in src/app/app.config.ts.
- Follow existing naming and file placement patterns when adding components or services.
- Make minimal, focused edits and avoid broad refactors unless requested.

## TypeScript and Angular Standards

Use these rules for all new or modified Angular and TypeScript code in this repository.

### TypeScript Best Practices

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid the any type; use unknown when a type is uncertain.

### Angular Best Practices

- Use standalone components over NgModules.
- Do not set standalone: true in decorators; standalone is the default in Angular v20+.
- Use signals for state management.
- Implement lazy loading for feature routes.
- Do not use @HostBinding or @HostListener; use the host object in @Component or @Directive metadata.
- Use NgOptimizedImage for static images. It does not support inline base64 images.

### Accessibility Requirements

- Changes must pass AXE checks.
- Changes must meet WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Component Guidelines

- Keep components small and focused on a single responsibility.
- For pages and non-trivial components, prefer separate .ts, .html, and .scss files; inline templates and styles are only preferred for very small, trivial components.
- Use input() and output() functions instead of decorators.
- Use computed() for derived state.
- Set changeDetection: ChangeDetectionStrategy.OnPush in component metadata.
- Prefer inline templates for small components.
- Prefer reactive forms over template-driven forms.
- Do not use ngClass; use class bindings.
- Do not use ngStyle; use style bindings.
- For external templates and styles, use paths relative to the component TypeScript file.
- Prefer shared styles, global primitives, and reusable utility classes before adding duplicated component-specific styling.

### State Management

- Use signals for local component state.
- Use computed() for derived state.
- Keep state transformations pure and predictable.
- Do not use mutate on signals; use set or update.

### Template Guidelines

- Keep templates simple and avoid complex logic.
- Use native control flow (@if, @for, @switch) instead of *ngIf, *ngFor, *ngSwitch.
- Use the async pipe for observables in templates.
- Do not assume globals like new Date() are available in templates.

### Service Guidelines

- Design services around a single responsibility.
- Use providedIn: 'root' for singleton services.
- Prefer inject() over constructor injection.

## Testing Expectations

- For behavior changes, update or add tests in *.spec.ts files.
- Run npm test after meaningful code changes.
- If tests cannot run locally, report that clearly in your handoff.

## Architecture Notes

The current codebase is minimal. For planned folder organization and scaling conventions, see:

- [App and library structure guidance](../context/agent.md)

Use that document as a target structure when adding substantial new features, but align with the current repository state and avoid creating empty scaffolding without a user request.

## Documentation Links

- [Project README](../README.md)
- [Angular CLI docs](https://angular.dev/tools/cli)

## Agent Guardrails

- Do not modify unrelated files.
- Do not commit or rewrite git history unless explicitly asked.
- Call out assumptions when requirements are ambiguous.
