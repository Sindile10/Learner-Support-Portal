## USER REGISTRATION
```
FUNCTION registerUser(displayName, email, password, role)

    // VARIABLES AND DATA TYPES
    SET emailValid = VALIDATE email
    SET passwordValid = LENGTH OF password >= 8
    SET allowedRoles = ["learner", "admin"]

    // VALIDATE INPUT
    IF displayName IS EMPTY THEN
        SHOW error "Display name is required"
        RETURN
    END IF

    IF emailValid = FALSE THEN
        SHOW error "Invalid email address"
        RETURN
    END IF

    IF passwordValid = FALSE THEN
        SHOW error "Password must contain at least 8 characters"
        RETURN
    END IF

    // CHECK USER ROLE
    IF role IS NOT IN allowedRoles THEN
        SHOW error "Invalid user role"
        RETURN
    END IF

    TRY

        // CREATE USER IN FIREBASE AUTHENTICATION
        CREATE user in Firebase Authentication
        USING email AND password

        // GET USER ID
        SET uid = GET uid from authenticated user

        // GET CURRENT TIME
        SET createdAt = CURRENT timestamp

        // CREATE USER OBJECT
        SET userObject = {
            displayName: displayName,
            email: email,
            role: role,
            createdAt: createdAt
        }

        // SAVE USER DATA TO FIREBASE
        POST /users/{uid}
        WITH userObject

        SHOW "Registered successfully"

        REDIRECT to dashboard.html

    CATCH error

        SHOW error.message

    END TRY

END FUNCTION

## LOGIN / SIGN IN

FUNCTION loginUser(email, password)

    // VARIABLES AND DATA TYPES
    SET emailValid = VALIDATE email
    SET passwordValid = LENGTH OF password > 0

    // VALIDATE INPUT
    IF email IS EMPTY OR password IS EMPTY THEN
        SHOW error "Please fill in all fields"
        RETURN
    END IF

    IF emailValid = FALSE THEN
        SHOW error "Please enter a valid email address"
        RETURN
    END IF

    IF passwordValid = FALSE THEN
        SHOW error "Password is required"
        RETURN
    END IF

    TRY

        // SIGN IN USER
        SIGN IN with Firebase Authentication
        USING email AND password

        // GET CURRENT USER
        SET currentUser = authenticated user
        SET uid = currentUser.uid
        SET currentDate = CURRENT timestamp

        // SAVE NON-SENSITIVE USER PREFERENCES
        SET lastLogin = currentDate
        SET theme = GET theme FROM localStorage

        STORE lastLogin in cookie

        SHOW "Login successful"

        // CHECK USER AUTHENTICATION STATE
        CALL checkAuthState()

    CATCH error

        SHOW "Invalid email or password"

    END TRY

END FUNCTION


FUNCTION checkAuthState()

    ON authentication state changed

        IF current user EXISTS THEN

            SET uid = current user.uid

            // FETCH USER DATA
            GET /users/{uid} FROM Firebase Database

            SET userData = returned user object
            SET userRole = userData.role

            // ROLE-BASED REDIRECTION
            IF userRole = "admin" THEN

                REDIRECT to admin.html

            ELSE IF userRole = "learner" THEN

                REDIRECT to dashboard.html

            ELSE

                SHOW error "Invalid user role"
                REDIRECT to login.html

            END IF

        ELSE

            REDIRECT to login.html

        END IF

END FUNCTION
```
## SIGN OUT
```
FUNCTION signOutUser()

    // VARIABLE AND DATA TYPE
    // confirmation is a Boolean value: TRUE or FALSE
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


    // GET CURRENT USER
    currentUser = users.find(user => user.loggedIn === true)


    // CHECK IF A USER IS LOGGED IN
    IF currentUser EXISTS THEN

        // CHECK USER RESPONSE
        IF confirmation === TRUE THEN

            TRY

                // SIGN OUT FROM FIREBASE
                SIGN OUT current user from Firebase Authentication


                // LOOP THROUGH USERS
                FOR EACH user IN users DO

                    // CHECK IF THIS IS THE CURRENT USER
                    IF user.uid === currentUser.uid THEN

                        user.loggedIn = false

                    END IF

                END FOR


                // SHOW SUCCESS MESSAGE
                SHOW "You have successfully logged out"


                // REDIRECT USER
                REDIRECT to login.html


                // RETURN SUCCESS RESULT
                signOutSuccessful = true

                RETURN signOutSuccessful


            CATCH error

                // STORE ERROR MESSAGE
                errorMessage = error.message

                SHOW errorMessage

                signOutSuccessful = false

                RETURN signOutSuccessful

            END TRY


        ELSE

            // USER CANCELLED SIGN OUT
            SHOW "Sign out cancelled"

            signOutSuccessful = false

            RETURN signOutSuccessful

        END IF


    ELSE

        // NO USER IS LOGGED IN
        SHOW "No user is currently logged in"

        signOutSuccessful = false

        RETURN signOutSuccessful

    END IF

END FUNCTION
```

