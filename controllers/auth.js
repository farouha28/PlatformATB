const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {
    try {
        const { username, password, confirmpassword } = req.body;
        if (password !== confirmpassword) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }
        db.query('SELECT username FROM user WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('register', {
                    message: 'An error occurred'
                });
            }

            if (results.length > 0) {
                return res.render('register', {
                    message: 'Username is in use'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO user SET ?', { username: username, password: hashedPassword }, (error, results) => {
                if (error) {
                    console.log(error);
                    return res.render('register', {
                        message: 'An error occurred while registering'
                    });
                } else {
                    return res.render('register', {
                        message: 'User registered successfully'
                    });
                }
            });
        });
    } catch (err) {
        console.log(err);
        return res.render('register', {
            message: 'An error occurred'
        });
    }
};

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

            // Store user in session
            req.session.user = user;

            const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;;
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) throw err;
                console.log('Stagiaires:', stagiaires);

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) throw err;
                    console.log('Encadrants:', encadrants);

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) throw err;
                        console.log('Chefs:', chefs);

                        res.render('dashboard', {
                            username: user.username,
                            stagiaires,
                            encadrants,
                            chefs
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.log('Error during login:', err);
        return res.render('login', {
            message: 'An error occurred'
        });
    }
};



exports.addStagiaire = (req, res) => {
    const { name, age, email, encadrant } = req.body;

    db.query('INSERT INTO stagiaire SET ?', { name, age, email, Encadrant: encadrant }, (error, results) => {
        if (error) {
            console.log(error);
            return res.render('dashboard', {
                message: 'An error occurred while adding the stagiaire',
                stagiaires: [],
                encadrants: [],
                chefs: []
            });
        } else {
            // Fetch the updated lists
            const stagiairesQuery = 'SELECT * FROM stagiaire';
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        message: 'An error occurred while fetching stagiaires',
                        stagiaires: [],
                        encadrants: [],
                        chefs: []
                    });
                }

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching encadrants',
                            stagiaires,
                            encadrants: [],
                            chefs: []
                        });
                    }

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                message: 'An error occurred while fetching chefs',
                                stagiaires,
                                encadrants,
                                chefs: []
                            });
                        }

                        res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants,
                            chefs,
                            message: 'Stagiaire added successfully'
                        });
                    });
                });
            });
        }
    });
};

