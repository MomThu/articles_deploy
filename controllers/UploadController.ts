import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { get, toNumber } from "lodash";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import {IncomingForm} from "formidable";
import axios from "axios";
import FormData from "form-data";


const uploadFile = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
  
      form.parse(req, (err, fields, files) => {
        if (err) reject({ err })
        resolve({ err, fields, files })
      }) 
    })
    const form = new FormData();
    var fs = require("fs");
    form.append('file', fs.createReadStream(data['files'].file[0].filepath))
    const session = await getServerSession(req, res, authOptions);
    const {id, role} = session?.user;
    if (id && role === 1) {
      try {
        const result = await axios.post("https://localhost:8000/api/pdf", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        //Data ở đây bây giờ là Key, nó chính là file_name của PDF nhớ, ko dùng trường Location hay url nữa đâu.
        if (result && result['error']) {
          res.status(401).json({ 
            error: true,
            message: get(result, "message", ""),
          });
        } else {
          res.status(200).json({ 
            error: false,
            data: get(result, "data", ""),
            message: get(result, "message", ""),
          });
        }
      } catch (err) {
        res.status(500).json({ 
          error: true,
          message: "Upload Failed!",
        });
      }
      
      
    } else {
      res.status(401).json({
        error: false,
        message: "You are not authorized!",
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { uploadFile };
