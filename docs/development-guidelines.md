# Development Guidelines

This document outlines the best practices and conventions to follow when working on the Vyoniq project.

## Package Management with pnpm

This project uses `pnpm` as its package manager. It's crucial to use `pnpm` for all dependency management to ensure consistency across all development environments and to leverage its performance and disk space-saving benefits.

### Installing Dependencies

To install all project dependencies, run:

```bash
pnpm install
```

### Adding a Dependency

To add a new dependency, use:

```bash
pnpm add <package-name>
```

For a development dependency, use the `-D` flag:

```bash
pnpm add -D <package-name>
```

## Running Scripts and One-Off Commands

For running one-off commands or executing packages without permanently installing them (e.g., scaffolding tools like `shadcn-ui`), it is best practice to use `pnpm dlx` (which stands for "download and execute"). This is the `pnpm` equivalent of `npx`.

Using `pnpm dlx` ensures that we are not relying on a globally installed `npx` or `npm` and keeps our tooling consistent.

### Example: Adding a UI Component

When you need to add a new component from our UI library (`shadcn/ui`), use the `pnpm dlx` command:

```bash
pnpm dlx shadcn@latest add <component-name>
```

By following these guidelines, we can maintain a clean, consistent, and efficient development workflow.
