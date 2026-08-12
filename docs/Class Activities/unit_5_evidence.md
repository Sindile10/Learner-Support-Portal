# Part 1 - Architecture Investigation

## 1. what is client-side development, and where does client-side code execute?
- client-side development is the part of web development that focuses on what the user sees and interacts with
- Client -side code is mainly executed on the user's device inside the web beowser.

## 2. What is server-side development, and how is it different from code executing in the browser?
- Server-side development involves code and services that operate on a server rather than directly in the user's browser.
- Server-side code Runs on a remote server and It handles tasks such as storing and retrieving data, authentication, authorisation, and processing requests.

## 3. Within SkillsTrack, explain the role of HTML, CSS, JavaScript, Firebase Authentication, Firebase realtime Database and the Firebase REST API.
 ## Role of HTML
 - create the structure and content of a web page.
 - It tells the browser what elements should appear on the page, such as headings, paragraphs, buttons, forms, images, links, tables, and navigation menus.
 ## Role of CSS
 - used to control the appearance, layout, and design of a website.
 - Choose colours for the website
 ## Role of JavaScript
 - programming language used to make a website interactive and functional.
 - Validate login and registration forms
 ## Role of Firebase Authentication
 - Is used to manage users' identities and control access to the SkillsTrack application.
 - Allow learners to register an account.
 - Allow registered learners to log in.
 ## Role of Firebase realtime database
 - Used to store and manage the application's data online
 - Learning tasks — task names, descriptions, dates and statuses
 -Learner information
 ## Role of Firebase REST API
 - Allows the SkillsTrack application to communicate with the Firebase Realtime Database using HTTP requests.
 - Create new learning tasks.
 - Update existing tasks.

## 4. Is Firebase the same thing as server-side JavaScript? Explain your answer
- NO, Firebase is a cloud-based backend platform that provides services such as authentication, databases and security rules, It allows developers to use backend services without having to build and manage their own server.

## 5. When a learner creates a learning task, which operations happen on the client side and which involve  remote/server-side service?
- When a learner creates a task in SkillsTrack, both the browser and the remote Firebase service are involved. Client -side can display the task form and Remote/server check the user's authentication information.

## 6. Why should authentication, database access and security not be treated as purely client-side concerns?
- Client-side JavaScript can improve the user experience, but the backend must enforce important security rules because the browser cannot be fully trusted.

## 7. Research at least two alternative technologies that could provide backend/server-side functionality instead of Firebase. Explain how the architecture would change.


## 8. Identify at least three security risks that could occur if sensitive information or security responsibilities are incorrectly placed in client-side JavaScript.
-Risk 1: Exposing passwords or secret keys
- If passwords, private API keys, database passwords or other sensitive credentials are placed directly in client-side JavaScript, users may be able to inspect the code and obtain them.
-Risk 2: Bypassing client-side validation
-Client-side validation is useful, but it should not be the only validation.
-Risk 3: Unauthorised access to another learner's information
-If SkillsTrack relies only on JavaScript to decide which learner's data can be accessed, a user could potentially modify the client-side code



## PART 2 MAP YOUR ACTUAL APPLICATION

# Part 2 – Map Your Actual Application

| Feature | Classification | Justification |
|---|---|---|
| Registration | Both | JavaScript collects details; Firebase creates the account. |
| Login | Both | JavaScript sends details; Firebase verifies the user. |
| Form validation | Client Side | JavaScript checks the entered information. |
| Displaying the dashboard | Client Side | JavaScript displays information in the browser. |
| Creating a learning task | Both | JavaScript sends the task; Firebase stores it. |
| Retrieving tasks | Both | JavaScript requests tasks; Firebase provides them. |
| Updating a task | Both | JavaScript sends changes; Firebase updates the data. |
| Deleting a task | Both | JavaScript sends the request; Firebase deletes the data. |
| Calculating learner progress | Client Side | JavaScript calculates progress from task data. |
| Filtering/searching tasks | Client Side | JavaScript searches and filters tasks. |
| Storing learner data | Server/Cloud Service | Firebase stores the data remotely. |
| Authentication | Server/Cloud Service | Firebase verifies and manages user identities. |
| Database security/access rules | Server/Cloud Service | Firebase controls access to the database. |
| Updating the DOM | Client Side | JavaScript changes webpage content. |
| Displaying success/error messages | Client Side | JavaScript displays feedback to the learner. |



# PART 4
# Selected Feature : Task Management

## 9. 1. What action does the user perform?
- The learner enters a task and clicks “Add Task.”

## 10. 2. What does JavaScript do in the browser?
- JavaScript collects the task details, validates them and prepares the data to be sent.

## 11. 3. What validation occurs?
 - JavaScript checks that required fields are completed and that the task information is valid.

## 12. 4. What information leaves the browser?
-  The task details, such as task name, description, due date, status and user ID, are sent to Firebase.

## 13. 5. Which Firebase service receives the request?
- The Firebase Realtime Database receives the task data. Firebase Authentication also identifies the logged-in learner.

## 14. 6. What does Firebase do with it?
- Firebase checks the user's access permissions and stores the task in the Realtime Database.

## 15. 7. What response/data is returned?
- Firebase returns a response showing whether the request was successful or failed, and the stored task data can be retrieved.

## 16. 8.  How does JavaScript process the result?
- JavaScript checks the response and decides whether to show the task or display an error message.

## 17. 9.  How is the interface updated?
- JavaScript updates the DOM to display the new task on the learner's dashboard.

## 18. 10. What should happen if the request fails?
- JavaScript should display a clear error message, keep the existing data safe and allow the learner to try again.


















 

