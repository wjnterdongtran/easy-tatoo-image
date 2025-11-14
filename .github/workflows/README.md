# GitHub Actions for Vercel Deployment

This directory contains GitHub Actions workflows for automated deployment to Vercel.

## Setup Instructions

To enable automated Vercel deployments, you need to configure the following secrets in your GitHub repository:

### Required Secrets

1. **VERCEL_TOKEN**
   - Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
   - Create a new token with appropriate scope
   - Copy the token

2. **VERCEL_ORG_ID**
   - Run `vercel project list` in your local project
   - Or find it in `.vercel/project.json` after linking your project
   - Copy the `orgId`

3. **VERCEL_PROJECT_ID**
   - Run `vercel project list` in your local project
   - Or find it in `.vercel/project.json` after linking your project
   - Copy the `projectId`

### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each of the three secrets above

## How It Works

The workflow automatically:

- **Production Deployments**: Triggers on push to `main` or `master` branch
- **Preview Deployments**: Triggers on pull requests to `main` or `master` branch
- **PR Comments**: Automatically comments on PRs with the preview deployment URL

## Workflow File

- `vercel-deploy.yml` - Main deployment workflow

## Local Setup (Optional)

To link your local project to Vercel:

```bash
npm install -g vercel
vercel link
```

This will create a `.vercel` directory with your project configuration.
