import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { updateArticlePermission } from "../../../controllers/ArticleController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.patch(updateArticlePermission);

const handler = router.handler({
  onError: onError,
});

export default handler;