exports.addEncadrant = async (req, res) => {
    try {
        const { name, age, email, departement, numtel } = req.body;

        db.query('INSERT INTO encadrant SET ?', { name, age, email, departement, numtel }, (error, results) => {
            if (error) {
                console.log(error);
                return res.render('dashboard', {
                    message: 'An error occurred while adding encadrant',
                    stagiaires: [],
                    encadrants: [],
                    chefs: []
                });
            } else {
                // Fetch the updated lists
                const stagiairesQuery = 'SELECT * FROM stagiaire';
                const encadrantsQuery = 'SELECT * FROM encadrant';
                const chefsQuery = 'SELECT * FROM chef_departement';

                db.query(stagiairesQuery, (err, stagiaires) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching stagiaires',
                            stagiaires: [],
                            encadrants: [],
                            chefs: []
                        });
                    }

                    db.query(encadrantsQuery, (err, encadrants) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                message: 'An error occurred while fetching encadrants',
                                stagiaires,
                                encadrants: [],
                                chefs: []
                            });
                        }

                        db.query(chefsQuery, (err, chefs) => {
                            if (err) {
                                console.log(err);
                                return res.render('dashboard', {
                                    message: 'An error occurred while fetching chefs',
                                    stagiaires,
                                    encadrants,
                                    chefs: []
                                });
                            }

                            res.render('dashboard', {
                                username: req.session.user ? req.session.user.username : 'Guest',
                                stagiaires,
                                encadrants,
                                chefs,
                                message: 'Encadrant added successfully'
                            });
                        });
                    });
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res.render('dashboard', {
            message: 'An error occurred',
            stagiaires: [],
            encadrants: [],
            chefs: []
        });
    }
};
exports.addChef = async (req, res) => {
    try {
        const { name, age, department, email, numtel } = req.body;

        db.query('INSERT INTO chef_departement SET ?', { name, age, department, email, numtel }, (error, results) => {
            if (error) {
                console.log(error);
                return res.render('dashboard', {
                    message: 'An error occurred while adding Chef de Département',
                    stagiaires: [],
                    encadrants: [],
                    chefs: []
                });
            } else {
                // Fetch the updated lists
                const stagiairesQuery = 'SELECT * FROM stagiaire';
                const encadrantsQuery = 'SELECT * FROM encadrant';
                const chefsQuery = 'SELECT * FROM chef_departement';

                db.query(stagiairesQuery, (err, stagiaires) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching stagiaires',
                            stagiaires: [],
                            encadrants: [],
                            chefs: []
                        });
                    }

                    db.query(encadrantsQuery, (err, encadrants) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                message: 'An error occurred while fetching encadrants',
                                stagiaires,
                                encadrants: [],
                                chefs: []
                            });
                        }

                        db.query(chefsQuery, (err, chefs) => {
                            if (err) {
                                console.log(err);
                                return res.render('dashboard', {
                                    message: 'An error occurred while fetching chefs',
                                    stagiaires,
                                    encadrants,
                                    chefs: []
                                });
                            }

                            res.render('dashboard', {
                                username: req.session.user ? req.session.user.username : 'Guest',
                                stagiaires,
                                encadrants,
                                chefs,
                                message: 'Chef de Département added successfully'
                            });
                        });
                    });
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res.render('dashboard', {
            message: 'An error occurred',
            stagiaires: [],
            encadrants: [],
            chefs: []
        });
    }
};



exports.dashboard = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;

    const encadrantsQuery = 'SELECT * FROM encadrant';
    const chefsQuery = 'SELECT * FROM chef_de_departement';

    db.query(stagiairesQuery, (err, stagiaires) => {
        if (err) {
            console.log(err);
            return res.render('dashboard', {
                message: 'An error occurred while fetching stagiaires',
                stagiaires: [],
                encadrants: [],
                chefs: [],
                username: req.session.user ? req.session.user.username : 'Guest'
            });
        }

        // Log stagiaires for debugging
        console.log('Stagiaires:', stagiaires);

        db.query(encadrantsQuery, (err, encadrants) => {
            if (err) {
                console.log(err);
                return res.render('dashboard', {
                    message: 'An error occurred while fetching encadrants',
                    stagiaires,
                    encadrants: [],
                    chefs: [],
                    username: req.session.user ? req.session.user.username : 'Guest'
                });
            }

            db.query(chefsQuery, (err, chefs) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        message: 'An error occurred while fetching chefs',
                        stagiaires,
                        encadrants,
                        chefs: [],
                        username: req.session.user ? req.session.user.username : 'Guest'
                    });
                }

                res.render('dashboard', {
                    username: req.session.user.username,
                    stagiaires,
                    encadrants,
                    chefs
                });
            });
        });
    });
};



