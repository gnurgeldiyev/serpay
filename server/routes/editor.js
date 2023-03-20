const router = require("express").Router();
const editorController = require("../controllers/editor");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * GET requests
 */
router.get("/", editorController.getAll);
router.get("/:id", editorController.getOne);

/**
 * POST requests
 */
router.post("/", authMiddleware, editorController.add);
router.post("/login", editorController.login);

/**
 * PUT requests
 */
router.put("/:id", authMiddleware, editorController.update);
router.put("/:id/deactivate", authMiddleware, editorController.deactivate);
router.put("/:id/reset", authMiddleware, editorController.resetPassword);
router.put("/:id/logout", editorController.logout);

/**
 * DELETE requests
 */

module.exports = router;
