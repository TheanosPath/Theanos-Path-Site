const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware to handle static files and form data
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve index.html when they go to the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ THIS IS THE SERVER LOGIC TO HANDLE FORM SUBMISSIONS
app.post("/submit", (req, res) => {
  const { name, email } = req.body;
  const newEntry = {
    id: Date.now(),
    name,
    email,
    date: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, "submissions.json");
  let submissions = [];

  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    try {
      submissions = JSON.parse(rawData);
    } catch (err) {
      console.error("Error parsing submissions.json:", err);
    }
  }

  // Check for duplicate email
  const isDuplicate = submissions.some((entry) => entry.email === email);

  if (isDuplicate) {
    return res.redirect("/duplicate.html");
  }

  // If not duplicate, add and save
  submissions.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
  res.redirect("/thankyou.html");
});
