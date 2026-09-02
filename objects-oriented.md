// OBJECT -ORIENTED DESIGN
// CLASS DIAGRAM

-----------------|-----------------
| User <> |-----  Task |
----------------------------------
| - userID |    | - taskID |
| - name |      | - taskName |
| - email |     | - notes[] |
| - password    |  +-----------------+
+-----------------+
          
         

     
--------------------------------- --- ------------------+
| Learner |---------| Task |----------| Submission |
---------------------------------------------------------
| - classID | | - taskID |             | - submissionID |
------------ | - title |             | - grade |
                       | - status |    | - submitDate |
                       - dueDate |    | - feedback |
                       -------------------------------

         
         |
-----------------
| Lecturer |
-----------------
| - staffID |S
| - classes[] |
----------------
| +markRegister() |
| +grade() |
| +uploadMaterial()|
-----------------

 Relationships:
1. User is parent of 'Learner' and 'Lecturer' -- Inheritance
2. Lecturer - Assignment - Lecturer creates many tasks
3. Learner - Submission - Learner submits many tasks         