# Learning Hub

A browser-based Learner Support Portal designed to provide learners and assessors with a central platform for managing learning tasks, support bookings, progress, learning resources, and coding practice.

---

## README.md Flow Structure

1. Project Description and Purpose
2. Client Objectives
3. User Roles
4. Core Features
5. Team Members and Roles
6. Technologies Used
7. Project Structure
8. Firebase Data Structure
9. Features Completed
10. GitHub Collaboration Workflow
11. Branching Strategy
12. Contribution Instructions
13. Testing and Debugging
14. Security and Data Protection

---

# Project Description and Purpose

Learning Hub is a browser-based Learner Support Portal developed to provide learners and assessors with a single platform for managing learning tasks, support bookings, progress, learning resources, and coding practice.

Learners may currently manage their goals, tasks, support bookings, and learning progress across separate documents and messages. This can make it difficult for learners to manage their work and for assessors to identify outstanding tasks, learners who require support, and overall learner progress.

The purpose of Learning Hub is to provide a centralised platform where users can manage their learning activities in one place.

The application uses JavaScript for application logic and Firebase for authentication and data storage.

---

# Client Objectives

The client requires Learning Hub to provide a centralised platform that supports both learners and assessors.

The main objectives are to:

- Provide a single and clear interface for managing learning tasks and support requests.
- Allow users to register, sign in, sign out, and access their own information.
- Allow learners to create, read, update, complete, and delete tasks.
- Allow learners to book support sessions.
- Store, retrieve, update, and delete application data using Firebase.
- Calculate and display meaningful learner progress.
- Provide access to learning resources.
- Include an interactive coding mini-game that reinforces programming concepts.
- Allow assessors to view relevant learner support information.
- Allow developers to collaborate using Git and GitHub.
- Use controlled version history and collaborative development practices.

---

# User Roles

Learning Hub has two main user roles.

## Learner

Learners can:

- Register for an account.
- Sign in and sign out securely.
- Manage their own learning tasks.
- Create new tasks.
- View existing tasks.
- Update task information.
- Mark tasks as completed.
- Delete tasks.
- Book support sessions.
- View support booking statuses.
- View their calculated learning progress.
- Access learning resources.
- Play the coding mini-game.
- View and print a progress summary.

## Assessor / Administrator

Assessors or administrators can:

- View submitted support bookings.
- View relevant learner activity.
- Identify learners who require support.
- Monitor learner progress where included in the project scope.
- Update support booking statuses where this functionality is included in the approved project scope.

---

# Core Features

## Authentication

The application includes:

- User registration.
- User sign-in.
- User sign-out.
- Authenticated user state.
- Firebase Authentication.
- User-specific access to application data.

## Dashboard

The dashboard provides an overview of learner activity, including:

- Total number of tasks.
- Completed tasks.
- Outstanding tasks.
- Progress percentage.
- Relevant learner activity.

## Task Manager

The task manager provides CRUD functionality:

- **Create** new learning tasks.
- **Read** existing tasks.
- **Update** task information.
- **Delete** tasks.

Tasks may include:

- Title.
- Category.
- Due date.
- Priority.
- Completion status.
- Creation date.
- User ID.

## Support Bookings

Learners can submit support-session requests containing:

- Support topic.
- Preferred date.
- Additional notes.
- Booking status.

The booking form includes input validation and provides feedback after submission.

## Search, Filter and Sort

The application allows users to:

- Search tasks.
- Filter tasks.
- Sort tasks.
- View tasks by category.
- View tasks by completion status.

## User Preferences

The application may use cookies for non-sensitive preferences such as:

- Theme preference.
- Display mode.
- Last selected filter.

> Passwords and sensitive information must never be stored in cookies.

## Progress Summary

The application calculates learner progress from stored task information.

Users can:

- View progress calculations.
- View learning summaries.
- Print their progress summary.

## Coding Mini-Game

The application includes a short interactive mini-game that reinforces basic programming concepts.

Game results may include:

- User ID.
- Score.
- Duration.
- Completion date.

---

# Team Members and Roles

| Team Member | Role | Responsibilities |
|---|---|---|
| Sindile | Developer | Front-end development, application development, testing, documentation and GitHub collaboration |
| Add team member name | Developer | Add the team member's responsibilities here |

> **Note:** Replace the placeholder information with the correct details for your actual project team.

## Collaboration Roles

