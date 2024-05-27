import Calendar from "@/components/calendar";
import fetchServerTasks from "./utils";


export default async function Page({ params }: { params: { slug: string } }) {
  const tasks = await fetchServerTasks(params.slug);
  return <Calendar initialEvents={tasks} />;
}
