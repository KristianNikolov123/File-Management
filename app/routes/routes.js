import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import authentication from '../authentication/authentication.js';

const router = express.Router();

const NFS_PATH = process.env.NFS_PATH || '/mnt/nfs';

function getFilePath(fileName) {
  return path.join(NFS_PATH, fileName);
}

router.post('/upload', authentication, async (req, res) => {
  const { fileName, content } = req.body;

  if (!fileName || !content) {
    res.status(400).json({ error: 'Both fileName and content are required' });
    return;
  }

  const filePath = getFilePath(fileName);

  try {
    await fs.writeFile(filePath, content);
    res.status(201).json({ message: 'File uploaded successfully', fileName });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.get('/:fileId', authentication, async (req, res) => {
  const filePath = getFilePath(req.params.fileId);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    res.status(200).json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;