import { pool } from "../lib/lakebase";

export default function Page() {
  async function create(formData: FormData) {
    "use server";
    await pool.query(
      "CREATE TABLE IF NOT EXISTS comments (comment TEXT)"
    );
    const comment = formData.get("comment");
    await pool.query("INSERT INTO comments (comment) VALUES ($1)", [
      comment,
    ]);
  }
  return (
    <form
      action={create}
      className="bg-white h-screen w-screen flex flex-col items-center justify-center"
    >
      <div className="flex flex-col">
        <input
          type="text"
          name="comment"
          placeholder="Write a comment"
          className="rounded px-4 py-2 border outline-none focus:border-black"
        />
        <button
          type="submit"
          className="max-w-max px-3 py-1 mt-5 rounded bg-black text-white"
        >
          Submit &rarr;
        </button>
      </div>
    </form>
  );
}
