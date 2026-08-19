# SkillsTrack Learner Support Portal

A browser-based Learner Support Portal developed for **SkillsTrack Training Centre** to provide learners and assessors with a single platform for managing learning tasks, support bookings, progress, learning resources, and coding practice.

## 1. Project Overview

SkillsTrack Training Centre currently manages learner goals, tasks, support bookings, and progress using separate documents and messages. This makes it difficult for assessors to identify outstanding work, determine which learners require support, and monitor learner progress.

The Learner Support Portal addresses this problem by providing a centralised web application where authenticated learners can manage their learning activities and access support services.

The application uses **JavaScript** for its application logic and **Firebase** for authentication and data storage.

## 2. Client Objectives

The portal aims to:

* Provide a single, clear interface for managing learning tasks and support requests.
* Allow users to register, sign in, sign out, and view their own information.
* Store, retrieve, update, and delete application data using Firebase.
* Calculate and display meaningful progress summaries.
* Provide an interactive mini-game that reinforces basic programming concepts.
* Allow developers to collaborate using GitHub and controlled version history.

## 3. User Roles

### Learner

Learners can:

* Register and sign in.
* Sign out securely.
* Manage their own learning tasks.
* Create, update, complete, and delete tasks.
* Book support sessions.
* View support-booking status.
* View calculated learning progress.
* Access learning resources.
* Play the coding mini-game.
* View and print a progress summary.

### Assessor / Administrator

Assessors or administrators can:

* View submitted support bookings.
* View relevant learner activity.
* Update booking status where included in the approved project scope.

## 4. Core Features

### Authentication

* User registration.
* User sign-in.
* User sign-out.
* Authenticated user state.
* Firebase Authentication.
* User-specific access to application data.

### Dashboard

The dashboard displays:

* Total number of tasks.
* Completed tasks.
* Outstanding tasks.
* Calculated progress percentage.
* Relevant learner activity.

### Task Manager

The task manager provides full CRUD functionality:

* **Create** new learning tasks.
* **Read** existing tasks.
* **Update** task information.
* **Delete** tasks.

Tasks may include:

* Title.
* Category.
* Due date.
* Priority.
* Completion status.
* Creation date.
* User ID.

### Support Booking

Learners can submit support-session requests containing:

* Support topic.
* Preferred date.
* Additional notes.
* Booking status.

The form includes input validation and provides feedback after submission.

### Search, Filter and Sort

The application uses JavaScript arrays and higher-order functions to allow users to:

* Search tasks.
* Filter tasks.
* Sort tasks.
* View specific task categories or statuses.

### Preferences

The application uses cookies for non-sensitive preferences such as:

* Theme preference.
* Display mode.
* Last selected filter.

**Passwords and sensitive information are never stored in cookies.**

### Progress Summary

The portal calculates learner progress from stored task information and provides a printable progress summary.

The application also includes:

* Confirmation dialogs before destructive actions.
* Appropriate redirects after selected actions.
* Progress calculations and summaries.

### Animation and Multimedia

The application includes:

* At least one JavaScript timer-driven animation.
* One controlled multimedia element.

### Coding Mini-Game

A short interactive coding game reinforces basic programming concepts.

The game is developed using an assessor-approved JavaScript framework or library such as **Phaser.js**, **Kaboom.js**, or another approved option.

Game results can be stored in Firebase, including:

* User ID.
* Score.
* Duration.
* Completion date.

## 5. Technologies Used

| Area                   | Technology                                     |
| ---------------------- | ---------------------------------------------- |
| Structure              | HTML5                                          |
| Styling                | CSS3                                           |
| Application Logic      | JavaScript ES6+                                |
| Database               | Firebase Realtime Database                     |
| Authentication         | Firebase Authentication                        |
| REST Communication     | Firebase Realtime Database REST API            |
| Framework / Library    | Assessor-approved JavaScript framework/library |
| IDE                    | Visual Studio Code                             |
| Version Control        | Git and GitHub                                 |
| Continuous Integration | GitHub Actions                                 |
| Testing                | Browser Developer Tools and manual test cases  |

## 6. Firebase Data Structure

The application uses Firebase Realtime Database.

A planned database structure is:

