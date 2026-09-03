Month 1 Formative Questions /Answers
1.	Explain why the programming life cycle should be followed before coding begins (2 marks)

The programming life cycle should be followed before coding begins because it helps developers understand the problem , plan the solution , and identify what the program needs to do before writing code. This reduces errors , saves time , and makes the final program more organized and easier to maintain 

2.	List and explain the main steps of the programming life cycle. Your answer must show how each step contributes to the development of a working solution.(15marks)

The software development life cycle or SDLC is the process of planning, writing, modifying and maintaining software .
The software development life cycle phases has its own set of activities that need to be performed by the team members involved in the development project. 
STAGE1 : Plan and brainstorm 
The first step in the software development life cycle is planning , its when you gather the team to brainstorm ,set goals and identify risks.
At this stage the team will work together to devise a set of business goals, requirements, specifications and any high-level risks that might hinder the projects success. 
STAGE 2 : Analyze requirements
After coming up with ideas, you need to organise them into a clear plan and design. This involves doing research and planning carefully to make sure the final product meets the needs of the customers. A detailed project plan and work breakdown structure can then be created to show the requirements and tasks needed to complete the project.
STAGE 3: Design the mock-ups 
Once you have your design plans ready, you can start creating wireframes and mock-ups. This helps you visualise how the final product will look and gives you a clearer idea of what needs to be done. The tasks from the work breakdown structure can also be developed during this stage. Tools like Adobe XD and Invision can make creating wireframes and mock-ups easier.
STAGE 4 : Develop the codeThe development phase is where coding begins to take place.
It is one of the most time-consuming phases in the SDLC . This phase often requires extensive programming skills and knowledge of databases. The team will build functionality for the product or service, which includes creating a user interface and building the database so users can store information in your system.
STAGE 5 : Test the product 
Before the final product is released , the mock-ups need to be tested to make sure there are no bugs or errors . Any problems found during testing should be fixed before the product is deployed. You need to make sure that the new system can work properly with existing software, systems, and processes.
STAGE6: Implement and launch the product
When all the testing phases you will then need to deploy your new application for customers to use. After deployment , the launch may involve marketing your new product or service so people know about its existence. If the software is in-house, it may mean implementing the change management process to ensure user training and acceptance.
STAGE7: Set up maintenance and operations 
The final stage of the software development life cycle is maintenance and operations. This is one of the most critical stages because its when your hard work gets puts to the rest. Maintenance involves updating an existing software product to fic bugs and ensure reliability. It can also include adding new features or functionality to a current product. Operations refer to the day to day running of a software product or service , such as performing backups and other administrative tasks.

3.	Explain when the const should be used instead of let. Also explain why var should normally in modern Javascript.(5 marks)

Using “const” makes it easier for someone to understand your code . By seeing “const” one knows without a look at the rest of the code , that this variable will not get reassigned(although it could still mutate) When you don’t want reassignment to happen , as a programmer you will get a useful error when It does happen , it prevents us from being confusing the value to the variable. 
-	You use “let” if the variables value will change during the code 
Const should be used when a variables value will not be reassigned after it has been declared 
Let should be used when the value of a variable needs to change during the program.
Whereas “var” should normally be avoided in modern JavaScript because it has function scope instead of block scope which can causes unexpected errors or behavior. Modern JavaScript uses “let” and “const” because they provide better control and clearer code.
4.	Explain how local and global scope can affect the reliability and maintainability of a JavaScript application. (2 marks)

To put it simply Local and global scope affects JavaScript reliability and maintainability by controlling where variables can be seen and changed 
How it affects reliability:
 unintended changes – Any part of your code can change a global variable. This makes bugs hard to find 
Name clashes-Different scripts or files might use the same global variable name.One file can break another file by changing that value.
How it affects maintainability : 
hard to track- You must read the whole project to see where a global variable is used
Tightly coupled code-Functions that rely on global variables break easily when you move or change.
How it affects reliability :
Data safety- Variables inside a function cannot be changed from the outside. Your data stays safe and predictable.
Fewer side effects- Local variables only live inside their block or function. They disappear when the code finishes running. 
How it affects maintainability:
Easy to read- You only need to look inside a small function to understand the variable
Reusable code- Independent functions are easy to move to other projects or change without breaking the rest of the app.

