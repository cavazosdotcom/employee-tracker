// requires connections
const connection = require('./connections');

// creates class data base
class DB{
    constructor(connection) {
        this.connection = connection
    }
    
    // creates method to view all departments. Returns this.connection and promises a mysql query
    // selects the id and name from the department table
    viewAllDepartments(){
        return this.connection.promise().query(
            `SELECT
                department.id, 
                department.name
            FROM
                department`
        )
    }

    // creates method to view all roles. Returns this.connection and promises a mysql query
    // selects the id, title salary and FK department name from the role table. Join department where role.department_id = department.id
    viewAllRoles() {
        return this.connection.promise().query(
            `SELECT
                role.id, 
                role.title, 
                role.salary, 
                department.name
            FROM
                role
            LEFT JOIN
                department ON role.department_id = department.id`
        )
    }

    // creates method to view all employees. Returns this.connection and promises a mysql query
    // Selects id, first and last name, role title, tole salary and managers names from employee table
    // from the employee table, join role where employee.role_id = role.id
    // from the employee table, join the same table where manager.id = employee_manager_id
    viewAllEmployees() {
        return this.connection.promise().query(
            `SELECT
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                role.salary,
                concat(manager.first_name, ' ', manager.last_name) AS manager
            FROM
                employee
            LEFT JOIN
                role ON employee.role_id = role.id
            LEFT JOIN
                employee manager ON manager.id = employee.manager_id`
        )
    }

    // creates method to add a department. Returns this.connection and promises a mysql query
    // insert the department variable into department table
    addDepartment(department){
        return this.connection.promise().query(
            `INSERT INTO 
                department
            SET 
                ?`, department
        )
    }

    // creates method to add a role. Returns this.connection and promises a mysql query
    addRole(role){
        return this.connection.promise().query(
            `INSERT INTO
                role
            SET
                ?;`, role
        )
    }

    // creates method to add an employee. Returns this.connection and promises a mysql query
    addEmployee(employee){
        return this.connection.promise().query(
            `INSERT INTO
                employee
            SET
                ?;`, employee
        )
    }

    // creates method to update a role. Returns this.connection and promises a mysql query 
    // updates the role_id where the employee id is in the employee table
    updateRole( employeeId, roleId ){
        return this.connection.promise().query(
            `UPDATE
                employee
            SET
                role_id = ?
            WHERE
                id = ?`, [roleId, employeeId]
            
        )
    }

    // creates method to select who the employee's manager is. Returns this.connection and promises a mysql query
    // selects all from employee where manager_id = null
    managerSelect(){
        return this.connection.promise().query(
            `SELECT
                *
            FROM
                employee
            WHERE
                manager_id IS NULL`
        )
    }
};



// exports a new DB connection
module.exports = new DB(connection)