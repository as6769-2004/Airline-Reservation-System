import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function DELETE(_req, { params }) {
  const id = params.id;
  await query('DELETE FROM airport WHERE airport_id = ?', [id]);
  return NextResponse.json({ success: true });
}