5.	Explain how map(), filter() and reduce() process an array of task objects differently. Provide one suitable use for each method. (6 marks)

In Java-script map(), filter(), and reduce() are higher-order array methods. They are designed to process collections of data without requiring explicit loops such as “for” or “while”. Each method accepts a callback function, which defines how individual elements should be processed.
When working with an array of objects , the main difference between these methods is the purpose of the operation and the type of result produced.
Map is used for transformation where it takes every element in the original array ,applies a specific operation to it , and places the resulting value into the new array.
Filter is used in the concept of selection instead of transforming ever element it evaluates each one against a specific condition -the callback function used by “filter” returns a Boolean value(true/false)
Reduce is a method that’s based on the concept of accumulation or reduction, instead of producing an output for every individual element , It processes the elements sequentially and combines their information into a single accumulated result.  

6.	Explain why an application should use classes or structured objects instead of storing related information in several unrelated variables. (5 marks) 
Encapsulation of related data
A class or object allows related information to be grouped together. For example, a task's title, deadline, priority, and completion status can all belong to one Task object.
Improved organisation
Grouping related properties makes the program easier to understand and maintain. Instead of having many separate variables, the information is stored as one meaningful entity.
Reusability
A class can act as a blueprint for creating multiple objects with the same structure. For example, the same Task class can be used to create hundreds of different tasks.
Encapsulation of behaviour
Classes can contain methods that operate on their own data. For example, a Task class could have methods such as completeTask() or updatePriority(). This keeps data and the operations performed on that data together.
Easier maintenance and scalability
Structured objects make applications easier to modify and expand. If a new property such as category needs to be added to a task, it can be incorporated into the class or object structure rather than requiring changes to many unrelated variables.

7.	Explain how branches, pull requests and automated checks reduce risk when developers collaborate on a project. (5 marks)

1.	Branches
A branch allows a developer to work on a new feature or fix without directly changing the main version of the project. This isolates changes and reduces the risk of unfinished or incorrect code affecting the main application.
2.	Pull Requests
A pull request provides a formal process for proposing changes from one branch to another. Other developers can review the code before it is added to the main branch.
3.	Code Review
Pull requests allow team members to identify bugs, incorrect logic, security issues, or poor coding practices before changes are merged. This provides an additional level of quality control.
4.	Automated Checks
Automated checks can automatically run tests, code-quality checks, or build processes when changes are submitted. They can detect problems that developers may overlook during manual review.
5.	Controlled Integration
Together, these practices ensure that changes are isolated, reviewed, and tested before being incorporated into the main project. This reduces the likelihood of breaking existing functionality and makes collaboration safer.

8.	Study the following values: const userName = "Lerato"; const age = 22; const isActive = true; const selectedProject = null; Answer the following: a. State the data type of each value. (4 marks)

(a)	Data Types
-	UserName = “Lerato” -String
-	Age = 22 – Number
-	isActive = true – Boolean 
-	selectedPorject = null – Null

(b)	The age value can be converted to a string using the String()function 
[const ageString = String(age);] this converts the number 22 into the string “22” .

(c)	The type of operator is used to determine the data type of a value or variable, the typeof helps programmers check what type of data a variable contains such as a string ,number ,Boolean or object. 

1.	          Analyse the following code:
Const total= “10”+5;
Const looseComparison = 5 ==”5”
Const strictComparison=5===”5”;
Console.log(total);
Console.log(loosrComparison);
Console.log(strictComparison);
Console.Console.log(strictComparison);
Answer the following :
a)	State the output of each snsole.log() statement 
1.	Console.log(total); - 105
2.	console.log(looseComparison); - true 
3.	console.log(strictComparison); - false 

b)	Explain why “10” +5 does not produce the number 15 
According to JavaScript saying “10” lets you know it’s a string and not a number , When you use the + operator with a string , Java treats it as a string concatenation (joining text together ) rather than addition. So “10” +5 becomes “105”

c)	Explain the difference between == and ===.
== checks the value only and can convert the data types before comparing 
=== checks both value and data type so no type conversion occurs 
d)	Rewrite the first statement so that it produces the number 15.
Const total = Number(“10”) + 5 ;

10.          function calculateTotal(price,quantity = 1){
					Return price*quantity;
		}
		Const applyDiscount=(total,percentage)=>{
					Return total-total*(percentage/100);
		};
		Const orderTotal=calculateTotal(150,3);
		constfinalTotal= applyDiscount(orderTotal,10);

