## USER REGISTRATION
```
WHEN registration form is submitted

```
PREVENT default form submission

// GET VALUES FROM DOM
displayName = GET value FROM displayName input
email = GET value FROM email input
password = GET value FROM password input
role = GET value FROM role dropdown

// VARIABLES AND DATA TYPES
// displayName, email, password, role = String
// passwordValid, emailValid, registered = Boolean
// allowedRoles = Array of Strings
// userObject = Object
// createdAt = Date/Time

allowedRoles = ["learner", "admin"]

// VALIDATE INPUT
emailValid = VALIDATE email
passwordValid = LENGTH OF password >= 8

IF displayName IS EMPTY THEN
    DISPLAY "Display name is required" IN displayNameError
    RETURN false
END IF

IF emailValid == false THEN
    DISPLAY "Invalid email address" IN emailError
    RETURN false
END IF

IF passwordValid == false THEN
    DISPLAY "Password must contain at least 8 characters" IN passwordError
    RETURN false
END IF

IF role IS NOT IN allowedRoles THEN
    DISPLAY "Please select a valid role" IN roleError
    RETURN false
END IF

// CHECK ROLE USING ARRAY METHOD
validRole = allowedRoles.find(selectedRole => selectedRole == role)

IF validRole DOES NOT EXIST THEN
    DISPLAY "Invalid user role" IN roleError
    RETURN false
END IF

TRY

    // CREATE USER IN FIREBASE
    CREATE user in Firebase Authentication
    USING email AND password

    uid = GET uid from authenticated user

    createdAt = CURRENT timestamp

    // CREATE USER OBJECT
    userObject = {
        uid: uid,
        displayName: displayName,
        email: email,
        role: role,
        createdAt: createdAt
    }

    // SAVE USER
    POST /users/{uid}
    WITH userObject

    // DISPLAY SUCCESS MESSAGE
    DISPLAY "Registration successful!" IN successMessage

    // CLEAR FORM USING DOM
    CLEAR displayName input
    CLEAR email input
    CLEAR password input
    CLEAR role dropdown

    registered = true

    RETURN registered

CATCH error

    DISPLAY "Registration failed: " + error.message IN errorMessage

    registered = false

    RETURN registered

END TRY
```

END EVENT

FUNCTION registerUser(displayName, email, password, role)

```
// PARAMETERS ARE LOCAL TO THIS FUNCTION
// displayName, email, password and role = String

CALL registration process

RETURN registration result

END FUNCTION


## LOGIN / SIGN IN

WHEN login form is submitted

```
PREVENT default form submission

// GET USER INPUT FROM DOM
email = GET value FROM email input
password = GET value FROM password input

// CLEAR PREVIOUS ERROR MESSAGE
CLEAR loginError

CALL loginUser(email, password)
```

END EVENT

FUNCTION loginUser(email, password)

```
// VARIABLES AND DATA TYPES
// email = String
// password = String
// emailValid = Boolean
// passwordValid = Boolean
// currentDate = Date/Time
// theme = String

emailValid = VALIDATE email
passwordValid = LENGTH OF password > 0

// VALIDATE INPUT
IF email IS EMPTY OR password IS EMPTY THEN
    DISPLAY "Please fill in all fields" IN loginError
    RETURN false
END IF

IF emailValid == false THEN
    DISPLAY "Please enter a valid email address" IN loginError
    RETURN false
END IF

IF passwordValid == false THEN
    DISPLAY "Password is required" IN loginError
    RETURN false
END IF

TRY

    // SIGN IN USER
    SIGN IN with Firebase Authentication
    USING email AND password

    currentUser = authenticated user
    uid = currentUser.uid
    currentDate = CURRENT timestamp

    // GET NON-SENSITIVE PREFERENCE
    theme = GET theme FROM localStorage

    STORE currentDate IN lastLogin cookie

    // UPDATE DOM
    DISPLAY "Login successful" IN successMessage

    CALL checkAuthState()

    RETURN true

CATCH error

    // DISPLAY ERROR IN DOM
    DISPLAY "Invalid email or password" IN loginError

    RETURN false

END TRY
```

END FUNCTION

FUNCTION checkAuthState()

```
// LISTEN FOR AUTHENTICATION EVENT
ON authentication state changed

    IF current user EXISTS THEN

        uid = current user.uid

        // GET USER DATA
        userData = GET /users/{uid} FROM Firebase Database

        userRole = userData.role

        // ROLE-BASED REDIRECTION
        IF userRole == "admin" THEN

            DISPLAY "Welcome Admin" IN successMessage
            REDIRECT to admin.html

        ELSE IF userRole == "learner" THEN

            DISPLAY "Welcome Learner" IN successMessage
            REDIRECT to dashboard.html

        ELSE

            DISPLAY "Invalid user role" IN loginError
            REDIRECT to login.html

        END IF

    ELSE

        DISPLAY "Please log in to continue" IN loginError
        REDIRECT to login.html

    END IF
```

