import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import {
    addArticle
} from "../../../controllers/ArticleController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.post(addArticle);

const handler = router.handler({
  onError: onError,
});

export default handler;
