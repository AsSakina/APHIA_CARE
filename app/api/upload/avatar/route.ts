import { put, del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP." },
        { status: 400 },
      )
    }

    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: "Le fichier est trop volumineux. Maximum 1MB." }, { status: 400 })
    }

    // Delete old avatar if exists
    if (user.avatar_url) {
      try {
        await del(user.avatar_url)
      } catch {
        // Ignore delete errors for old avatar
      }
    }

    // Upload to Vercel Blob
    const filename = `avatars/${user.id}-${Date.now()}.${file.type.split("/")[1]}`
    const blob = await put(filename, file, {
      access: "public",
    })

    // Update user avatar_url in database
    await sql`
      UPDATE users SET avatar_url = ${blob.url}, updated_at = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Erreur lors du téléchargement" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (user.avatar_url) {
      try {
        await del(user.avatar_url)
      } catch {
        // Ignore delete errors
      }

      // Remove avatar_url from database
      await sql`
        UPDATE users SET avatar_url = NULL, updated_at = NOW()
        WHERE id = ${user.id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Avatar delete error:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
