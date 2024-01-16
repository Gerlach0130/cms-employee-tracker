const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'Gerlach0130',
      password: 'Deanna1026',
      database: 'records_db'
    },
    console.log(`Connected to the records_db database.`)
  );

inquirer
  .prompt([
    {
        type: 'list',
        message: 'Select:',
        name: 'menu',
        choices: 
        ['View all departments', 
        'View all roles', 
        'View all employees', 
        'Add a department', 
        'Add a role', 
        'Add an employee', 
        'Update an employee role']
      }
  ])
  .then((answer => {
    if (answer.menu === 'View all departments') {
      showDepartments();
    }

    if (answer.menu === 'View all roles') {
      showRoles();
    }

    if (answer.menu === 'View all employees') {
      showEmployees();
    }

    if (answer.menu === 'Add a department') {
      addDepartment();
    }

    if (answer.menu === 'Add a role') {
      addRole();
    }

    if (answer.menu === 'Add an employee') {
      addEmployee();
    }

    if (answer.menu === 'Update an employee role') {
      updateEmployeeRole();
    }
}));

showDepartments = () => {
  console.log('Showing all departments:');
  const data = `SELECT department.id, 
                department.name 
                FROM department`;
  db.query(data, (err, rows) => {
    if (err) throw err;
    console.table(rows);
  });
};

showRoles = () => {
  console.log('Showing all roles:');
  const data = `SELECT role.id, 
                role.title, 
                role.salary, 
                department.name AS department 
                FROM role
                INNER JOIN department ON role.department_id = department.id`;
  db.query(data, (err, rows) => {
    if (err) throw err;
    console.table(rows);
  });
};

showEmployees = () => {
  console.log('Showing all roles:');
  const data = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title,
                department.name AS department,
                role.salary,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.query(data, (err, rows) => {
    if (err) throw err;
    console.table(rows);
  });
};

addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDepartment',
      message: 'Enter new department name:',
    }
  ])
    .then(answer => {
      const data = `INSERT INTO department (name) VALUES (?)`;
      db.query(data, answer.addDepartment, () => {
        console.log('Added ' + answer.addDepartment + ' to departments.'); 
    });
  });
};

addRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'newRole',
      message: "Enter new role name:",
    },
    {
      type: 'input', 
      name: 'newRolesalary',
      message: "Enter new role salary:",
    }
  ])
    .then(answers => {
      const answerData = [answers.newRole, answers.newRolesalary];
      const roleData = `SELECT name, id FROM department`;
      db.query(roleData, () => {
        inquirer.prompt([
        {
          type: 'list', 
          name: 'department',
          message: "Choose new role department:",
          choices: ''
        }
        ])
          .then(answer => {
            const department = answer.department;
            answerData.push(department);
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(sql, data, () => {
              console.log('Added' + answer.newRole + " to roles.");
       });
     });
   });
 });
};

addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
    }
  ])
    .then(answer => {
    const answerData = [answer.firstName, answer.lastName]
    const roleData = `SELECT role.id, role.title FROM role`;
    db.query(roleData, () => { 
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "Select new employee role:",
              choices: ''
            }
          ])
            .then(answer => {
              const role = answer.role;
              answerData.push(role);
              const managerData = `SELECT * FROM employee`;
              db.query(managerData, () => {
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Select new employee manager:",
                    choices: ''
                  }
                ])
                  .then(answer => {
                    const manager = answer.manager;
                    answerData.push(manager);
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    db.query(sql, params, (result) => {
                    console.log("New employee added to database.")
              });
            });
          });
        });
     });
  });
};

updateEmployee = () => {
  const employeeData = `SELECT * FROM employee`;
  db.query(employeeData, () => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: ''
      }
    ])
      .then(answer => {
        const dataArr = [answer.name];
        const roleData = `SELECT * FROM role`;
        db.query(roleData, () => {          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: ''
              }
            ])
                .then(answer => {
                const role = answer.role;
                dataArr.push(role); 
                let employee = dataArr[0]
                dataArr[0] = role
                dataArr[1] = employee
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(sql, dataArr, () => {
                console.log("Successfully updated employee.");
          });
        });
      });
    });
  });
};