END FUNCTION
```
## SIGN OUT
```
FUNCTION signOutUser()

```
// DOM EVENT
WHEN Sign Out button is clicked

    PREVENT default button action

    // VARIABLE AND DATA TYPE
    // confirmation = Boolean value (TRUE or FALSE)
    confirmation = SHOW confirmation dialog
    "Are you sure you want to log out?"

    // ARRAY OF USER OBJECTS
    users = [
        {
            uid: "001",
            displayName: "Sindile",
            email: "sindile@email.com",
            role: "learner",
            loggedIn: true
        },
        {
            uid: "002",
            displayName: "Ronald",
            email: "ronald@email.com",
            role: "admin",
            loggedIn: true
        }
    ]

    // FIND CURRENT USER
    currentUser = users.find(user => user.loggedIn === true)

    // CHECK IF USER IS LOGGED IN
    IF currentUser EXISTS THEN

        // CHECK USER RESPONSE
        IF confirmation === TRUE THEN

            TRY

                // SIGN OUT FROM FIREBASE
                SIGN OUT current user from Firebase Authentication

                // UPDATE USER STATUS
                FOR EACH user IN users DO

                    IF user.uid === currentUser.uid THEN
                        user.loggedIn = false
                    END IF

                END FOR

                // DOM FEEDBACK
                DISPLAY "You have successfully logged out"
                IN logoutMessage

                // CLEAR USER INFORMATION FROM DOM
                CLEAR userDisplayName
                CLEAR userEmail

                // REDIRECT USER
                REDIRECT to login.html

                signOutSuccessful = true
                RETURN signOutSuccessful

            CATCH error

                // DOM ERROR FEEDBACK
                errorMessage = error.message
                DISPLAY "Sign out failed: " + errorMessage
                IN logoutError

                signOutSuccessful = false
                RETURN signOutSuccessful

            END TRY

        ELSE

            // USER CANCELLED SIGN OUT
            DISPLAY "Sign out cancelled"
            IN logoutMessage

            signOutSuccessful = false
            RETURN signOutSuccessful

        END IF

    ELSE

        // NO USER IS LOGGED IN
        DISPLAY "No user is currently logged in"
        IN logoutError

        signOutSuccessful = false
        RETURN signOutSuccessful

    END IF

END EVENT
```

END FUNCTION

```

##TASK CREATION-CREATE
```
WHEN Add Task form is submitted

```
// DOM EVENT
PREVENT default form submission

// GET VALUES FROM DOM
userId = GET value FROM userId input
title = GET value FROM taskTitle input
dueDate = GET value FROM dueDate input
priority = GET value FROM priority dropdown
category = GET value FROM category dropdown

// CLEAR PREVIOUS MESSAGES
CLEAR taskError
CLEAR taskSuccess

CALL createTask(userId, title, dueDate, priority, category)
```

END EVENT

FUNCTION createTask(userId, title, dueDate, priority, category)

```
// VARIABLES AND DATA TYPES
// userId = String
// title = String
// dueDate = Date
// priority = String
// category = String
// completed = Boolean
// createdAt = Date/Time
// taskList = Array of Task Objects

// VALIDATE TASK TITLE
IF title is empty THEN

    DISPLAY "Task title cannot be empty"
    IN taskError

    RETURN false

END IF


// VALIDATE DUE DATE
IF dueDate < today THEN

    DISPLAY "Due date cannot be in the past"
    IN taskError

    RETURN false

END IF


// VALIDATE PRIORITY
IF priority != "low"
   AND priority != "medium"
   AND priority != "high" THEN

    DISPLAY "Please select a valid priority"
    IN taskError

    RETURN false

END IF


// CHECK IF TASK ALREADY EXISTS
existingTask = taskList.find(
    task => task.title === title
)

IF existingTask EXISTS THEN

    DISPLAY "This task already exists"
    IN taskError

    RETURN false

END IF


TRY

    // GET CURRENT USER
    userId = auth.currentUser.uid

    // CREATE TASK OBJECT
    newTask = {
        taskId: autoGeneratedTaskId,
        userId: userId,
        title: title,
        category: category,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdAt: timestamp
    }

    // ADD TASK TO ARRAY
    taskList.push(newTask)


    // LOOP THROUGH TASK ARRAY
    FOR EACH task IN taskList DO

        IF task.completed === true THEN
            task.status = "COMPLETED"

        ELSE IF task.dueDate < today THEN
            task.status = "OVERDUE"

        ELSE
            task.status = "PENDING"

        END IF

    END FOR


    // SAVE TASK USING REST API
    POST /tasks/{autoGeneratedTaskId}
    WITH newTask


    // UPDATE TASK LIST IN DOM
    CLEAR taskContainer

    FOR EACH task IN taskList DO

        CREATE taskElement

        DISPLAY task.title IN taskElement
        DISPLAY task.dueDate IN taskElement
        DISPLAY task.priority IN taskElement
        DISPLAY task.status IN taskElement

        APPEND taskElement TO taskContainer

    END FOR


    // CLEAR FORM AFTER SUCCESS
    CLEAR taskTitle input
    CLEAR dueDate input
    RESET priority dropdown
    RESET category dropdown


    // SUCCESS FEEDBACK IN DOM
    DISPLAY "Task created successfully!"
    IN taskSuccess


    taskCreated = true

    RETURN taskCreated


CATCH error

    // ERROR FEEDBACK IN DOM
    errorMessage = error.message

    DISPLAY "Task could not be created: " + errorMessage
    IN taskError

    taskCreated = false

    RETURN taskCreated

END TRY
```

