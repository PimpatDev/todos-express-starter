var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');

var router = express.Router();

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.query(
        'SELECT * FROM users WHERE username = ?', [username, password], (err, results) => {
            if (err) { return cb(err); }
            if (results.length === 0) { return cb(null, false, { message: 'Incorrect username or password' }) }
            var user = results[0];
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                if (err) { return cb(err); }
                if (!crypto.timingSafeEqual(Buffer.from(user.hashed_password, 'hex'), hashedPassword)) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
                return cb(null, user);
            });
        });
    }));

            passport.serializeUser(function (user, cb) {
                process.nextTick(function () {
                    cb(null, { id: user.id, username: user.username });
                });
            });

            passport.deserializeUser(function (user, cb) {
                process.nextTick(function () {
                    return cb(null, user);
                });
            });
            router.get('/login', function (req, res, next) {
                res.render('login');
            });

            router.post('/login/password', passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login'
            }));

            router.post('/logout', function (req, res, next) {
                req.logout(function (err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            });

            router.get('/signup', function (req, res, next) {
                res.render('signup');
            });

            router.post('/signup', function (req, res, next) {
                var salt = crypto.randomBytes(16);
                crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                    if (err) { return next(err); }
                    db.query('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
                        req.body.username,
                        hashedPassword,
                        salt
                    ], function (err) {
                        if (err) { return next(err); }
                        var user = {
                            id: this.lastID,
                            username: req.body.username
                        };
                        req.login(user, function (err) {
                            if (err) { return next(err); }
                            res.redirect('/');
                        });
                    });
                });
            });
            module.exports = router;