a)	Identify the parameters of the calculateTotal()
The parameters of calculateTotal() are:
Price and quantity
-	Price , the price of the item 
-	Quantity , the number of items with a default value of 1 
b)	Explain the purpose of the default value assigned to quantity.
The default value quantity = 1 means that if no quantity is provided when calling the function, JavaScript will automatically use 1.It provides a value of 1 for quantity when no quantity is specified ,preventing the function from having an undefined quantity.
c)	Explain what the return keyword does 
The return keyword sends a value back from a function to where the function was called and ends the functions execution. The return keyword provides the result of a function back to the caller and stops the function from running further.
d)	State the value stored in order Total 
The value stored in orderTotal is: 450
Why?.. 105*3 = 450
e)	State the value stored in finalTotal
The value stored in finalTotal is = 405 
Why?.. order Total =450
	      10% discount = 450* 10/100 = 45
	       450 -45 = 405
f)	Explain the difference between a function declaration and an arrow function 
A  function declaration uses the function keyword, while an arrow function uses the => syntax. A function declaration is written using the unction keyword ,while an arrow function is written using =>.

		11.Study the following array :
			Const tasks ={
{title:”Create wireframes”, completed:true ,hours 3 }
{title:”Develop login form”, completed:false,hours 5 }
{title:”Test application”,completed:true ,hours :2}
{title:”Write documentation”, completed:false,hours:4}
Write Javascript code that :

a)	Uses a loop to display the title of every task.
You can use a for…of loop to go through each task and display its title:
For(const task of tasks) {
	Console.log(task.title);
}
The output:
Create wireframes
Develop login form 
Test application
Write documentation 
b)	Uses conditional statements to display only completed tasks.
For (const task of tasks) {
	If (task.completed === true) {
		Console.log(task.title);
}
}
Output : create wireframes, test application 

c)	Calculate the total number of hours for all task 
Let completedTasks = 0

For (const task of task) {
	If(task.completed === true) {
		completedTasks ++;
}
}
Console.log(completedTaks);
Answer: 2 completed tasks 

d)	Calculate the total number of hours for all tasks 
Let totalHours = 0 ;
For (const task of tasks ) {
	totalHours += task.hours;
}
Console.log(totalHours);
Output: 14 Hours

e)	Display an appropriate message if no tasks are vailable 
If (task.length === 0) {
	Console.log(“No tasks are available”);
}

		15. Study the following statement:
			Document.cookie = “theme =dark:max-age=3600:path=/;
		Answer the following:
a)	Explain what information the cookie stores
The cookie stores information about the users session or preferences, such as login status or saved settings 
b)	Explain the purpose of max-age=3600
Max-age=3600 means the cookie will remain stored fo 3600 seconds (1 hour) before it expires 
c)	Explain the purpose of path=/.
Path=/ means the cookie is available across the entire website, it allows the cookie to be accessed on all pages of the websites.
d)	Write a JavaScript statement that display the available cookies.
Console.log(document.cookie);
			
			Testing and Problem-Solving
			16. A registration form contains the following fields:
•	Name;
•	Email address;
•	Password;and
•	Age
Develop five test cases that could be use to test the form .Each test must include:
•	The input condition being tested;and
•	The expected result
Your test cases must include at least one valid submission, one missing value, one invalid email address and one boundary-value test.
TEST CASE 	INPUT/CONDITION BEING TESTED	EXPECTED RESULT
1. Valid submission	Name:Adam Sandler,Email:adam@gmail.com,Password: Password123, Age:25 	Form is accepted and registration is successful
2.Missing value	Name id left blank; other fields contain valid information	Form is rejected and an error message such as “Name is required” is displayed
3.Invalid email	Email: adam@gmail or adam@.com	Form is rejected and “Please enter a valid email address” is displayed
4.Boundary value	Age is entered at the minimum allowed age ,eg 18	Form is accepted if 18 is the minimum allowed age 
5.Invalid age	Age is entered below the minimum e.g. 17	Form is rejected and an error message such as “You must be 18 or older “ is displayed 




	








 
Course.org
https://stackoverflow.com/
https://dev.to/niteshgairola/understanding-variables-in-javascript-beginners-guide-5g85
