const express = require("express");
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  verifyIssue,
  notSatisfiedIssue,
  upvoteIssue
} = require("../controllers/issue.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post("/", authMiddleware, createIssue);
router.get("/", authMiddleware, getAllIssues);
// Specific :id routes first (before generic GET /:id)
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("OFFICIAL"),
  updateIssueStatus
);
router.patch("/:id/verify", authMiddleware, verifyIssue);
router.patch("/:id/not-satisfied", authMiddleware, notSatisfiedIssue);
router.post("/:id/upvote", authMiddleware, upvoteIssue);
router.get("/:id", authMiddleware, getIssueById);

module.exports = router;
