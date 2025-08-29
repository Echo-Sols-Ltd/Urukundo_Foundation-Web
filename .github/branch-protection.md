# Branch Protection Setup

To ensure that code with errors cannot be merged, you need to set up branch protection rules in GitHub. Follow these steps:

## 1. Go to Repository Settings
- Navigate to your repository on GitHub
- Click on "Settings" tab
- Click on "Branches" in the left sidebar

## 2. Add Branch Protection Rule
- Click "Add rule" or "Add branch protection rule"
- In "Branch name pattern", enter: `main` (or your default branch name)
- Check the following options:

### Required Status Checks
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Select the following status checks:
  - `frontend-lint` (Frontend - Lint and Format Check)
  - `frontend-test` (Frontend - Run Tests)
  - `frontend-build` (Frontend - Build Check)
  - `backend-build` (Backend - Build Check)
  - `security-audit` (Security Audit)
  - `integration-tests` (Integration Tests) - Optional, only if you have integration tests

### Additional Protections
- ✅ **Require pull request reviews before merging**
- ✅ **Require review from code owners** (if you have a CODEOWNERS file)
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require conversation resolution before merging**

### Restrictions
- ✅ **Restrict pushes that create files that are larger than 100 MB**
- ✅ **Block force pushes**
- ✅ **Block deletions**

## 3. Apply to Additional Branches
- Repeat the process for other important branches like `develop`
- You can use patterns like `develop*` to protect all develop branches

## 4. Save Changes
- Click "Create" or "Save changes"
- Confirm the changes

## Result
After setting this up:
- ✅ Pull requests must pass all CI checks before merging
- ✅ Direct pushes to protected branches are blocked
- ✅ Code with errors cannot be merged
- ✅ Team members must fix issues before code can be merged

## Project Structure
This CI pipeline expects the following structure:
```
charityApp/
├── frontend/          # Next.js application
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── backend/           # Spring Boot application
│   ├── pom.xml
│   └── ...
└── .github/
    └── workflows/
        └── ci.yml
```

## Optional: Create CODEOWNERS File
Create `.github/CODEOWNERS` to automatically request reviews from specific team members:

```
# Global owners
* @your-username @team-member-1 @team-member-2

# Frontend specific
frontend/ @frontend-team
*.js @frontend-team
*.ts @frontend-team

# Backend specific
backend/ @backend-team
*.java @backend-team
*.xml @backend-team

# DevOps
.github/ @devops-team
*.yml @devops-team
*.yaml @devops-team
```
