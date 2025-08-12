export async function GET() {
  console.log("GET request received at /api/sales-channels/create-new")
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