```text
users/
  {uid}/
    displayName
    email
    role
    createdAt

tasks/
  {taskId}/
    userId
    title
    category
    dueDate
    priority
    completed
    createdAt

bookings/
  {bookingId}/
    userId
    topic
    preferredDate
    notes
    status

scores/
  {scoreId}/
    userId
    score
    duration
    completedAt

resources/
  {resourceId}/
    title
    type
    url
    description
```

The structure may be adapted with assessor approval where necessary.

## 7. Firebase CRUD Operations

The application documents and demonstrates REST API communication with Firebase Realtime Database.

The required operations include:

* `GET` — retrieve data.
* `POST` — create new records.
* `PUT` — replace existing records.
* `PATCH` — update selected fields.
* `DELETE` — remove records.

All requests that access protected data must be appropriately authenticated or performed within an assessor-controlled test environment.

## 8. Security and Data Protection

Security is an important part of the application.

The system will:

* Prevent unrestricted public write access to the database.
* Restrict users to data appropriate to their authenticated identity and role.
* Use Firebase Authentication to handle passwords.
* Never store passwords in Firebase application data.
* Never store passwords in cookies.
* Never hard-code passwords or private credentials in source code.
* Never commit service-account files or other secrets to GitHub.
* Validate user input before writing information to Firebase.

Firebase Realtime Database security rules will be configured to support these requirements.

## 9. Git and GitHub Workflow

The project uses Git and GitHub for version control and collaboration.

The development process includes:

* Git repository management.
* Feature branches.
* Meaningful commits.
* Pull requests.
* Code reviews.
* Merging approved changes.
* Contribution history.

Developers work collaboratively while maintaining controlled version history.

## 10. Continuous Integration

The project includes a basic GitHub Actions workflow.

Automated checks may include:

* JavaScript linting.
* Formatting checks.
* Basic automated tests.
* Project validation.

The purpose of continuous integration is to identify problems before changes are merged into the main project.

## 11. Testing and Debugging

Testing is performed using:

* Browser Developer Tools.
* Console logging.
* Breakpoints.
* Stack traces.
* Manual test cases.
* Firebase testing.
* Authentication testing.
* CRUD operation testing.

Errors identified during development are documented and corrected.

Testing covers important functionality including:

* Registration and sign-in.
* Sign-out.
* Task creation.
* Task editing.
* Task completion.
* Task deletion.
* Support booking.
* Progress calculations.
* Search/filter/sort functionality.
* Firebase CRUD operations.
* Mini-game functionality.
* Printing the progress summary.
* Authentication and security rules.

## 12. Project Goals

The completed portal should provide learners with an easy-to-use central location for managing their learning activities while giving assessors improved visibility of learner support requirements and progress.

The project demonstrates practical application of:

* JavaScript programming.
* DOM manipulation.
* Events and user interaction.
* Arrays and higher-order functions.
* CRUD operations.
* Firebase integration.
* REST API communication.
* Authentication.
* Data validation.
* Client-side calculations.
* Git and GitHub collaboration.
* Testing and debugging.
* JavaScript frameworks/libraries.

## 13. Project Status

**Development status:** In progress

The project will be developed incrementally, with features tested and committed through Git throughout the development process.

## 14. Repository Structure

A possible project structure is:

```text
skills-track-portal/
│
├── index.html
├── dashboard.html
├── tasks.html
├── bookings.html
├── resources.html
├── game.html
├── progress.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── firebase-config.js
│   ├── auth.js
│   ├── tasks.js
│   ├── bookings.js
│   ├── dashboard.js
│   ├── progress.js
│   └── game.js
│
├── assets/
│   ├── images/
│   └── audio/
│
├── tests/
│
├── .github/
│   └── workflows/
│
└── README.md
```

## 15. Security Notice

Firebase configuration and client-side configuration values must be handled appropriately. Private credentials, service-account keys, passwords, API secrets, and other sensitive information must **not** be committed to the repository.

Database security rules must be configured before the application is deployed for real users.

## 16. Expected Outcome

The final SkillsTrack Learner Support Portal will provide a functional, responsive, and user-friendly web application that brings learner task management, support bookings, progress tracking, learning resources, and programming practice into one system.

The project will demonstrate the practical use of **HTML5, CSS3, JavaScript, Firebase, REST APIs, authentication, Git, GitHub, automated checks, and software testing** to solve a realistic learner-support problem.
