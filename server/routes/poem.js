const router = require("express").Router();
const poemController = require("../controllers/poem");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * GET requests
 */
router.get("/", poemController.getAll);
router.get("/:id", poemController.getOne);

/**
 * POST requests
 */
router.post("/", authMiddleware, poemController.add);

/**
 * PUT requests
 */
router.put("/:id", authMiddleware, poemController.update);
router.put("/:id/approve", authMiddleware, poemController.approve);

/**
 * DELETE requests
 */
router.delete("/:id", authMiddleware, poemController.delete);

module.exports = router;
