import type { Request, Response } from '@ice/app';
import { readFileSync } from "fs";
import { join } from "path";
import multiparty from 'multiparty';


export default {
  'POST /mock-api-files/files': (request: Request, response: Response) => {
    const form = new multiparty.Form();
    form.parse(request, (err, fields, files) => {
      response.send(fields.key.map(item => item.split('.')[1]).join(','));
    });
  },
  'GET /mock-api-files/files/:fileId': (request: Request, response: Response) => {
    const { fileId } = request.params;
    response.send({
      id: fileId,
      name: `${Math.floor(Math.floor(Math.random() * 100000) + Date.now()).toString(16)}.${fileId}`,
      size: 5000,
      createdAt: new Date()
    });
  },
  'GET /mock-api-files/files/:fileId/raw': (request: Request, response: Response) => {
    const { fileId } = request.params;
    const file = readFileSync(join(process.cwd(), 'mock', 'files', `test.${fileId}`));
    response.send(file);
  },
  'DELETE /mock-api-files/files/:fileId': (request: Request, response: Response) => {
    response.send("");
  },
}
