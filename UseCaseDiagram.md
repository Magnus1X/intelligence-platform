# Use Case Diagram Documentation

![Use Case Diagram](./images/useCase%20Diagram.png)

This document describes the functionalities and interactions available to users and administrators as shown in `useCase Diagram.png`.

## User Actions

These use cases represent the primary journey of a student on the platform.

### 1. Onboarding and Authentication
- **Register Account**: Allows new users to create an account.
- **Login**: Secure access to the platform for registered users.
- **Logout**: Safely end the current user session.

### 2. Interview Process
- **Select Interview Role**: Users choose the specific job role they want to practice for.
- **Start Interview Session**: Initiates the AI-driven interview experience.
- **Answer Questions**: The main interaction where users provide responses. This includes a feedback loop for each question.

### 3. Post-Interview & Progress
- **View AI Feedback**: Users can review detailed feedback and scores for their individual answers.
- **View Interview History**: Access to a log of all previously completed sessions.
- **View Performance Analytics**: Higher-level insights into the user's progress and skill trends over time.

## Admin Actions

These use cases represent the administrative and management functions.

### 1. Management
- **Admin Login**: Separate secure entry for administrators.
- **Manage Users**: Capability to view, edit, or delete user accounts.
- **Manage Interview Configurations**: Adjusting the settings, roles, or question parameters for the system.

### 2. Monitoring
- **Monitor System Logs**: Tracking system health, errors, and activity for maintenance.
- **Admin Logout**: Securely terminating the admin session.

## AI Evaluation Service (Backend Systems)

These represent the automated processes triggered by user actions.

- **Generate Interview Questions**: Triggered when a user starts a session; provides role-specific content.
- **Evaluate User Answers**: Prompted when a user submits a response; performs AI-based analysis.
- **Generate Feedback Report**: Compiles evaluation results into a structured format for the user.

## System Workflow Summary

The user starts by logging in and selecting a role. The system (AI Service) generates questions. The user answers them in a loop, receiving real-time evaluation and feedback. Admin users oversee the platform's health and user management through a separate set of tools.
