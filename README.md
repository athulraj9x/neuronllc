# User Management System

A modern React-based user management application built with TypeScript, featuring role-based access control, reusable component packages, and a clean architecture. This project demonstrates best practices for building scalable React applications with proper testing, linting, and build tooling.

## Project Architecture

This project follows a monorepo structure with the following components:

-  **Main Application**: A React SPA with authentication and user management features
-  **User List Package**: A reusable component for displaying and managing user lists
-  **User Profile Form Package**: A dynamic form component for user profile management
-  **Shared Types**: Common TypeScript interfaces and types used across packages

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

-  **Node.js** (version 18 or higher)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone "https://github.com/Athulraj10/Neoron-user-management-system"
   cd nueronllc
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install package dependencies**

   ```bash
   # Install user-list package dependencies
   cd packages/user-list
   npm install
   cd ../..

   # Install user-profile-form package dependencies
   cd packages/user-profile-form
   npm install
   cd ../..
   ```

4. **Build the packages**

   ```bash
   # Build user-list package
   cd packages/user-list
   npm run build
   cd ../..

   # Build user-profile-form package
   cd packages/user-profile-form
   npm run build
   cd ../..
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or the next available port).

## Available Scripts

### Root Level Scripts

| Script                  | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Starts the development server with hot reload |
| `npm run build`         | Builds the application for production         |
| `npm run lint`          | Runs ESLint to check code quality             |
| `npm run test`          | Runs all tests once                           |
| `npm run test:watch`    | Runs tests in watch mode                      |
| `npm run test:coverage` | Runs tests with coverage report               |

### Package Scripts

Each package has its own build and test scripts:

**User List Package:**

```bash
cd packages/user-list
npm run build   
npm run test    
npm run test:watch 
```

**User Profile Form Package:**

```bash
cd packages/user-profile-form
npm run build   
npm run test    
npm run test:watch 
```

## Project Structure

```
nueronllc/
├── src/                          # Main application source code
│   ├── components/               # Reusable UI components
│   │   ├── Navigation.tsx       # Main navigation component
│   │   └── ProtectedRoute.tsx   # Route protection component
│   ├── context/                  # React context providers
│   │   ├── AuthContext.tsx      # Authentication state management
│   │   └── UserContext.tsx      # User data management
│   ├── pages/                    # Application pages
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Login.tsx            # Login page
│   │   ├── Users.tsx            # User management page
│   │   ├── CreateUser.tsx       # User creation form
│   │   ├── MyProfile.tsx        # User profile page
│   │   └── Forbidden.tsx        # Access denied page
│   └── types/                    # TypeScript type definitions
├── packages/                      # Reusable component packages
│   ├── user-list/               # User list component package
│   │   ├── src/
│   │   │   ├── UserList.tsx     # Main component
│   │   │   ├── types.ts         # Package-specific types
│   │   │   └── permissions.ts   # Permission utilities
│   │   └── dist/                # Built package files
│   └── user-profile-form/       # User profile form package
│       ├── src/
│       │   ├── UserProfileForm.tsx # Main component
│       │   └── types.ts         # Package-specific types
│       └── dist/                # Built package files
├── public/                       # Static assets
├── dist/                         # Production build output
└── configuration files           # Various config files
```

## Technology Stack

### Core Technologies

-  **React 19** - Modern React with latest features
-  **TypeScript 5.9** - Type-safe JavaScript development
-  **Vite 7.1** - Fast build tool and dev server
-  **React Router 7.8** - Client-side routing

### Development Tools

-  **ESLint 9.33** - Code linting and quality enforcement
-  **Jest 29.7** - Testing framework
-  **Testing Library** - React component testing utilities
-  **TS-Jest** - TypeScript support for Jest

### Package Management

-  **npm** - Package manager
-  **Monorepo structure** - Organized package management

## Testing

The project includes comprehensive testing setup:

### Running Tests

```bash
npm run test

npm run test:watch

npm run test:coverage
```

### Test Structure

-  **Component Tests**: Each component has corresponding test files
-  **Context Tests**: Authentication and user context testing
-  **Package Tests**: Individual package testing
-  **Integration Tests**: Full application flow testing

## Development Workflow

### 1. Setting Up Development Environment

```bash
npm install

cd packages/user-list && npm run build && cd ../..
cd packages/user-profile-form && npm run build && cd ../..

npm run dev
```

### 2. Making Changes

-  Edit source files in `src/` directory
-  Modify packages in `packages/` directory
-  Rebuild packages after changes: `npm run build` in package directory

### 3. Testing Changes

```bash
npm run test

npm run lint
```

### 4. Building for Production

```bash
npm run build

cd packages/user-list && npm run build && cd ../..
cd packages/user-profile-form && npm run build && cd ../..
```

## Features

### Authentication & Authorization

-  **Login System**: Secure user authentication
-  **Role-Based Access Control**: Permission-based route protection
-  **Protected Routes**: Automatic redirection for unauthorized access

### User Management

-  **User Dashboard**: Overview of user information
-  **User List**: Paginated user display with search and filtering
-  **User Creation**: Dynamic form for adding new users
-  **Profile Management**: User profile editing and management

### Component Packages

-  **User List Package**: Reusable component with pagination, search, and role-based features
-  **User Profile Form Package**: Dynamic form component with address management

# neuronllc
