import { redirect } from "next/navigation";

// /client-diaries was merged into /wall as the "Stories" section. We keep
// this route file so old links and bookmarks land in the right place
// instead of 404-ing.

export default function ClientDiariesRedirect() {
  redirect("/wall#stories");
}