TASK CREATION-CREATE
```

FUNCTION createTask(userId, title, dueDate, priority)

    // VARIABLES AND DATA TYPES
    // userId = String
    // title = String
    // dueDate = Date
    // priority = String
    // completed = Boolean
    // createdAt = Date/Time
    // taskList = Array of Task Objects


    // ARRAY OF TASK OBJECTS
    taskList = [
        {
            taskId: "001",
            userId: "user123",
            title: "Complete JavaScript",
            dueDate: "2026-09-05",
            priority: "high",
            completed: false,
            createdAt: timestamp
        }
    ]


    // VALIDATE TASK TITLE

    IF title is empty THEN

        SHOW error "Task title cannot be empty"

        RETURN false

    END IF


    // VALIDATE DUE DATE

    IF dueDate < today THEN

        SHOW error "Due date cannot be in the past"

        RETURN false

    END IF


    // VALIDATE PRIORITY

    IF priority != "low" AND priority != "medium" AND priority != "high" THEN

        SHOW error "Invalid priority"

        RETURN false

    END IF


    // CHECK IF TASK ALREADY EXISTS
    // find() is an array method
    // user => user.title === title is an arrow function

    existingTask = taskList.find(task => task.title === title)


    IF existingTask EXISTS THEN

        SHOW error "This task already exists"

        RETURN false

    END IF


    TRY

        // GET CURRENT USER FROM FIREBASE

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


        // ADD TASK OBJECT TO ARRAY

        taskList.push(newTask)


        // LOOP THROUGH TASK ARRAY

        FOR EACH task IN taskList DO

            // CHECK TASK STATUS

            IF task.completed === true THEN

                task.status = "COMPLETED"

            ELSE IF task.dueDate < today THEN

                task.status = "OVERDUE"

            ELSE

                task.status = "PENDING"

            END IF

        END FOR


        // SAVE TASK TO FIREBASE REST API

        POST /task/{autoGeneratedTaskId}

        WITH newTask


        // REFRESH TASK LIST ON DOM

        FOR EACH task IN taskList DO

            DISPLAY task.title
            DISPLAY task.dueDate
            DISPLAY task.priority
            DISPLAY task.status

        END FOR


        // SUCCESS RESULT

        taskCreated = true

        SHOW "Task created successfully"

        RETURN taskCreated


    CATCH error

        // ERROR HANDLING

        errorMessage = error.message

        SHOW errorMessage

        taskCreated = false

        RETURN taskCreated

    END TRY

END FUNCTION
```

## READ + DASHBOARD CALCULATIONS REQUIRED
```
FUNCTION loadDashboard(userId)

    tasks = GET /tasks

    userTasks = tasks.filter(task => task.userId === userId)

    total = userTasks.length

    completedList = userTasks.filter(task => task.completed === true)

    completed = completedList.length

    outstanding = total - completed

    IF total > 0 THEN
        progress = (completed / total) * 100
    ELSE
        progress = 0
    END IF

    taskTotals = {
        total: total,
        completed: completed,
        outstanding: outstanding
    }

    taskTitles = userTasks.map(task => task.title)

    highPriority = userTasks.filter(task => task.priority === "high")

    FOR EACH task IN userTasks DO

        IF task.completed === true THEN
            status = "Completed"
        ELSE IF task.dueDate < today THEN
            status = "Overdue"
        ELSE
            status = "Outstanding"
        END IF

        CREATE DOM element for task
        DISPLAY task.title, task.dueDate, task.priority, status

    END FOR

    DISPLAY taskTotals
    DISPLAY progress + "%"
    DISPLAY taskTitles
    DISPLAY highPriority

    RETURN true

END FUNCTION
```