END FUNCTION
```

## READ + DASHBOARD CALCULATIONS REQUIRED
```
WHEN dashboard page is loaded

```
// DOM EVENT
CALL loadDashboard(currentUser.uid)
```

END EVENT

FUNCTION loadDashboard(userId)

```
// GET DATA
tasks = GET /tasks

// FILTER USER'S TASKS
userTasks = tasks.filter(
    task => task.userId === userId
)

total = userTasks.length

completedList = userTasks.filter(
    task => task.completed === true
)

completed = completedList.length

outstanding = total - completed


// CALCULATE PROGRESS
IF total > 0 THEN
    progress = (completed / total) * 100
ELSE
    progress = 0
END IF


// CREATE SUMMARY OBJECT
taskTotals = {
    total: total,
    completed: completed,
    outstanding: outstanding
}


// ARRAY METHODS
taskTitles = userTasks.map(
    task => task.title
)

highPriority = userTasks.filter(
    task => task.priority === "high"
)


// CLEAR OLD DASHBOARD CONTENT
CLEAR taskContainer


// DISPLAY EACH TASK DYNAMICALLY
FOR EACH task IN userTasks DO

    IF task.completed === true THEN
        status = "Completed"

    ELSE IF task.dueDate < today THEN
        status = "Overdue"

    ELSE
        status = "Outstanding"

    END IF


    // CREATE DOM ELEMENT
    CREATE taskElement

    DISPLAY task.title IN taskElement
    DISPLAY task.dueDate IN taskElement
    DISPLAY task.priority IN taskElement
    DISPLAY status IN taskElement

    APPEND taskElement TO taskContainer

END FOR


// UPDATE DASHBOARD SUMMARY IN DOM
DISPLAY total IN totalTasks
DISPLAY completed IN completedTasks
DISPLAY outstanding IN outstandingTasks
DISPLAY progress + "%" IN progressDisplay


// DISPLAY HIGH PRIORITY TASKS
DISPLAY highPriority IN highPriorityContainer


// DISPLAY FEEDBACK
IF total === 0 THEN

    DISPLAY "You have no tasks yet."
    IN taskContainer

ELSE

    DISPLAY "Dashboard loaded successfully."
    IN dashboardMessage

END IF


RETURN true
```

END FUNCTION

```
## UPDATE TASK
```
WHEN Edit Task button is clicked

```
// DOM EVENT
PREVENT default button action

// GET UPDATED DATA FROM DOM
taskId = GET task ID FROM selected task
title = GET value FROM taskTitle input
dueDate = GET value FROM dueDate input
priority = GET value FROM priority dropdown

newData = {
    title: title,
    dueDate: dueDate,
    priority: priority
}

// CLEAR PREVIOUS FEEDBACK
CLEAR taskError
CLEAR taskSuccess

CALL updateTask(taskId, newData)
```

END EVENT

FUNCTION updateTask(taskId, newData)

