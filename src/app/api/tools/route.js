// app/api/tools/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/toolModel';

export async function GET(request) {
  await dbConnect();
  
  const tools = await Tool.find({});  // Fetch all tools regardless of ownerId
  return NextResponse.json({ tools });
}

export async function PATCH(request) {
    await dbConnect();
  
    const body = await request.json();
    const { ownerId, status } = body;
  
    if (!ownerId || !status) {
      return NextResponse.json({ error: 'toolId and status required' }, { status: 400 });
    }
  
    const updatedTool = await Tool.findByIdAndUpdate(
      ownerId,
      { status },
      { new: true }
    );
  
    if (!updatedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
  
    return NextResponse.json({ status: updatedTool.status });
  }
  