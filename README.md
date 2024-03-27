![vercel](https://vercelbadge.vercel.app/api/hmdnprks/web-pokemon-evolution?style=for-the-badge) ![Dependabot](https://img.shields.io/badge/dependabot-025E8C?style=for-the-badge&logo=dependabot&logoColor=white) [![Known Vulnerabilities](https://snyk.io/test/github/hmdnprks/web-pokemon-evolution/badge.svg)](https://snyk.io/test/github/hmdnprks/web-pokemon-evolution)

## SonarQube Cloud Metrics

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=hmdnprks_web-pokemon-evolution)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=hmdnprks_web-pokemon-evolution)](https://sonarcloud.io/summary/new_code?id=hmdnprks_web-pokemon-evolution)

The following badges represent the project's SonarQube Cloud metrics:

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=hmdnprks_web-pokemon-evolution) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=hmdnprks_web-pokemon-evolution) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=hmdnprks_web-pokemon-evolution)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=bugs)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=code_smells)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=ncloc)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=sqale_index)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=hmdnprks_web-pokemon-evolution&metric=coverage)](https://sonarcloud.io/dashboard?id=hmdnprks_web-pokemon-evolution)

# Project Setup Guide

This guide will help you set up the project, run the application, and execute tests.

## Prerequisites

- Node.js and npm installed on your machine.
- Minimum Node.js version: v18.17.0

## Setup

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the project dependencies by running `npm install`.

## Running the Application

To run the application, use the following command:

```sh
npm run dev
```

The application will start and by default can be accessed at http://localhost:3000.

## Building the Application

To build the application for production, use the following command:

```sh
npm run build
```

This will create a .next directory with the built application.

## Running Tests

This project uses Jest for unit testing. To run the tests, use the following command:

```sh
npm run test
```

## Linting and Formatting

This project uses ESLint and Prettier for linting and formatting. To run the linter, use the following command:

```sh
npm run lint
```

To run the linter and automatically fix any issues, use the following command:

```sh
npm run lint:fix
```

## Commit Hooks

This project uses Husky to prevent bad `git commit`, `git push`, and more. Git messages are linted using commitlint. To commit your changes, use the following command:

```sh
npm run commit
```

## Live Demo

A live demo of the application can be found at https://pokemon.hamdan.id/.