```
// VARIABLES AND DATA TYPES
// taskId = String
// newData = Object
// tasks = Array of Task Objects
// updated = Boolean

tasks = GET /tasks

task = tasks.find(
    task => task.taskId === taskId
)

IF task DOES NOT EXIST THEN

    DISPLAY "Task not found"
    IN taskError

    RETURN false

END IF


IF task.userId != currentUser.uid THEN

    DISPLAY "Access denied"
    IN taskError

    RETURN false

END IF


PATCH /tasks/{taskId} WITH newData


// UPDATE DOM
CLEAR taskContainer

FOR EACH task IN tasks DO
    DISPLAY task.title
    DISPLAY task.dueDate
    DISPLAY task.priority
    IN taskContainer
END FOR


// SUCCESS FEEDBACK
DISPLAY "Task updated successfully!"
IN taskSuccess

updated = true

RETURN updated
```

END FUNCTION

WHEN Complete Task button is clicked

```
// DOM EVENT
PREVENT default button action

// GET TASK ID FROM DOM
taskId = GET task ID FROM selected task

// CLEAR PREVIOUS FEEDBACK
CLEAR taskError
CLEAR taskSuccess

CALL toggleComplete(taskId)
```

END EVENT

FUNCTION toggleComplete(taskId)

```
// VARIABLES AND DATA TYPES
// taskId = String
// completed = Boolean
// newValue = Boolean

tasks = GET /tasks

task = tasks.find(
    task => task.taskId === taskId
)


IF task DOES NOT EXIST THEN

    DISPLAY "Task not found"
    IN taskError

    RETURN false

END IF


IF task.userId != currentUser.uid THEN

    DISPLAY "Access denied"
    IN taskError

    RETURN false

END IF


completed = task.completed

newValue = NOT completed

PATCH /tasks/{taskId}
WITH { completed: newValue }


// UPDATE TASK STATUS IN DOM
IF newValue === true THEN

    DISPLAY "Task marked as completed"
    IN taskSuccess

ELSE

    DISPLAY "Task marked as outstanding"
    IN taskSuccess

END IF


// REFRESH TASK DISPLAY
CLEAR taskContainer

FOR EACH task IN tasks DO
    DISPLAY task.title
    DISPLAY task.completed
    IN taskContainer
END FOR


RETURN true
```

END FUNCTION
```

## DELETE = CONFIRMATION DIOLOG - REQUIRED
WHEN Delete Task button is clicked

```
// DOM EVENT
PREVENT default button action

// GET TASK ID FROM DOM
taskId = GET task ID FROM selected task

// CLEAR PREVIOUS FEEDBACK
CLEAR taskError
CLEAR taskSuccess

CALL deleteTask(taskId)
```

END EVENT

FUNCTION deleteTask(taskId)

```
// VARIABLES AND DATA TYPES
// taskId = String
// tasks = Array of Task Objects
// deleted = Boolean
// confirmation = Boolean
// progress = Number

tasks = GET /tasks


// FIND TASK USING ARRAY METHOD AND ARROW FUNCTION
task = tasks.find(
    task => task.taskId === taskId
)


// VALIDATE TASK
IF task DOES NOT EXIST THEN

    DISPLAY "Task not found"
    IN taskError

    RETURN false

END IF


// CHECK TASK BELONGS TO CURRENT USER
IF task.userId != currentUser.uid THEN

    DISPLAY "Access denied"
    IN taskError

    RETURN false

END IF


// DOM CONFIRMATION EVENT
confirmation = SHOW dialog
"Delete this task? This cannot be undone."


IF confirmation === true THEN

    TRY

        // DELETE FROM FIREBASE
        DELETE /tasks/{taskId}
        USING REST DELETE


        // REMOVE TASK FROM ARRAY
        tasks = tasks.filter(
            task => task.taskId !== taskId
        )


        // UPDATE TASK LIST IN DOM
        CLEAR taskContainer

        FOR EACH task IN tasks DO

            CREATE taskElement

            DISPLAY task.title IN taskElement
            DISPLAY task.dueDate IN taskElement
            DISPLAY task.priority IN taskElement

            APPEND taskElement TO taskContainer

        END FOR


        // RECALCULATE DASHBOARD
        total = tasks.length

        completed = tasks.filter(
            task => task.completed === true
        ).length

        outstanding = total - completed


        IF total > 0 THEN
            progress = (completed / total) * 100
        ELSE
            progress = 0
        END IF


        // UPDATE PROGRESS IN DOM
        DISPLAY progress + "%"
        IN progressDisplay


        // SUCCESS FEEDBACK IN DOM
        DISPLAY "Task deleted successfully!"
        IN taskSuccess


        deleted = true

        RETURN deleted


    CATCH error

        // ERROR FEEDBACK IN DOM
        DISPLAY "Task could not be deleted: " + error.message
        IN taskError

        deleted = false

        RETURN deleted

    END TRY


ELSE

    // USER CANCELLED DELETE
    DISPLAY "Delete cancelled"
    IN taskSuccess

    RETURN false

