const connection = require('./connections');
class DB{
    constructor(connection) {
        this.connection = connection
    }
    

    viewAllDepartments(){
        return this.connection.promise().query(
            `SELECT
                department.id, 
                department.name
            FROM
                department`
        )
    }


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

    // TODO: CHANGE MANAGER ID TO NAME
    viewAllEmployees() {
        return this.connection.promise().query(
            `SELECT
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                role.salary,
                employee.manager_id
            FROM
                employee
            JOIN 
                role ON employee.role_id = role.id`
        )
    }

    addDepartment(department){
        return this.connection.promise().query(
            `INSERT INTO 
                department
            SET 
                ?`, department
        )
    }

    
    // addRole(role){
    //     return this.connection.promise().query(
    //         `INSERT INTO
    //             role
    //         SET
    //             ?`, role
    //     )
    // }

};


module.exports = new DB(connection)