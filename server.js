const inquirer = require('inquirer');
// const { viewAllRoles } = require('./db');
const db = require('./db');
require('console.table');


async function mainMenu() {
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
                'Add Role'
            ]
         } 
    ]) 

    switch(selection){
        case 'View All Departments':
            return viewAllDepartments();
        case 'View All Roles':
            return viewAllRoles();
        case 'View All Employees':
            return viewAllEmployeees();
        case 'Add Department':
            return addDepartment();
        // case 'Add Role':
        //     return addRole();
        
        };
};


async function viewAllDepartments() {
    const [departments] = await db.viewAllDepartments();
    console.log('\n');
    console.table(departments);
    // console.log('\n');
    mainMenu();
};


async function viewAllRoles() {
    const [roles] = await db.viewAllRoles();
    console.log('\n');
    console.table(roles);
    mainMenu();
};


async function viewAllEmployeees() {
    const [employees] = await db.viewAllEmployees();
    console.log('\n');
    console.table(employees);
    mainMenu();
}

async function addDepartment() {
    const department = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ])
    db.addDepartment(department);
    console.log('\n');
    console.log(`${department.name} added!`)
    console.log('\n');
    mainMenu();
};


// async function addRole() {
//     const role = await inquirer.prompt([
//         {
//             name: 'title',
//             type: 'input',
//             message: 'What is the title of the role?'
//         },
//         {
//             name: 'salary',
//             type: 'input',
//             message: 'What is the salary of the role?'
//         },
//         {

//         },
//         // {
//         //     name: 'name',
//         //     type: 'input',
//         //     message: 'What is the department of the role?'
//         // }
//     ])
//     // console.log(role);
//     db.addRole(role);
//     console.log('\n');
//     console.log(`${role.title} added!`)
//     console.log('\n');
//     mainMenu();
// };

mainMenu();