END IF
```

END FUNCTION
```

## SUPPORT BOOKINGS
WHEN Book Support form is submitted

```
// DOM EVENT
PREVENT default form submission

// GET VALUES FROM DOM
topic = GET value FROM topic input
preferredDate = GET value FROM preferredDate input
notes = GET value FROM notes input

// CLEAR PREVIOUS FEEDBACK
CLEAR bookingError
CLEAR bookingSuccess

CALL bookSupport(topic, preferredDate, notes)
```

END EVENT

FUNCTION bookSupport(topic, preferredDate, notes)

```
// VARIABLES AND DATA TYPES
// topic = String
// preferredDate = Date
// notes = String
// bookings = Array of Booking Objects
// booking = Object
// status = String
// booked = Boolean


// VALIDATE TOPIC
IF topic is empty THEN

    DISPLAY "Please select a support topic"
    IN bookingError

    RETURN false

END IF


// VALIDATE DATE
IF preferredDate is empty THEN

    DISPLAY "Please select a preferred date"
    IN bookingError

    RETURN false

END IF


IF preferredDate < today THEN

    DISPLAY "Preferred date cannot be in the past"
    IN bookingError

    RETURN false

END IF


bookings = GET /bookings


// CHECK FOR EXISTING BOOKING
existingBooking = bookings.find(
    booking => booking.userId === currentUser.uid
)


IF existingBooking EXISTS THEN

    DISPLAY "You already have a booking"
    IN bookingError

    RETURN false

END IF


// CREATE BOOKING OBJECT
booking = {
    bookingId: autoGeneratedBookingId,
    userId: currentUser.uid,
    topic: topic,
    preferredDate: preferredDate,
    notes: notes,
    status: "pending"
}


// ADD BOOKING TO ARRAY
bookings.push(booking)


// SAVE BOOKING
POST /bookings/{booking.bookingId}
WITH booking


// UPDATE BOOKINGS IN DOM
CLEAR bookingContainer

FOR EACH booking IN bookings DO

    CREATE bookingElement

    DISPLAY booking.topic IN bookingElement
    DISPLAY booking.preferredDate IN bookingElement
    DISPLAY booking.status IN bookingElement

    APPEND bookingElement TO bookingContainer

END FOR


// CLEAR FORM AFTER SUCCESS
CLEAR topic input
CLEAR preferredDate input
CLEAR notes input


// SUCCESS FEEDBACK IN DOM
DISPLAY "Booking submitted successfully! Pending approval."
IN bookingSuccess


booked = true

RETURN booked
```

END FUNCTION


```
## ADMIN/ASSESSOR VIEW

WHEN Admin Booking page is loaded

```
// DOM EVENT
CALL loadAllBookingsAsAdmin()
```

END EVENT

FUNCTION loadAllBookingsAsAdmin()

```
// VARIABLES AND DATA TYPES
// bookings = Array of Booking Objects
// search = String
// filtered = Array of Booking Objects
// booking = Object
// isAdmin = Boolean

// CHECK ADMIN ACCESS
IF currentUser.role != "admin" THEN

    DISPLAY "Access denied. Admin access required."
    IN bookingError

    RETURN false

END IF


bookings = GET /bookings


// GET SEARCH VALUE FROM DOM
search = GET search input value
search = CONVERT search TO String


// FILTER BOOKINGS
filtered = bookings.filter(
    booking => booking.topic CONTAINS search
    OR booking.userId CONTAINS search
)


// SORT BOOKINGS BY DATE
filtered.sort(
    (a, b) => a.preferredDate - b.preferredDate
)


// CLEAR OLD BOOKINGS FROM DOM
CLEAR bookingContainer


// DISPLAY BOOKINGS DYNAMICALLY
FOR EACH booking IN filtered DO

    CREATE bookingElement

    DISPLAY booking.topic IN bookingElement
    DISPLAY booking.preferredDate IN bookingElement
    DISPLAY booking.userId IN bookingElement
    DISPLAY booking.status IN bookingElement


    IF booking.status == "pending" THEN

        CREATE "Approve" button
        CREATE "Reject" button

        ADD click event TO Approve button
        CALL updateBookingStatus(booking.bookingId, "approved")

        ADD click event TO Reject button
        CALL updateBookingStatus(booking.bookingId, "rejected")

        APPEND Approve button TO bookingElement
        APPEND Reject button TO bookingElement

    END IF


    APPEND bookingElement TO bookingContainer

END FOR


// DISPLAY SEARCH RESULT FEEDBACK
IF filtered.length == 0 THEN

    DISPLAY "No bookings found."
    IN bookingContainer

