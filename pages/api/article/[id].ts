import { createRouter, expressWrapper } from "next-connect";
import onError from "../../../middleware/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { getArticleById } from "../../../controllers/ArticleController";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getArticleById);

const handler = router.handler({
  onError: onError,
});

export default handler;
