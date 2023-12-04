import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { addAuthor } from "../../../controllers/AuthorController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.post(addAuthor);

const handler = router.handler({
  onError: onError,
});

export default handler;
