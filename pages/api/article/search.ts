import { createRouter } from "next-connect";
import onError from "../../../middleware/errors";
import {
  searchArticle,
} from "../../../controllers/ArticleController";
import { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(searchArticle);

const handler = router.handler({
  onError: onError,
});

export default handler;
