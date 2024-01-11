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

## Running Cypress Tests

This project uses Cypress for end-to-end testing. To run the Cypress tests, use the following command:

```sh

npm run cypress:open
```

This will open the Cypress Test Runner. You can then select the test files you want to run.

Please note that the application must be running locally for the Cypress tests to work.
