import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const newMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name,
      email,
      topic: topic || 'Genel İletişim',
      message,
      date: new Date().toISOString(),
      read: false
    };

    // Supabase ortam değişkenleri mevcutsa veritabanına ekle
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://igytzanekayiyybvmqga.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseKey.includes('your-supabase-anon-key')) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('inbox_messages').insert({
          name: newMessage.name,
          email: newMessage.email,
          topic: newMessage.topic,
          message: newMessage.message,
          date: newMessage.date,
          read: false
        });
      } catch (dbErr) {
        console.warn('Supabase contact save warning:', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