exports.modifyStagiaire = (req, res) => {
    const stagiaireId = req.params.id;
    const { name, age, email, encadrant } = req.body; // `encadrant` should capture the ID

    const updateQuery = 'UPDATE stagiaire SET name = ?, age = ?, email = ?, Encadrant = ? WHERE id = ?';
    const values = [name, age, email, encadrant, stagiaireId];

    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('An error occurred while updating the stagiaire.');
        }

        // Queries for fetching updated lists
        const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
        const encadrantsQuery = 'SELECT * FROM encadrant';
        const chefsQuery = 'SELECT * FROM chef_departement';

        db.query(stagiairesQuery, (err, stagiaires) => {
            if (err) {
                console.log(err);
                return res.render('dashboard', {
                    message: 'An error occurred while fetching stagiaires',
                    stagiaires: [],
                    encadrants: [],
                    chefs: [],
                    username: req.session.user ? req.session.user.username : 'Guest'
                });
            }

            db.query(encadrantsQuery, (err, encadrants) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        message: 'An error occurred while fetching encadrants',
                        stagiaires,
                        encadrants: [],
                        chefs: [],
                        username: req.session.user ? req.session.user.username : 'Guest'
                    });
                }

                db.query(chefsQuery, (err, chefs) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching chefs',
                            stagiaires,
                            encadrants,
                            chefs: [],
                            username: req.session.user ? req.session.user.username : 'Guest'
                        });
                    }

                    res.render('dashboard', {
                        username: req.session.user ? req.session.user.username : 'Guest',
                        stagiaires,
                        encadrants,
                        chefs,
                        message: 'Stagiaire updated successfully'
                    });
                });
            });
        });
    });
};




exports.modifyStagiaireForm = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM stagiaire WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('modify-stagiaire', {
                message: 'An error occurred',
                stagiaire: null
            });
        }
        if (results.length === 0) {
            return res.render('modify-stagiaire', {
                message: 'Stagiaire not found',
                stagiaire: null
            });
        }
        
        // Assuming 'Encadrant' is fetched from the database query results
        const stagiaire = results[0];

        return res.render('modify-stagiaire', {
            message: '',
            stagiaire: {
                id: stagiaire.id,
                name: stagiaire.name,
                age: stagiaire.age,
                Encadrant: stagiaire.Encadrant, // Make sure this matches your database column name
                email: stagiaire.email
            }
        });
    });
};





exports.fetchDashboardData = (req, res, next) => {
    const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
    const encadrantsQuery = 'SELECT * FROM encadrant';
    const chefsQuery = 'SELECT * FROM chef_departement';

    db.query(stagiairesQuery, (err, stagiaires) => {
        if (err) return next(err);

        db.query(encadrantsQuery, (err, encadrants) => {
            if (err) return next(err);

            db.query(chefsQuery, (err, chefs) => {
                if (err) return next(err);

                req.dashboardData = {
                    stagiaires,
                    encadrants,
                    chefs
                };
                next();
            });
        });
    });
};



exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        } else {
            res.redirect('/login');
        }
    });
};


exports.deleteStagiaire = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM stagiaire WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('dashboard', {
                message: 'An error occurred while deleting the stagiaire',
                stagiaires: [],
                encadrants: [],
                chefs: []
            });
        } else {
            // Fetch the updated lists
            const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        message: 'An error occurred while fetching stagiaires',
                        stagiaires: [],
                        encadrants: [],
                        chefs: []
                    });
                }

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching encadrants',
                            stagiaires,
                            encadrants: [],
                            chefs: []
                        });
                    }

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                message: 'An error occurred while fetching chefs',
                                stagiaires,
                                encadrants,
                                chefs: []
                            });
                        }

                        // Render dashboard with fetched data
                        res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants,
                            chefs,
                            message: 'Stagiaire deleted successfully'
                        });
                    });
                });
            });
        }
    });
};


exports.modifyEncadrant = (req, res) => {
    const { id } = req.params;
    const { name, age, departement, email, numtel } = req.body;

    db.query('UPDATE encadrant SET ? WHERE id = ?', [{ name, age, departement, email, numtel }, id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('modify-encadrant', {
                message: 'An error occurred while updating the encadrant',
                encadrant: { id, name, age, departement, email, numtel }
            });
        } else {
            // Fetch the updated lists
            const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        username: req.session.user ? req.session.user.username : 'Guest',
                        stagiaires: [],
                        encadrants: [],
                        chefs: [],
                        message: 'An error occurred while fetching stagiaires'
                    });
                }

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants: [],
                            chefs: [],
                            message: 'An error occurred while fetching encadrants'
                        });
                    }

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                username: req.session.user ? req.session.user.username : 'Guest',
                                stagiaires,
                                encadrants,
                                chefs: [],
                                message: 'An error occurred while fetching chefs'
                            });
                        }

                        res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants,
                            chefs,
                            message: 'Encadrant updated successfully'
                        });
                    });
                });
            });
        }
    });
};



