import sql from "../db/db";

export async function POST() {
  try {
    await sql`SELECT 1`;
    console.log("Database connected successfully (POST /api/routes)");
    return new Response(JSON.stringify({ success: true, message: "Database connected successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Database connection failed (POST /api/routes):", err);
    return new Response(JSON.stringify({ success: false, message: "Database connection failed", error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
