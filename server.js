const inquirer = require('inquirer');
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
    console.log('\n');

    mainMenu();
};



async function viewAllRoles() {

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



async function addDepartment() {

    const department = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ])

    db.addDepartment(department);

    const {name} = department

    console.log('\n');
    console.log(`${name} added!`)
    console.log('\n');

    mainMenu();
};



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



async function addEmployee() {

    const [roles] = await db.viewAllRoles();
    const [employees] = await db.viewAllEmployees();
    const [managers] = await db.managerSelect(employees)

    const rolesChoices = roles.map(({id, title}) => ({
        name: title,
        value: id
    }));

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




mainMenu();
