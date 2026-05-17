import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db/setup.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';
import { authenticate } from '../middleware/auth.js';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /api/photos/upload
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { facility_id, task_id, feedback_id, lat, lng, note } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let finalUrl = `/uploads/${file.filename}`;

    // 1. Primary: Supabase Storage
    if (isSupabaseConfigured()) {
      try {
        const fileBuffer = await fs.readFile(file.path);
        const bucketName = feedback_id ? 'feedback-attachments' : (task_id ? 'maintenance-proof' : 'facility-photos');
        const fileName = `${Date.now()}-${file.filename}`;

        const { data, error: storageErr } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (storageErr) throw storageErr;

        if (data) {
          const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);
          finalUrl = publicUrl;
          console.log(`✅ [Supabase] Photo uploaded to cloud: ${finalUrl}`);
        }
      } catch (err) {
        console.error('❌ [Supabase] Storage upload failed, keeping local reference:', err);
      }
    }

    // 2. SQL Log
    const info = db.prepare(`
      INSERT INTO photos (facility_id, task_id, feedback_id, url, lat, lng, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      facility_id || null,
      task_id || null,
      feedback_id || null,
      finalUrl,
      lat || null,
      lng || null,
      note || '',
      new Date().toISOString()
    );

    // 3. Supabase DB Sync
    if (isSupabaseConfigured()) {
      await supabase.from('photos').insert({
        facility_id: facility_id || null,
        task_id: task_id || null,
        feedback_id: feedback_id || null,
        url: finalUrl,
        lat: lat || null,
        lng: lng || null,
        note: note || ''
      });
    }

    res.status(201).json({
      id: info.lastInsertRowid,
      url: finalUrl,
      message: 'Photo uploaded successfully'
    });
  } catch (err: any) {
    console.error('Photo Upload Error:', err);
    res.status(500).json({ error: 'Failed to upload photo', message: err.message });
  }
});

// GET /api/photos/facility/:id
router.get('/facility/:id', (req, res) => {
  try {
    const photos = db.prepare('SELECT * FROM photos WHERE facility_id = ? ORDER BY created_at DESC').all(req.params.id);
    res.json(photos);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

export default router;