## UPDATE TASK
```
FUNCTION updateTask(taskId, newData)

```
// taskId = String
// newData = Object
// tasks = Array of Task Objects
// updated = Boolean

tasks = GET /tasks

task = tasks.find(task => task.taskId === taskId)

IF task DOES NOT EXIST THEN
    SHOW "Task not found"
    RETURN false
END IF

IF task.userId != currentUser.uid THEN
    SHOW "Access denied"
    RETURN false
END IF

PATCH /tasks/{taskId} WITH newData

SHOW "Task updated"

FOR EACH task IN tasks DO
    DISPLAY task.title
END FOR

updated = true
RETURN updated
```

END FUNCTION

FUNCTION toggleComplete(taskId)

```
// taskId = String
// completed = Boolean
// newValue = Boolean

tasks = GET /tasks

task = tasks.find(task => task.taskId === taskId)

IF task DOES NOT EXIST THEN
    SHOW "Task not found"
    RETURN false
END IF

IF task.userId != currentUser.uid THEN
    SHOW "Access denied"
    RETURN false
END IF

completed = task.completed

newValue = NOT completed

PATCH /tasks/{taskId} WITH { completed: newValue }

SHOW "Task status updated"

RETURN true
```

END FUNCTION
```

## DELETE = CONFIRMATION DIOLOG - REQUIRED

FUNCTION deleteTask(taskId)

```
// taskId = String
// tasks = Array of Task Objects
// deleted = Boolean

tasks = GET /tasks

// FIND TASK USING ARRAY METHOD AND ARROW FUNCTION
task = tasks.find(task => task.taskId === taskId)

IF task DOES NOT EXIST THEN
    SHOW "Task not found"
    RETURN false
END IF

// CHECK THAT TASK BELONGS TO CURRENT USER
IF task.userId != currentUser.uid THEN
    SHOW "Access denied"
    RETURN false
END IF

confirmation = SHOW dialog "Delete this task? This cannot be undone."

IF confirmation === true THEN

    DELETE /tasks/{taskId} using REST DELETE

    // REMOVE TASK FROM ARRAY
    tasks = tasks.filter(task => task.taskId !== taskId)

    // LOOP THROUGH UPDATED TASKS
    FOR EACH task IN tasks DO
        DISPLAY task.title
    END FOR

    // RECALCULATE DASHBOARD
    total = tasks.length
    completed = tasks.filter(task => task.completed === true).length
    outstanding = total - completed

    IF total > 0 THEN
        progress = (completed / total) * 100
    ELSE
        progress = 0
    END IF

    SHOW "Task deleted"
    DISPLAY progress + "%"

    deleted = true
    RETURN deleted

ELSE

    SHOW "Delete cancelled"
    RETURN false

END IF
```

END FUNCTION
```

## SUPPORT BOOKINGS

FUNCTION bookSupport(topic, preferredDate, notes)

```
// topic = String
// preferredDate = Date
// notes = String
// bookings = Array of Booking Objects
// booking = Object
// status = String
// booked = Boolean

// VALIDATE INPUT
IF topic is empty OR preferredDate < today THEN
    SHOW "Please select a valid topic and date"
    RETURN false
END IF

bookings = GET /bookings

// CHECK FOR EXISTING BOOKING
existingBooking = bookings.find(
    booking => booking.userId === currentUser.uid
)

IF existingBooking EXISTS THEN
    SHOW "You already have a booking"
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
POST /bookings/{booking.bookingId} WITH booking

// LOOP THROUGH BOOKINGS
FOR EACH booking IN bookings DO
    DISPLAY booking.topic
    DISPLAY booking.preferredDate
    DISPLAY booking.status
END FOR

SHOW "Booking pending approval"

booked = true
RETURN booked
```

END FUNCTION
```

## ADMIN/ASSESSOR VIEW

FUNCTION loadAllBookingsAsAdmin()

