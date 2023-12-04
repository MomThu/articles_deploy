import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getAllAuthors } from "../../../controllers/AuthorController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getAllAuthors);

const handler = router.handler({
  onError: onError,
});

export default handler;