exports.modifyEncadrantForm = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM encadrant WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('modify-encadrant', {
                message: 'An error occurred',
                encadrant: null
            });
        }
        if (results.length === 0) {
            return res.render('modify-encadrant', {
                message: 'Encadrant not found',
                encadrant: null
            });
        }
        return res.render('modify-encadrant', {
            message: '',
            encadrant: results[0]
        });
    });
};


exports.deleteEncadrant = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM encadrant WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('dashboard', {
                message: 'An error occurred while deleting the encadrant',
                stagiaires: [],
                encadrants: [],
                chefs: [],
                username: req.session.user ? req.session.user.username : 'Guest'
            });
        } else {
            // Fetch the updated lists
            const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        message: 'An error occurred while fetching stagiaires',
                        stagiaires: [],
                        encadrants: [],
                        chefs: [],
                        username: req.session.user ? req.session.user.username : 'Guest'
                    });
                }

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching encadrants',
                            stagiaires,
                            encadrants: [],
                            chefs: [],
                            username: req.session.user ? req.session.user.username : 'Guest'
                        });
                    }

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                message: 'An error occurred while fetching chefs',
                                stagiaires,
                                encadrants,
                                chefs: [],
                                username: req.session.user ? req.session.user.username : 'Guest'
                            });
                        }

                        // Render dashboard with fetched data
                        res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants,
                            chefs,
                            message: 'Encadrant deleted successfully'
                        });
                    });
                });
            });
        }
    });
};


exports.modifyChefForm = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM chef_departement WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('modify-chef', {
                message: 'An error occurred',
                chef: null
            });
        }
        if (results.length === 0) {
            return res.render('modify-chef', {
                message: 'Chef de Département not found',
                chef: null
            });
        }
        return res.render('modify-chef', {
            message: '',
            chef: results[0]
        });
    });
};

exports.modifyChef = (req, res) => {
    const { id } = req.params;
    const { name, age, department, email, numtel } = req.body;

    db.query('UPDATE chef_departement SET ? WHERE id = ?', [{ name, age, department, email, numtel }, id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('modify-chef', {
                message: 'An error occurred while updating the chef',
                chef: { id, name, age, department, email, numtel }
            });
        } else {
            // Fetch the updated lists
            const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        username: req.session.user ? req.session.user.username : 'Guest',
                        stagiaires: [],
                        encadrants: [],
                        chefs: [],
                        message: 'An error occurred while fetching stagiaires'
                    });
                }

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants: [],
                            chefs: [],
                            message: 'An error occurred while fetching encadrants'
                        });
                    }

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                username: req.session.user ? req.session.user.username : 'Guest',
                                stagiaires,
                                encadrants,
                                chefs: [],
                                message: 'An error occurred while fetching chefs'
                            });
                        }

                        res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants,
                            chefs,
                            message: 'Chef updated successfully'
                        });
                    });
                });
            });
        }
    });
};
exports.deleteChef = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM chef_departement WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('dashboard', {
                message: 'An error occurred while deleting the chef',
                stagiaires: [],
                encadrants: [],
                chefs: [],
                username: req.session.user ? req.session.user.username : 'Guest'
            });
        } else {
            // Fetch the updated lists
            const stagiairesQuery = `
        SELECT
            s.id,
            s.name,
            s.age,
            s.email,
            e.name AS encadrant_name
        FROM
            stagiaire s
        LEFT JOIN
            encadrant e ON s.encadrant = e.id`;
            const encadrantsQuery = 'SELECT * FROM encadrant';
            const chefsQuery = 'SELECT * FROM chef_departement';

            db.query(stagiairesQuery, (err, stagiaires) => {
                if (err) {
                    console.log(err);
                    return res.render('dashboard', {
                        message: 'An error occurred while fetching stagiaires',
                        stagiaires: [],
                        encadrants: [],
                        chefs: [],
                        username: req.session.user ? req.session.user.username : 'Guest'
                    });
                }

                db.query(encadrantsQuery, (err, encadrants) => {
                    if (err) {
                        console.log(err);
                        return res.render('dashboard', {
                            message: 'An error occurred while fetching encadrants',
                            stagiaires,
                            encadrants: [],
                            chefs: [],
                            username: req.session.user ? req.session.user.username : 'Guest'
                        });
                    }

                    db.query(chefsQuery, (err, chefs) => {
                        if (err) {
                            console.log(err);
                            return res.render('dashboard', {
                                message: 'An error occurred while fetching chefs',
                                stagiaires,
                                encadrants,
                                chefs: [],
                                username: req.session.user ? req.session.user.username : 'Guest'
                            });
                        }

                        // Render dashboard with fetched data
                        res.render('dashboard', {
                            username: req.session.user ? req.session.user.username : 'Guest',
                            stagiaires,
                            encadrants,
                            chefs,
                            message: 'Chef deleted successfully'
                        });
                    });
                });
            });
        }
    });
};
exports.getAddStagiairePage = (req, res) => {
    db.query('SELECT * FROM encadrant', (err, encadrants) => {
        if (err) {
            console.log(err);
            return res.status(500).send('An error occurred while fetching encadrants.');
        }
        res.render('add-stagiaire', {
            encadrants
        });
    });
};



