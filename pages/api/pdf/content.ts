import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getPdfContentByName } from "../../../controllers/PdfController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getPdfContentByName);

const handler = router.handler({
  onError: onError,
});

export default handler;