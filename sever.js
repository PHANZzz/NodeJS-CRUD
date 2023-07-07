const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

connection.connect();

app.get('/', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <h1>Home</h1>
        <ul>
            <li><a href="/users">Users</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    `);
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results, fields) => {
        if (error) throw error;
        let table = `
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            <a href="/" class="btn btn-primary">Back to Home</a>
            <a href="/add" class="btn btn-success">Add New</a>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
        results.forEach(result => {
            table += `
                <tr>
                    <td>${result.id}</td>
                    <td>${result.name}</td>
                    <td>
                        <a href="/update/${result.id}" class="btn btn-primary">Update</a>
                        <form action="/delete/${result.id}" method="POST" style="display: inline-block;">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </td>
                </tr>`;
        });
        table += `
                </tbody>
            </table>`;
        res.send(table);
    });
});

app.get('/add', (req, res) => {
    let form = `
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <style>
            #name {
                width: 20%;
                margin-left: 0;
            }
        </style>
        <form action="/add" method="POST">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" id="name" name="name">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>`;
    res.send(form);
});

app.post('/add', (req, res) => {
    let name = req.body.name;
    connection.query('INSERT INTO users (name) VALUES (?)', [name], (error, results, fields) => {
        if (error) throw error;
        res.redirect('/users');
    });
});
app.get('/update/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results, fields) => {
        if (error) throw error;
        let result = results[0];
        let form = `
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            <style>
                #name {
                    width: 20%;
                    margin-left: 0;
                }
            </style>
            <form action="/update/${id}" method="POST">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" class="form-control" id="name" name="name" value="${result.name}">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>`;
        res.send(form);
    });
});

app.post('/update/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    connection.query('UPDATE users SET name = ? WHERE id = ?', [name, id], (error, results, fields) => {
        if (error) throw error;
        res.redirect('/users');
    });
});

app.post('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM users WHERE id = ?', [id], (error, results, fields) => {
        if (error) throw error;
        res.redirect('/users');
    });
});

app.get('/about', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <h1>This is the About page</h1>
        <a href="/" class="btn btn-primary">Back to Home</a>
    `);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});