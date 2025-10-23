import express from "express";
import pool from "../db.js";
import authorize from "../middleware/authorize.js";
const router = express.Router();
// GET /todos → Alle Todos des Benutzers abrufen
router.get("/", authorize, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const result = await pool.query("SELECT * FROM todo WHERE user_id=$1 ORDER BY todo_id ASC", [userId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("❌ Fehler in GET /todos:", err);
        res.status(500).json({ error: err.message });
    }
});
// POST /todos → Neues Todo erstellen
router.post("/", authorize, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }
        const result = await pool.query("INSERT INTO todo (description, completed, user_id) VALUES ($1, false, $2) RETURNING *", [description, req.user.user_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error("❌ Fehler in POST /todos:", err);
        res.status(500).json({ error: err.message });
    }
});
// PUT /todos/:id → Todo aktualisieren
router.put("/:id", authorize, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { description, completed } = req.body;
        if (description === undefined && completed === undefined) {
            return res
                .status(400)
                .json({ error: "At least one field is required" });
        }
        const result = await pool.query(`UPDATE todo
       SET description = COALESCE($1, description),
           completed = COALESCE($2, completed)
       WHERE todo_id = $3 AND user_id = $4
       RETURNING *`, [description, completed, id, req.user.user_id]);
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Todo not found or unauthorized" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error("❌ Fehler in PUT /todos/:id:", err);
        res.status(500).json({ error: err.message });
    }
});
// DELETE /todos/:id → Todo löschen
router.delete("/:id", authorize, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query("DELETE FROM todo WHERE todo_id=$1 AND user_id=$2 RETURNING *", [id, req.user.user_id]);
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Todo not found or unauthorized" });
        }
        res.status(200).json({ message: "Todo deleted" });
    }
    catch (err) {
        console.error("❌ Fehler in DELETE /todos/:id:", err);
        res.status(500).json({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=todos.js.map