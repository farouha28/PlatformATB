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

            const stagiairesQuery = 'SELECT * FROM stagiaire';
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
    const { name, age, email } = req.body;

    db.query('INSERT INTO stagiaire SET ?', { name, age, email }, (error, results) => {
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
    const { id } = req.params;
    const { name, age, Encadrant, email } = req.body;

    db.query('UPDATE stagiaire SET ? WHERE id = ?', [{ name, age, email, Encadrant }, id], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('modify-stagiaire', {
                message: 'An error occurred while updating the stagiaire',
                stagiaire: { id, name, age, email, Encadrant }
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
                            username: req.session.user.username,
                            stagiaires,
                            encadrants,
                            chefs
                        });
                    });
                });
            });
        }
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
    const stagiairesQuery = 'SELECT * FROM stagiaire';
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
            const stagiairesQuery = 'SELECT * FROM stagiaire';
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
            const stagiairesQuery = 'SELECT * FROM stagiaire';
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
