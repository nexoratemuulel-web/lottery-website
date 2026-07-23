const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

// JSON болон Form мэдээлэл унших
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static файлууд
app.use(express.static(__dirname));

// ======================================
// Нүүр хуудас
// ======================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ======================================
// Админ хуудас
// ======================================
app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(__dirname, "login.html")
    );

});

// ======================================
// Админ самбар
// ======================================
app.get("/admin/panel", (req, res) => {

    res.sendFile(
        path.join(__dirname, "admin.html")
    );

});

// ======================================
// Машин хадгалах
// ======================================
app.post("/api/cars", (req, res) => {

    const { name, model, image, description } = req.body;

    db.run(
        `INSERT INTO cars(name, model, image, description)
         VALUES(?,?,?,?)`,
        [name, model, image, description],
        function (err) {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Алдаа гарлаа!"
                });
            }

            res.json({
                success: true,
                message: "Машин амжилттай хадгалагдлаа."
            });

        }
    );

});

// ======================================
// Бүх машин
// ======================================
app.get("/api/cars", (req, res) => {

    db.all(
        "SELECT * FROM cars ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false
                });
            }

            res.json(rows);

        }
    );

});

// ======================================
// Машин засах
// ======================================
app.put("/api/cars/:id", (req, res) => {

    const id = req.params.id;
    const { name, model, image, description } = req.body;

    db.run(
        `UPDATE cars
         SET name=?, model=?, image=?, description=?
         WHERE id=?`,
        [name, model, image, description, id],
        function (err) {

            if (err) {
                console.error(err);

                return res.json({
                    success: false,
                    message: "Засаж чадсангүй."
                });
            }

            res.json({
                success: true,
                message: "Машин амжилттай засагдлаа."
            });

        }
    );

});

// ======================================
// Машин устгах
// ======================================
app.delete("/api/cars/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM cars WHERE id=?",
        [id],
        function (err) {

            if (err) {
                console.error(err);

                return res.json({
                    success: false,
                    message: "Устгаж чадсангүй."
                });
            }

            res.json({
                success: true,
                message: "Машин устгагдлаа."
            });

        }
    );

});

// ======================================
// Оролцогч бүртгэх
// ======================================
app.post("/api/participants", (req, res) => {

    const { phone, car_id } = req.body;

    db.run(
        `INSERT INTO participants(phone, car_id)
         VALUES(?, ?)`,
        [phone, car_id],
        function (err) {

            if (err) {
                console.error(err);

                return res.json({
                    success: false,
                    message: "Бүртгэх боломжгүй."
                });
            }

            res.json({
                success: true,
                message: "Оролцогч амжилттай бүртгэгдлээ."
            });

        }
    );

});

// ======================================
// Утас шалгах
// ======================================
app.get("/api/check/:phone", (req, res) => {

    const phone = req.params.phone;

    db.get(
        `
        SELECT
            participants.phone,
            cars.name,
            cars.model,
            cars.image,
            cars.description
        FROM participants
        JOIN cars
        ON participants.car_id = cars.id
        WHERE participants.phone = ?
        `,
        [phone],
        (err, row) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Алдаа гарлаа."
                });
            }

            if (!row) {
                return res.json({
                    success: false,
                    message: "Бүртгэл олдсонгүй."
                });
            }

            res.json({
                success: true,
                data: row
            });

        }
    );

});

// ======================================
// Бүх оролцогчдын жагсаалт
// ======================================
app.get("/api/participants", (req, res) => {

    db.all(
        `
        SELECT
            participants.id,
            participants.phone,
            cars.name,
            cars.model
        FROM participants
        JOIN cars
        ON participants.car_id = cars.id
        ORDER BY participants.id DESC
        `,
        [],
        (err, rows) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Алдаа гарлаа."
                });
            }

            res.json(rows);

        }
    );

});
// ======================================
// Оролцогч устгах
// ======================================

app.delete("/api/participants/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM participants WHERE id=?",
        [id],
        function (err) {

            if (err) {
                return res.json({
                    success: false,
                    message: "Устгаж чадсангүй."
                });
            }

            res.json({
                success: true,
                message: "Оролцогч устгагдлаа."
            });

        }
    );

});
// ======================================
// Server
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("==================================");
    console.log("Database connected.");
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("==================================");

});