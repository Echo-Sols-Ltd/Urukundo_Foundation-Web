# Charity App

A modern charity application built with Next.js frontend and Spring Boot backend, featuring automated quality checks to prevent code errors from being merged.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: Spring Boot 3+ with Java 17
- **Database**: (Configure based on your needs)
- **CI/CD**: GitHub Actions with comprehensive quality gates

## 🚀 CI/CD Pipeline

This repository uses GitHub Actions to ensure code quality and prevent errors from being merged. The pipeline runs automatically on every pull request and push to protected branches.

### What Gets Checked

#### Frontend (Next.js)

1. **Linting & Formatting** - ESLint and Prettier checks
2. **Testing** - Unit tests with Jest/React Testing Library
3. **Build Check** - Next.js build verification
4. **Type Checking** - TypeScript compilation

#### Backend (Spring Boot)

1. **Compilation** - Maven/Gradle build verification
2. **Testing** - Unit tests execution
3. **Packaging** - JAR/WAR file creation

#### Security & Quality

1. **Security Audit** - Dependency vulnerability scanning
2. **Integration Tests** - End-to-end testing (if configured)

### Branch Protection

The `main` and `develop` branches are protected and require:

- All CI checks to pass
- Pull request reviews
- Up-to-date branches
- No force pushes

### How It Works

1. Developer creates a feature branch
2. Makes changes and pushes code
3. Creates a pull request to main/develop
4. GitHub Actions automatically runs all checks
5. If any check fails, the PR cannot be merged
6. Developer must fix issues before merging

## 📁 Project Structure

```bash
charityApp/
├── frontend/          # Next.js application
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── src/
├── backend/           # Spring Boot application
│   ├── pom.xml
│   ├── src/
│   └── target/
└── .github/
    └── workflows/
        └── ci.yml
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run local checks:
   - **Frontend**: `cd frontend && npm run lint && npm run test && npm run build`
   - **Backend**: `cd backend && mvn clean test`
5. Create a Pull Request

## 📋 Requirements

### Frontend

- Node.js 18.x or higher
- npm or yarn package manager

### Backend

- Java 17 or higher
- Maven 3.6+ or Gradle 7+

### General

- Git for version control

## 🔧 Local Development Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

## 🚀 Deployment

The CI pipeline ensures that only code that passes all quality checks can be deployed. Each environment should have its own deployment workflow triggered by successful CI runs.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
