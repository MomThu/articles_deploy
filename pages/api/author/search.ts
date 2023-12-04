import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { searchAuthor } from "../../../controllers/AuthorController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(searchAuthor);

const handler = router.handler({
  onError: onError,
});

export default handler;
