import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discordRouter from "./discord";
import gddlRouter from "./gddl";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discordRouter);
router.use(gddlRouter);

export default router;
