import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import onError from "../../../middleware/errors";
import { uploadFile } from "../../../controllers/UploadController";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.post(uploadFile);

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = router.handler({
  onError: onError, 
});
 
export default handler;