ELSE

    DISPLAY "Bookings loaded successfully."
    IN bookingSuccess

END IF


isAdmin = true
RETURN isAdmin
```

END FUNCTION

FUNCTION updateBookingStatus(bookingId, newStatus)

```
// bookingId = String
// newStatus = String
// booking = Object
// updated = Boolean


// VALIDATE BOOKING STATUS
IF newStatus != "approved"
   AND newStatus != "rejected" THEN

    DISPLAY "Invalid booking status."
    IN bookingError

    RETURN false

END IF


PATCH /bookings/{bookingId}
WITH { status: newStatus }


// UPDATE DOM FEEDBACK
IF newStatus == "approved" THEN

    DISPLAY "Booking approved successfully!"
    IN bookingSuccess

ELSE

    DISPLAY "Booking rejected successfully!"
    IN bookingSuccess

END IF


// REFRESH BOOKING LIST
CALL loadAllBookingsAsAdmin()


updated = true
RETURN updated
```

END FUNCTION
```
## SEARCH, FILTER, SORT

WHEN Search input, Category dropdown, or Sort dropdown changes

```
// DOM EVENT
GET searchText FROM searchInput
GET categoryFilter FROM categoryDropdown
GET sortBy FROM sortDropdown

// CLEAR PREVIOUS FEEDBACK
CLEAR searchError
CLEAR searchMessage

CALL searchAndFilter(tasks, searchText, categoryFilter, sortBy)
```

END EVENT

FUNCTION searchAndFilter(tasks, searchText, categoryFilter, sortBy)

```
// VARIABLES AND DATA TYPES
// tasks = Array of Task Objects
// searchText = String
// categoryFilter = String
// sortBy = String
// results = Array of Task Objects

// GET AND CONVERT SEARCH VALUE
searchText = CONVERT searchText TO String

// VALIDATE SEARCH INPUT
IF searchText IS EMPTY AND categoryFilter == "all" AND sortBy == "none" THEN

    DISPLAY "Please enter a search term or select a filter."
    IN searchMessage

END IF


// FILTER BY SEARCH TEXT
results = tasks.filter(
    task => task.title CONTAINS searchText
)


// FILTER BY CATEGORY
IF categoryFilter != "all" THEN

    results = results.filter(
        task => task.category == categoryFilter
    )

END IF


// SORT BY DUE DATE
IF sortBy == "dueDate" THEN

    results.sort(
        (a, b) => a.dueDate - b.dueDate
    )


// SORT BY PRIORITY
ELSE IF sortBy == "priority" THEN

    priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    }

    results.sort(
        (a, b) => priorityOrder[a.priority]
                - priorityOrder[b.priority]
    )

END IF


// UPDATE TASK LIST IN DOM
CLEAR taskContainer


// DISPLAY RESULTS DYNAMICALLY
FOR EACH task IN results DO

    CREATE taskElement

    DISPLAY task.title IN taskElement
    DISPLAY task.category IN taskElement
    DISPLAY task.dueDate IN taskElement
    DISPLAY task.priority IN taskElement

    APPEND taskElement TO taskContainer

END FOR


// DISPLAY SEARCH FEEDBACK
IF results.length == 0 THEN

    DISPLAY "No tasks match your search or filters."
    IN searchMessage

ELSE

    DISPLAY results.length + " task(s) found."
    IN searchMessage

END IF


RETURN results
```

END FUNCTION

```
## COOKIE PREFERENCE, REDIRECT, PRINT

WHEN Theme dropdown or theme button is changed

```
// DOM EVENT
theme = GET selected value FROM themeDropdown

// CLEAR PREVIOUS FEEDBACK
CLEAR themeError
CLEAR themeMessage

CALL saveThemePreference(theme)
```

END EVENT

FUNCTION saveThemePreference(theme)

```
// VARIABLES AND DATA TYPES
// theme = String
// themes = Array of Strings
// savedTheme = String
// isValid = Boolean

themes = ["light", "dark"]


// VALIDATE THEME
IF theme IN themes THEN

    SET localStorage theme = theme
    SET cookie theme = theme

    // UPDATE DOM
    APPLY theme TO body class

    savedTheme = theme
    isValid = true

    DISPLAY "Theme changed to " + theme
    IN themeMessage

ELSE

    DISPLAY "Invalid theme. Please select Light or Dark."
    IN themeError

    isValid = false

END IF


RETURN isValid
```

END FUNCTION

WHEN Login button is successfully clicked

```
// DOM EVENT
CLEAR loginError

CALL onLoginSuccess()
```

END EVENT

FUNCTION onLoginSuccess()

```
// dashboard = String

