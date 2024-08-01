const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt:', username, password);

        db.query('SELECT * FROM user WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.log('Database query error:', error);
                return res.render('login', {
                    message: 'An error occurred'
                });
            }

            if (results.length === 0) {
                console.log('User not found:', username);
                return res.render('login', {
                    message: 'Invalid username or password'
                });
            }

            const user = results[0];
            console.log('User found:', user);
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match result:', isMatch);

            if (!isMatch) {
                return res.render('login', {
                    message: 'Invalid username or password'
                });
            }

            // Generate JWT
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            console.log('Token:', token);

            // Optionally, send the token as a cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 // 1 hour
            });

            res.send('Login successful');
        });
    } catch (err) {
        console.log('Error during login:', err);
        return res.render('login', {
            message: 'An error occurred'
        });
    }
};
