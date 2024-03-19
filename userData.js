const express = require("express");
const router = express.Router();
const db = require("./database");

// Get all users
router.get("/", (req, res) => {
    db.all("SELECT * FROM users", (err, result) => {
        if (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json(result);
    });
});

// Get a specific user by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error fetching user:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(row);
    });
});

// Create a new user
router.post("/", (req, res) => {
    const { username, email } = req.body;
    db.run("INSERT INTO users (username, email) VALUES (?, ?)", [username, email], function(err) {
        if (err) {
            console.error("Error creating user:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Update a user by ID
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    db.run("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, id], function(err) {
        if (err) {
            console.error("Error updating user:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "User updated successfully" });
    });
});

// Delete a user by ID
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
        if (err) {
            console.error("Error deleting user:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