During collaborative development, team members may work in the following roles:

### Driver

The driver is responsible for:

- Writing and implementing code.
- Making changes to the project.
- Following the agreed requirements.

### Navigator

The navigator is responsible for:

- Reviewing the code.
- Checking project requirements.
- Identifying possible problems.
- Suggesting improvements.
- Assisting with testing.

Team members can exchange roles during development to ensure equal participation.

---

# Technologies Used

| Area | Technology |
|---|---|
| Structure | HTML  |
| Styling | CSS  |
| Application Logic | JavaScript |
| Database | Firebase Realtime Database |
| Authentication | Firebase Authentication |
| REST Communication | Firebase Realtime Database REST API |
| IDE | Visual Studio Code |
| Version Control | Git |
| Remote Repository | GitHub |
| Continuous Integration | GitHub Actions |
| Testing | Browser Developer Tools and manual testing |

---

# Project Structure

learning-hub/
- index.html
- dashboard.html
- tasks.html
- bookings.html
- resources.html
- game.html
- progress.html

css/
- index.css
- dashboard.css
- tasks.css
- bookings.css
- resources.css
- game.css
- progress.css
js/
- firebase-config.js
- auth.js
- tasks.js
- bookings.js
- dashboard.js
- progress.js
- game.js

assets/
images/
audio/

tests/

.github/
workflows/
README.md

# Firebase CRUD Operations

The application demonstrates CRUD operations using Firebase Realtime Database.

The operations include:

GET — Retrieve data.
POST — Create new records.
PUT — Replace existing records.
PATCH — Update selected fields.
DELETE — Remove records.

All protected data must only be accessed by authorised users.

# GitHub Collaboration Workflow

Git and GitHub are used to manage version control and support team collaboration.

The general workflow is:

Pull the latest changes from the repository.
Create or switch to the appropriate branch.
Create a feature branch for new functionality.
Develop the feature.
Test the changes.
Add and commit the changes.
Push the branch to GitHub.
Create a Pull Request.
Review the changes.
Merge approved changes.

# Branching Strategy

The project uses a branch-based workflow.

## Main Branch

The main branch contains stable and approved versions of the project.

Unfinished work should not be developed directly on the main branch.

## Development Branch

The dev branch can be used to combine and test completed features before they are merged into the main branch.

## Feature Branches

This are the feature Branches
- sindile
- rixongile
- zekhethelo

# Contribution Instructions

When contributing to Learning Hub:

1. Pull the latest changes from the repository.
2. Create a new feature branch.
3. Make the required changes.
4. Test your work.
5. Review your changes before committing.
6. Use a clear and meaningful commit message.
7. Push your branch to GitHub.
8. Create a Pull Request.
9. Allow the changes to be reviewed.
10. Merge approved changes into the appropriate branch

# Testing and Debugging

Testing is performed throughout the development process.

## Testing Methods

The project uses:

Browser Developer Tools.
Console logging.
Trace tables.
Manual test cases.
Firebase testing.
Authentication testing.
CRUD operation testing.

## Features to Test

Important functionality includes:

User registration.
User sign-in.
User sign-out.
Task creation.
Task editing.
Task completion.
Task deletion.
Support booking.
Progress calculations.
Search functionality.
Filter functionality.
Sort functionality.
Firebase CRUD operations.
Mini-game functionality.
Printing the progress summary.
Authentication and security rules.

# Security and Data Protection

Security is an important part of Learning Hub.

## The system should:

- Use Firebase Authentication to manage user passwords.
- Never store passwords in Firebase application data.
- Never store passwords in cookies.
- Never hard-code passwords or private credentials in the source code.
- Never commit service-account files or secrets to GitHub.
- Validate user input before storing information.
- Restrict users to data appropriate to their authenticated identity.
- Prevent unrestricted public access to the database.
- Use Firebase Realtime Database security rules.

# Skills Demonstrated

This project demonstrates practical skills in:

HTML.
CSS.
JavaScript.
DOM manipulation.
Events and user interaction.
Arrays and higher-order functions.
CRUD operations.
Firebase integration.
REST API communication.
Authentication.
Data validation.
Client-side calculations.
Git and GitHub collaboration.
Testing and debugging.
JavaScript frameworks or libraries.

# License

This project was developed for educational purposes.

Authors

Sindile Sekgobela, Rixongile Maluleke, and ze'Khethelo Dlamini

Learning Hub Development Team