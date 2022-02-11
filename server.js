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
                'Add Role',
                'Add Employee',
                'Update Role'
            ]
         }     
    ]) 

    console.log('\n');

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


// TODO: change id to list of possible choices
// Deconstruct
async function addRole() {

    const [departments] = await db.viewAllDepartments();

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
            message: 'What is the department id of the role?',
            choices: departmentChoices
        }
    ])
    // console.log(role);
    db.addRole(role);
    console.log('\n');
    console.log(`${role.title} added!`)
    // console.log(role)
    // console.table(role)
    console.log('\n');
    mainMenu();
};


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

    console.log(employeeChoices)

    const {roleId, employeeId} = await inquirer.prompt([

        {
            name: 'roleId',
            type: 'list',
            message: 'Select a role to update',
            choices: roleChoices
        },
        {
            name: 'employeeId',
            type: 'list',
            message: 'Select an employee to update',
            choices: employeeChoices
        }

    ])
    await db.updateRole( roleId, employeeId )
    console.log('\n')
    console.log()
    console.log(`Updated Role!`)
    mainMenu();
}

// change ids to list of possible choices
// construct employee
async function addEmployee() {

    const [roles] = await db.viewAllRoles();
    const [employees] = await db.viewAllEmployees();

    console.log(employees);

    const rolesChoices = roles.map(({id, title}) => ({
        name: title,
        value: id
    }));

    // if(employees.manager_id === NULL){
    const managerChoices = employees.map(({role_id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: role_id
    }))
//   }
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
            message: "What is the employee's role id? 1-3",
            choices: rolesChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: "What is the employee's manager id? 1,4,7",
            choices: managerChoices
        },
    ])
    db.addEmployee(employee);
    console.log('\n');
    console.log(`${employee.first_name} ${employee.last_name} added!`)
    // console.log(employee)
    // console.table(employee)
    console.log('\n');
    mainMenu();
}


mainMenu();
