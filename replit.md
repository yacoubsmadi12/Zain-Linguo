# Zain Linguo - Corporate Language Learning Platform

## Overview

Zain Linguo is a modern corporate language learning platform designed to empower teams with enhanced English communication skills. The application features AI-powered content generation using Google's Gemini API, interactive quizzes, progress tracking, and a clean, responsive interface. Built with a full-stack TypeScript architecture, it provides a comprehensive language learning experience with department-specific learning paths, team progress tracking, and gamification elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query for server state and local storage for user progress
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Light/dark mode toggle with persistent storage

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with JSON responses
- **Storage Strategy**: Dual implementation (in-memory for development, PostgreSQL for production)

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Local Storage**: Browser storage for user progress, streaks, and preferences
- **Session Management**: Express sessions with PostgreSQL session store

### Authentication and Authorization
- **Current State**: No authentication implemented (public access)
- **Session Handling**: Basic session middleware configured but not actively used
- **Future Ready**: Architecture supports easy integration of user authentication

### Content Generation System
- **AI Provider**: Google Gemini AI for word generation
- **Deterministic Logic**: Date-based seed ensures consistent daily words
- **Content Structure**: Comprehensive word data including phonetics, definitions, examples, and quiz questions
- **Multilingual Support**: English-Arabic translation pairs for examples

### Application Features
- **Department-specific Learning Paths**: Customized content for different corporate departments
- **Team Progress Tracking**: Monitor collective learning progress across departments
- **Interactive Quizzes**: Multiple-choice questions with immediate feedback
- **AI-powered Daily Vocabulary**: Automated generation and caching of relevant business vocabulary
- **Progress Analytics**: Streak counting, achievement badges, and performance metrics
- **Learning Archive**: Historical content lookup with search capabilities

### Performance Optimizations
- **Query Caching**: Infinite stale time for static content
- **Code Splitting**: Component-based lazy loading
- **Asset Optimization**: Vite's built-in bundling and minification
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Monetization Integration
- **AdSense Ready**: Placeholder ad slots in header, sidebar, and content areas
- **Revenue Strategy**: Display advertising with strategic ad placement
- **User Experience**: Non-intrusive ad integration maintaining clean design

## External Dependencies

### Core Services
- **Google Gemini AI**: Content generation API for daily words and quiz questions
- **Neon Database**: Serverless PostgreSQL hosting for production data
- **Replit Platform**: Development environment with integrated hosting

### UI and Styling
- **Shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

### Utility Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for type safety
- **Date-fns**: Date manipulation utilities
- **Wouter**: Lightweight routing solution
- **Class Variance Authority**: Component variant management