const nodemailer = require('nodemailer');

exports.sendEmailToEncadrant = (req, res) => {
    const { stagiaireId } = req.params;

    // Get the stagiaire and encadrant details from the database
    const query = `
        SELECT s.name AS stagiaireName, s.email AS stagiaireEmail, e.name AS encadrantName, e.email AS encadrantEmail
        FROM stagiaire s
        JOIN encadrant e ON s.encadrant = e.id
        WHERE s.id = ?
    `;

    db.query(query, [stagiaireId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('An error occurred while fetching stagiaire and encadrant details.');
        }

        if (results.length === 0) {
            return res.status(404).send('Stagiaire or encadrant not found.');
        }

        const { stagiaireName, stagiaireEmail, encadrantName, encadrantEmail } = results[0];

        // Create a transporter for sending the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'brahemraed@gmail.com',
                pass: 'xrvvnqxmpikopuvb'
            }
        });

        const mailOptions = {
            from: 'brahemraed@gmail.com',
            to: encadrantEmail,
            subject: `Information about Stagiaire ${stagiaireName}`,
            text: `Hello ${encadrantName},\n\nThis is an email regarding your stagiaire ${stagiaireName}.\n\nBest regards,\nATB Bank`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('An error occurred while sending the email.');
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect('/dashboard'); // Redirect to dashboard after sending the email
            }
        });
    });
};


// In auth.js
exports.getModifyStagiairePage = (req, res) => {
    const stagiaireId = req.params.id; // Assuming the ID is passed in the URL

    // Fetch the stagiaire details
    db.query('SELECT * FROM stagiaire WHERE id = ?', [stagiaireId], (err, stagiaireResults) => {
        if (err) {
            console.log(err);
            return res.status(500).send('An error occurred while fetching stagiaire details.');
        }

        if (stagiaireResults.length === 0) {
            return res.status(404).send('Stagiaire not found.');
        }

        const stagiaire = stagiaireResults[0];

        // Fetch the list of encadrants
        db.query('SELECT * FROM encadrant', (err, encadrants) => {
            if (err) {
                console.log(err);
                return res.status(500).send('An error occurred while fetching encadrants.');
            }

            res.render('modify-stagiaire', {
                stagiaire,
                encadrants
            });
        });
    });
};

// Other existing exports...
