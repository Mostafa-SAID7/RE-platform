# Contributing to Real Estate Platform

Thank you for your interest in contributing to the Real Estate Analytics & Property Management Platform!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/real-estate-platform.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

See the [Getting Started Guide](GETTING_STARTED.md) for detailed setup instructions.

## Code Style

### TypeScript
- Use TypeScript strict mode
- Follow Angular style guide
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Angular Components
- Use standalone components
- Use OnPush change detection strategy
- Use signals for local state
- Use NgRx for global state
- Follow the single responsibility principle

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Ensure responsive design
- Maintain accessibility standards

## Commit Messages

Follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add property filtering by location
fix: resolve memory leak in map component
docs: update API integration guide
```

## Testing

- Write unit tests for all new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage

```bash
npm test
npm test -- --code-coverage
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update the README if needed
5. Request review from maintainers

## Code Review

- Be respectful and constructive
- Address all review comments
- Keep PRs focused and small
- Respond to feedback promptly

## Reporting Bugs

Use GitHub Issues to report bugs. Include:

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

## Feature Requests

Use GitHub Issues for feature requests. Include:

- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)

## Questions?

Feel free to open a GitHub Discussion or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
