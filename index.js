const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'Gerlach0130',
      // MySQL password
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
        name: 'contact',
        choices: 
        ['View all departments', 
        'View all roles', 
        'View all employees', 
        'Add a department', 
        'Add a role', 
        'Add an employee', 
        'Update an employee role'],
      },
  ]);