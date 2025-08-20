import express, { Request, Response } from "express";
import bodyParser from "body-parser";

interface baseAlien {
    atk: number;
    hp: number;
}

interface DetailedAlien {
    base_alien: baseAlien;
    first_name: string;
    id: string;
    last_name: string;
    profile_url: string;
    spd: number;
    type: string;
}


let aliens: DetailedAlien[] = [];

const app = express();
app.use(bodyParser.json());

app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({ status: "Alive" });
});

// Add aliens
app.post("/api/aliens", (req: Request, res: Response) => {
    const incomingAliens = req.body;
    // Filter out duplicates based on id
    const newAliens: DetailedAlien[] = (incomingAliens as DetailedAlien[]).filter((newAlien: DetailedAlien) =>
        !aliens.some(alien =>
            alien.id === newAlien.id
        )
    ).map((newAlien: DetailedAlien) => ({
        ...newAlien
    }));
    aliens.push(...newAliens);
    res.status(201).json(newAliens);
});

// Get aliens
app.get("/api/aliens", (req: Request, res: Response) => {
    let result = aliens;

    const { spd_lte, spd_gte, atk_lte, atk_gte, hp_lte, hp_gte, type } = req.query;

    if (spd_lte) result = result.filter(a => a.spd <= Number(spd_lte));
    if (spd_gte) result = result.filter(a => a.spd >= Number(spd_gte));
    if (atk_lte) result = result.filter(a => a.base_alien.atk <= Number(atk_lte));
    if (atk_gte) result = result.filter(a => a.base_alien.atk >= Number(atk_gte));
    if (hp_lte) result = result.filter(a => a.base_alien.hp <= Number(hp_lte));
    if (hp_gte) result = result.filter(a => a.base_alien.hp >= Number(hp_gte));
    if (type) result = result.filter(a => a.type === type);

    res.json(result);
});

// Delete aliens
app.delete("/api/aliens", (req: Request, res: Response) => {
    aliens = [];
    res.status(200).json({ message: "Success" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// // Get alien by ID
// app.get("/api/aliens/:id", (req: Request, res: Response) => {
//     const { id } = req.params;
//     const alien = aliens.find(a => a.id === id);
//     if (!alien) {
//         return res.status(404).json({ message: "Alien not found" });
//     }
//     res.status(200).json(alien);
// });


// // Modify aliens
// app.patch("/api/aliens/:id", (req: Request, res: Response) => {
//     const { id } = req.params;
//     const updateFields = req.body;

//     const alienIndex = aliens.findIndex(a => a.id === id);
//     if (alienIndex === -1) {
//         return res.status(404).json({ message: "Alien not found" });
//     }

//     // Only update provided fields
//     const existingAlien = aliens[alienIndex];
//     aliens[alienIndex] = {
//         ...existingAlien,
//         ...updateFields,
//         base_alien: {
//             ...(existingAlien?.base_alien ?? { atk: 0, hp: 0 }),
//             ...(updateFields.base_alien || {})
//         }
//     };

//     res.status(200).json(aliens[alienIndex]);
// });