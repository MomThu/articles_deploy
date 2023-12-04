import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import onError from "../../../middleware/errors";
import { getBoughtArticle } from "../../../controllers/ArticleController";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getBoughtArticle);

const handler = router.handler({
  onError: onError,
});

export default handler;
