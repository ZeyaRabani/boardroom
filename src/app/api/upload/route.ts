import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST multipart/form-data { file: PDF } -> { text }. */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response("expected multipart/form-data", { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return new Response("`file` is required", { status: 400 });
  }
  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });
    return Response.json({
      text: text.slice(0, 16000),
      filename: file.name,
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
