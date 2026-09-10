import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), 'public', 'assets');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, 'Hamza-Koybasi-CV.pdf');
    fs.writeFileSync(filePath, buffer);

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb >= 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: sizeStr,
      url: '/assets/Hamza-Koybasi-CV.pdf'
    });
  } catch (err: any) {
    console.error('CV Upload Error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