```
// bookings = Array of Booking Objects
// search = String
// filtered = Array of Booking Objects
// booking = Object
// isAdmin = Boolean

IF currentUser.role != "admin" THEN
    SHOW "Access denied"
    RETURN false
END IF

bookings = GET /bookings

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

// DISPLAY BOOKINGS
FOR EACH booking IN filtered DO

    DISPLAY booking.topic
    DISPLAY booking.preferredDate
    DISPLAY booking.userId
    DISPLAY booking.status

    IF booking.status == "pending" THEN
        SHOW "Approve" button
        SHOW "Reject" button
    END IF

END FOR

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

IF newStatus != "approved" AND newStatus != "rejected" THEN
    SHOW "Invalid booking status"
    RETURN false
END IF

PATCH /bookings/{bookingId}
WITH { status: newStatus }

SHOW "Booking status updated"

updated = true
RETURN updated
```

END FUNCTION
```
## SEARCH, FILTER, SORT

FUNCTION searchAndFilter(tasks, searchText, categoryFilter, sortBy)

```
// tasks = Array of Task Objects
// searchText = String
// categoryFilter = String
// sortBy = String
// results = Array of Task Objects

searchText = CONVERT searchText TO String

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
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    )
END IF

// DISPLAY RESULTS
FOR EACH task IN results DO
    DISPLAY task.title
    DISPLAY task.category
    DISPLAY task.dueDate
    DISPLAY task.priority
END FOR

RETURN results
```

END FUNCTION
```

## COOKIE PREFERENCE, REDIRECT, PRINT

FUNCTION saveThemePreference(theme)

```
// theme = String
// themes = Array of Strings
// savedTheme = String
// isValid = Boolean

themes = ["light", "dark"]

IF theme IN themes THEN

    SET localStorage theme = theme
    SET cookie theme = theme

    APPLY theme TO body class

    savedTheme = theme
    isValid = true

ELSE

    SHOW "Invalid theme"
    isValid = false

END IF

RETURN isValid
```

END FUNCTION

FUNCTION onLoginSuccess()

```
// dashboard = String

dashboard = "dashboard.html"

REDIRECT TO dashboard

RETURN true
```

END FUNCTION

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

FOR EACH item IN progressData DO
    DISPLAY item
END FOR

printReady = true

IF printReady == true THEN
    CALL window.print()
END IF

RETURN printReady
```

END FUNCTION
``

## ANIMATION + GAME SCORES

FUNCTION startBannerAnimation()
```
// position = Number
// banners = Array of Banner Objects
// banner = Object
// animationRunning = Boolean

position = 0
banners = [
    { name: "Welcome Banner", position: 0 }
]

animationRunning = true

SET INTERVAL every 50ms USING arrow function:

    position = position + 1

    // LOOP THROUGH BANNERS
    FOR EACH banner IN banners DO
        MOVE banner element style.left = position
    END FOR

    IF position > 100 THEN
        position = 0
    END IF

RETURN animationRunning
```

END FUNCTION

FUNCTION saveGameScore(score, duration)
```
// score = Number
// duration = Number
// scoreData = Object
// scores = Array of Score Objects
// saved = Boolean

scores = GET /scores

scoreData = {
    userId: currentUser.uid,
    score: score,
    duration: duration,
    completedAt: timestamp
}

scores.push(scoreData)

POST /scores/{scoreId} WITH scoreData

saved = true

RETURN saved
```

END FUNCTION
```

## FIREBASE REST API ENDPOINT PLAN

FUNCTION getUser(uid, token)
user = GET /users/{uid}.json?auth=token
RETURN user
END FUNCTION

FUNCTION createTask(taskData, token)
response = POST /tasks.json?auth=token WITH taskData
RETURN response.name
END FUNCTION

FUNCTION updateTask(taskId, newData, token)
IF taskId == "" THEN
SHOW "Invalid task ID"
RETURN false
END IF

```
PATCH /tasks/{taskId}.json?auth=token WITH newData
RETURN true
```

END FUNCTION

FUNCTION deleteTask(taskId, token)
DELETE /tasks/{taskId}.json?auth=token
RETURN true
END FUNCTION

FUNCTION updateBooking(bookingId, newStatus, token)
IF newStatus == "approved" OR newStatus == "rejected" THEN
PATCH /bookings/{bookingId}.json?auth=token
RETURN true
ELSE
SHOW "Invalid status"
RETURN false
END IF
END FUNCTION

FUNCTION getUserBookings(uid, token)
bookings = GET /bookings.json?orderBy="userId"&equalTo="{uid}"&auth=token

```
FOR EACH booking IN bookings DO
    DISPLAY booking
END FOR

RETURN bookings
```

END FUNCTION