dashboard = "dashboard.html"

// DOM FEEDBACK
DISPLAY "Login successful. Redirecting to your dashboard..."
IN loginMessage

REDIRECT TO dashboard

RETURN true
```

END FUNCTION

WHEN Print Progress button is clicked

```
// DOM EVENT
PREVENT default button action

CLEAR printMessage

CALL printProgressSummary()
```

END EVENT

FUNCTION printProgressSummary()

```
// progressData = Object
// printReady = Boolean

progressData = {
    total: total,
    completed: completed,
    outstanding: outstanding,
    progress: progress
}


// CLEAR OLD SUMMARY FROM DOM
CLEAR progressContainer


// DISPLAY PROGRESS DATA DYNAMICALLY
DISPLAY "Total Tasks: " + progressData.total
IN progressContainer

DISPLAY "Completed: " + progressData.completed
IN progressContainer

DISPLAY "Outstanding: " + progressData.outstanding
IN progressContainer

DISPLAY "Progress: " + progressData.progress + "%"
IN progressContainer


printReady = true


IF printReady == true THEN

    DISPLAY "Progress summary is ready to print."
    IN printMessage

    CALL window.print()

ELSE

    DISPLAY "Unable to prepare progress summary."
    IN printError

END IF


RETURN printReady
```

END FUNCTION

``
## ANIMATION + GAME SCORES

WHEN Dashboard page is loaded

```
// DOM EVENT
CALL startBannerAnimation()
```

END EVENT

FUNCTION startBannerAnimation()

```
// VARIABLES AND DATA TYPES
// position = Number
// banners = Array of Banner Objects
// banner = Object
// animationRunning = Boolean

position = 0

banners = [
    { name: "Welcome Banner", position: 0 }
]

animationRunning = true

// CHECK BANNER EXISTS
IF banners.length == 0 THEN

    DISPLAY "Banner could not be loaded."
    IN bannerError

    animationRunning = false
    RETURN animationRunning

END IF


// UPDATE BANNER USING DOM EVENT/TIMER
SET INTERVAL every 50ms USING arrow function:

    position = position + 1

    // LOOP THROUGH BANNERS
    FOR EACH banner IN banners DO

        // UPDATE DOM
        MOVE banner element
        SET style.left = position + "%"

    END FOR


    IF position > 100 THEN
        position = 0
    END IF

RETURN animationRunning
```

END FUNCTION

WHEN Game is completed

```
// DOM EVENT
score = GET score FROM game
duration = GET duration FROM game

CLEAR scoreError
CLEAR scoreMessage

CALL saveGameScore(score, duration)
```

END EVENT

FUNCTION saveGameScore(score, duration)

```
// VARIABLES AND DATA TYPES
// score = Number
// duration = Number
// scoreData = Object
// scores = Array of Score Objects
// saved = Boolean

// VALIDATE SCORE
IF score < 0 THEN

    DISPLAY "Score cannot be negative."
    IN scoreError

    RETURN false

END IF


// VALIDATE DURATION
IF duration <= 0 THEN

    DISPLAY "Invalid game duration."
    IN scoreError

    RETURN false

END IF


scores = GET /scores


scoreData = {
    userId: currentUser.uid,
    score: score,
    duration: duration,
    completedAt: timestamp
}


// ADD SCORE TO ARRAY
scores.push(scoreData)


// SAVE SCORE
POST /scores/{scoreId}
WITH scoreData


// UPDATE DOM
DISPLAY "Score: " + score
IN scoreDisplay

DISPLAY "Game completed successfully!"
IN scoreMessage


saved = true

RETURN saved
```

END FUNCTION
```
## FIREBASE REST API ENDPOINT PLAN

WHEN User page is loaded

```
// DOM EVENT
CALL getUser(currentUser.uid, token)
```

END EVENT

FUNCTION getUser(uid, token)

```
// VALIDATE USER ID
IF uid IS EMPTY THEN

    DISPLAY "User ID is required."
    IN userError

    RETURN false

END IF

TRY

    user = GET /users/{uid}.json?auth=token

    // UPDATE DOM
    DISPLAY user.displayName
    IN userName

    DISPLAY user.email
    IN userEmail

    DISPLAY "User information loaded successfully."
    IN userMessage

    RETURN user

CATCH error

    DISPLAY "Unable to load user information."
    IN userError

    RETURN false

END TRY
```

END FUNCTION

WHEN Add Task form is submitted

```
// DOM EVENT
PREVENT default form submission

taskData = GET task information FROM DOM

CLEAR taskError
CLEAR taskMessage

CALL createTask(taskData, token)
```

