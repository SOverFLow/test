"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export default async function getWorkingHours(department_id: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user = await supabase.auth.getUser();

    if (!user) {
        console.error('No user logged in');
        return;
    }

    try {
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        const { data, error } = await supabase
            .from('task_user_worker')
            .select(`
                user_worker_id,
                UserWorker(uid, first_name, last_name, avatar),
                Task(uid, start_date, end_date, status)
            `)
            .gte('Task.start_date', fiveDaysAgo.toISOString())
            .eq('Task.status', 'done');

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        // Calculate total hours for each worker including all tasks and gather worker details
        const workerHoursDetails = data.reduce((acc: any[], item: any) => {
            const { UserWorker, Task } = item;
            if (Task) {
                const startDate = new Date(Task.start_date);
                const endDate = new Date(Task.end_date);
                const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // convert ms to hours

                const existingWorker = acc.find(w => w.uid === UserWorker.uid);
                if (existingWorker) {
                    existingWorker.hours += duration; // Add hours if worker already exists in array
                } else {
                    acc.push({ // Add new worker with initial hours and details
                        workerName: UserWorker.first_name + ' ' + UserWorker.last_name,
                        hours: duration,
                        uid: UserWorker.uid,
                        avatar: UserWorker.avatar || ""
                    });
                }
            }
            return acc;
        }, []);

        console.log(workerHoursDetails);
        return workerHoursDetails;
    } catch (error) {
        console.error('Error processing data:', error);
    }
}
