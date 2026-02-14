const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const issueRoutes = require("./routes/issue.routes");
const timelineRoutes = require("./routes/timeline.routes");

const app = express();

// app.use(cors());
app.use(cors({
  origin: "https://civicbridge.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/issues", issueRoutes);
app.use("/timeline", timelineRoutes);


app.get("/", (req, res) => {
  res.send("CivicBridge Backend Running 🚀");
});

module.exports = app;
