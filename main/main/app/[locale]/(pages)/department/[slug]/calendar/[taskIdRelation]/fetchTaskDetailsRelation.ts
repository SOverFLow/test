"use server";
import fetchPopUpDetail from "@/components/calendar/utils/fetchWorkerDetail";

interface RelatedTask {
    worker_name: string;
    client_name: string;
    address: string;
    uid: string;
    title: string;
    start_date: string,
    end_date: string,
  };

const fetchTaskDetailsRelation = async (taskIdRelation: string) => {
  let data = await fetchPopUpDetail(taskIdRelation);
  let returnData = {
    chosed_task: {} as RelatedTask,
    related_tasks: [] as RelatedTask[],
  };
  if (!data || typeof data === "string") return returnData;
  returnData.chosed_task = data as RelatedTask;
  while (typeof data === "object" && data.depend_on_id) {
    let id = data.depend_on_id;
    let data2 = await fetchPopUpDetail(id);
    data = data2;
    returnData.related_tasks.push(data2 as RelatedTask);
  }
  return returnData;
};

export default fetchTaskDetailsRelation;
