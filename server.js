const inquirer = require('inquirer');
const db = require('./db');
require('console.table');


// function to send user to main menu with all of the available actions they can perform
async function mainMenu() {
    // deconstructs the selection object to extract the choices value from the selection object
    const {selection} = await inquirer.prompt([
        {
            name: 'selection',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Role',
                'Quit'
            ]
         }     
    ]) 

    console.log('\n');

    // switch case to choose the action to perform, takes in the deconstructed selection object value and returns the corresponding function
    switch(selection){
        case 'View All Departments':
            return viewAllDepartments();
        case 'View All Roles':
            return viewAllRoles();
        case 'View All Employees':
            return viewAllEmployeees();
        case 'Add Department':
            return addDepartment();
        case 'Add Role':
            return addRole();
        case 'Add Employee':
            return addEmployee();
        case 'Update Role':
            return updateRole()
        case 'Quit':
            return quitApp()
        };
};


// function to view all departments
async function viewAllDepartments() {

    // creates departments array from db view method
    const [departments] = await db.viewAllDepartments();

    console.log('\n');
    // logs departments table 
    console.table(departments);
    console.log('\n');

    // calls main menu function to send user to the main menu
    mainMenu();
};


// function to view all roles
async function viewAllRoles() {

    // awaits db view method and creates roles array
    const [roles] = await db.viewAllRoles();

    console.log('\n');
    console.table(roles);
    console.log('\n');

    mainMenu();
};



async function viewAllEmployeees() {

    const [employees] = await db.viewAllEmployees();

    console.log('\n');
    console.table(employees);
    console.log('\n');

    mainMenu();
}


// function to add a department
async function addDepartment() {

    // creates department variable based on the inquirer prompt
    const department = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ])

    // adds department using addDepartment() to db
    db.addDepartment(department);

    // deconstructs department object to get name value
    const {name} = department

    console.log('\n');
    console.log(`${name} added!`)
    console.log('\n');

    // returns user to main menu
    mainMenu();
};


// function to add role
async function addRole() {

    const [departments] = await db.viewAllDepartments();

    // creates departmentChoices variable, maps the id and name from departments to departmentChoices to be used in inquirer prompt
    const departmentChoices = departments.map(({id, name}) => ({
        name: name,
        value: id
    }));

    const role = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role?'
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'What department is this role in?',
            choices: departmentChoices
        }
    ])

    db.addRole(role);

    const {title} = role

    console.log('\n');
    console.log(`${title} added!`)
    console.log('\n');

    mainMenu();
};


// funciton to add employee
async function addEmployee() {

    // creates arrays based on each table by awaiting the db values for each
    const [roles] = await db.viewAllRoles();
    const [employees] = await db.viewAllEmployees();
    const [managers] = await db.managerSelect(employees)

    // creates rolesChoices variable, maps id and title values from roles
    const rolesChoices = roles.map(({id, title}) => ({
        name: title,
        value: id
    }));

    // creates managersChoices from managers for user to choose from
    const managerChoices = managers.map(({id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }))

    const employee = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is the employee's last name?"
        },
        {
            name: 'role_id',
            type: 'list',
            message: "What is the employee's role?",
            choices: rolesChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: "Who is the employee's manager?",
            choices: managerChoices
        },
    ])

    
    db.addEmployee(employee);

    const {first_name, last_name} = employee

    console.log('\n');
    console.log(`${first_name} ${last_name} added!`)
    console.log('\n');

    mainMenu();
}


// function to update an employees role
async function updateRole() {

    const [roles] = await db.viewAllRoles();
    const [employee] = await db.viewAllEmployees();

    const roleChoices = roles.map(({id, title}) => ({
        name: title,
        value: id
    }))

    const employeeChoices = employee.map(({id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }))

    // deconstructs the employeeId and roleId
    const { employeeId, roleId } = await inquirer.prompt([

        {
            name: 'employeeId',
            type: 'list',
            message: 'Select an employee to update their role',
            choices: employeeChoices
        },
        {
            name: 'roleId',
            type: 'list',
            message: 'Select their new role',
            choices: roleChoices
        }    
    ])

    await db.updateRole( employeeId, roleId )

    console.log(roleId);
    console.log(employeeId)

    console.log('\n')
    console.log(`Updated Role!`)
    console.log('\n');

    mainMenu();
}


// function to quit the app
async function quitApp(){

    const wantToQuit = await inquirer.prompt([
        {
            name: 'quit',
            type: 'confirm',
            message: 'Would you like to quit?'
        }
    ])

    // deconstructs the quit object to get the boolean value for switch case
    const {quit} = wantToQuit
    
    switch(quit){
        case true:
            console.log('\n')
            // ends app
            process.exit();
        case false:
            console.log('\n')
            // returns to menu
            mainMenu();
    }
}


mainMenu();
