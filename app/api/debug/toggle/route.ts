import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json()

    // Path to .env.local
    const envPath = join(process.cwd(), '.env.local')

    try {
      // Read current .env.local
      let envContent = await readFile(envPath, 'utf-8')

      // Update or add NEXT_PUBLIC_DEBUG_MODE
      const debugModeRegex = /NEXT_PUBLIC_DEBUG_MODE=.*/
      const newValue = `NEXT_PUBLIC_DEBUG_MODE=${enabled ? 'true' : 'false'}`

      if (debugModeRegex.test(envContent)) {
        // Update existing line
        envContent = envContent.replace(debugModeRegex, newValue)
      } else {
        // Add new line
        envContent += `\n${newValue}\n`
      }

      // Write back to .env.local
      await writeFile(envPath, envContent, 'utf-8')

      return NextResponse.json({
        success: true,
        message: `Debug mode ${enabled ? 'enabled' : 'disabled'}`,
        debugMode: enabled,
      })
    } catch (fileError) {
      // If .env.local doesn't exist, create it
      const content = `NEXT_PUBLIC_DEBUG_MODE=${enabled ? 'true' : 'false'}\n`
      await writeFile(envPath, content, 'utf-8')

      return NextResponse.json({
        success: true,
        message: `Debug mode ${enabled ? 'enabled' : 'disabled'} (.env.local created)`,
        debugMode: enabled,
      })
    }
  } catch (error: any) {
    console.error('Debug toggle error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle debug mode. Please update .env.local manually.',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const envPath = join(process.cwd(), '.env.local')
    const envContent = await readFile(envPath, 'utf-8')

    const match = envContent.match(/NEXT_PUBLIC_DEBUG_MODE=(.*)/)
    const isDebugMode = match ? match[1].trim() === 'true' : false

    return NextResponse.json({
      debugMode: isDebugMode,
    })
  } catch (error) {
    // If .env.local doesn't exist, default to false
    return NextResponse.json({
      debugMode: false,
    })
  }
}
