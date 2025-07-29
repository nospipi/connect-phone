export async function GET() {
  try {
    return Response.json({
      message: "Ok",
    })
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred"
    console.error(message)
    return Response.json({ error: message }, { status: 400 })
  }
}