END EVENT

FUNCTION createTask(taskData, token)

```
// VALIDATE TASK DATA
IF taskData.title IS EMPTY THEN

    DISPLAY "Task title is required."
    IN taskError

    RETURN false

END IF

TRY

    response = POST /tasks.json?auth=token
    WITH taskData

    taskId = response.name

    DISPLAY "Task created successfully!"
    IN taskMessage

    // UPDATE TASK LIST IN DOM
    DISPLAY taskData.title
    IN taskContainer

    RETURN taskId

CATCH error

    DISPLAY "Task could not be created."
    IN taskError

    RETURN false

END TRY
```

END FUNCTION

WHEN Edit Task button is clicked

```
// DOM EVENT
taskId = GET task ID FROM selected task

newData = GET updated task information FROM DOM

CALL updateTask(taskId, newData, token)
```

END EVENT

FUNCTION updateTask(taskId, newData, token)

```
IF taskId == "" THEN

    DISPLAY "Invalid task ID."
    IN taskError

    RETURN false

END IF

TRY

    PATCH /tasks/{taskId}.json?auth=token
    WITH newData

    DISPLAY "Task updated successfully!"
    IN taskMessage

    // UPDATE DOM
    UPDATE selected task IN taskContainer
    WITH newData

    RETURN true

CATCH error

    DISPLAY "Task could not be updated."
    IN taskError

    RETURN false

END TRY
```

END FUNCTION

WHEN Delete Task button is clicked

```
// DOM EVENT
taskId = GET task ID FROM selected task

confirmation = SHOW confirmation dialog
"Are you sure you want to delete this task?"

IF confirmation == true THEN

    CALL deleteTask(taskId, token)

ELSE

    DISPLAY "Delete cancelled."
    IN taskMessage

END IF
```

END EVENT

FUNCTION deleteTask(taskId, token)

```
IF taskId == "" THEN

    DISPLAY "Invalid task ID."
    IN taskError

    RETURN false

END IF

TRY

    DELETE /tasks/{taskId}.json?auth=token

    // UPDATE DOM
    REMOVE selected task FROM taskContainer

    DISPLAY "Task deleted successfully!"
    IN taskMessage

    RETURN true

CATCH error

    DISPLAY "Task could not be deleted."
    IN taskError

    RETURN false

END TRY
```

END FUNCTION

WHEN Approve or Reject booking button is clicked

```
// DOM EVENT
bookingId = GET booking ID FROM selected booking

newStatus = GET selected status FROM DOM

CALL updateBooking(bookingId, newStatus, token)
```

END EVENT

FUNCTION updateBooking(bookingId, newStatus, token)

```
IF bookingId == "" THEN

    DISPLAY "Invalid booking ID."
    IN bookingError

    RETURN false

END IF

IF newStatus == "approved" OR newStatus == "rejected" THEN

    TRY

        PATCH /bookings/{bookingId}.json?auth=token
        WITH { status: newStatus }

        // UPDATE DOM
        UPDATE booking status IN bookingContainer

        DISPLAY "Booking status updated successfully!"
        IN bookingMessage

        RETURN true

    CATCH error

        DISPLAY "Booking status could not be updated."
        IN bookingError

        RETURN false

    END TRY

ELSE

    DISPLAY "Invalid booking status. Choose approved or rejected."
    IN bookingError

    RETURN false

END IF
```

END FUNCTION

WHEN My Bookings page is loaded

```
// DOM EVENT
CALL getUserBookings(currentUser.uid, token)
```

END EVENT

FUNCTION getUserBookings(uid, token)

```
IF uid IS EMPTY THEN

    DISPLAY "User ID is required."
    IN bookingError

    RETURN false

END IF

TRY

    bookings = GET /bookings.json?orderBy="userId"&equalTo="{uid}"&auth=token


    // CLEAR OLD BOOKINGS
    CLEAR bookingContainer


    // DISPLAY BOOKINGS DYNAMICALLY
    FOR EACH booking IN bookings DO

        CREATE bookingElement

        DISPLAY booking.topic IN bookingElement
        DISPLAY booking.preferredDate IN bookingElement
        DISPLAY booking.status IN bookingElement

        APPEND bookingElement TO bookingContainer

    END FOR


    IF bookings IS EMPTY THEN

        DISPLAY "You have no bookings."
        IN bookingMessage

    ELSE

        DISPLAY "Bookings loaded successfully."
        IN bookingMessage

    END IF


    RETURN bookings

CATCH error

    DISPLAY "Unable to load your bookings."
    IN bookingError

    RETURN false

END TRY
```

END FUNCTION
