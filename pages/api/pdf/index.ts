import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getPdfByArticle } from "../../../controllers/PdfController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getPdfByArticle);

const handler = router.handler({
  onError: onError,
});

export default handler;
