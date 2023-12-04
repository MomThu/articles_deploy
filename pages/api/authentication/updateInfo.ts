import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { updateInfo } from "../../../controllers/CustomerController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.patch(updateInfo);

const handler = router.handler({
  onError: onError,
});

export default handler;
