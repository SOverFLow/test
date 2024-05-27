"use client";
import { RootState } from "@/store";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateTask from "./CreateTask";
import CreateTask4Formation from "./CreateTask4Formation";

interface props {
  dialogOpenSteper: boolean;
  setDialogOpenSteper: (value: boolean) => void;
  showAddButton: boolean;
  selectedSlot?: any;
}

export default function WrapperCreateTask(props: props) {
  const supabase = createClient();
  const t = useTranslations("AddTaskForm");
  const translateObject = {
    no_option_found: t("No option found"),
    add_contract: t("Create New Contract for Service"),
    Add_Stock: t("Add Stock"),
    Task_per_Hours: t("Task per Hours"),
    Task_per_Days: t("Task per Days"),
    info_general: t("Information general"),
    info_location: t("Time, location and client"),
    consumubles_services: t("Consumubles & Products"),
    worker_info: t("Workers and task status"),
    price_summary: t("Selling price"),
    Formtitle: t("Formtitle"),
    title: t("title"),
    select_from_map: t("select from map"),
    description: t("description"),
    date: t("Task Date"),
    task_type: t("Task type"),
    address: t("address"),
    worker: t("worker"),
    status: t("status"),
    client: t("client"),
    priority: t("priority"),
    price: t("price"),
    long: t("long"),
    lattitude: t("lattitude"),
    start_date: t("start_date"),
    end_date: t("end_date"),
    add_button: t("add_button"),
    cancel_button: t("cancel_button"),
    Create_Task: t("Create Task"),
    Creation_Task: t("Creation Task"),
    New_Task: t("New Task"),
    dependecy: t("Dependency of task"),
    Work_Hours: t("Work Hours"),
    select_property: t("select property"),
    add_new_property: t("add new property"),
    consumables_From_Stock: t("Consumables From Stock"),
    Add_Product: t("Add Product"),
    consumables_out_the_stock: t("Extra buy"),
    Quantity_for: t("Quantity for"),
    Select_Client: t("Select Client"),
    Select_Worker: t("Select Worker"),
    Add_Worker: t("Add Worker"),
    Add_Client: t("Add Client"),
    low: t("Low"),
    medium: t("Medium"),
    high: t("High"),
    Selling_Price: t("Selling Price"),
    Selling_Price_ttc: t("Selling Price TTC per unit"),
    Selling_Price_HT: t("Selling Price HT per unit"),
    desired_product: t("select"),
    search: t("search"),
    add: t("Add"),
    No_consumables_found: t("No consumables found"),
    hour: t("hour"),
    day: t("day"),
    save: t("Save"),
    select_service: t("Select one or more service"),
    Delete: t("Delete"),
    Service: t("Service"),
    Quantity: t("Quantity"),
    color: t("Color"),
    save_and_new: t("Save and New"),
    Duplicate: t("Duplicate"),
    Save_as_Draft: t("Save as Draft"),
    Attachments: t("Attachments"),
    Repeat: t("Repeat"),
    submit_success: t("Task submitted successfully"),
    submit_error: t("Error submitting task"),
    update_success: t("Task updated successfully"),
    update_error: t("Error updating task"),
    error_fetching: t("Error fetching element"),
    save_dates_submit: t("Save Dates and submit tasks"),
    seletct_dates: t("Select Multiple Dates"),
    repeat_disc: t("Reapet description"),
    field_required: t("field required"),
    delete_image: t("Image deleted successfully"),
    Teacher_students_info: t("Teacher and students information"),
    Select_teacher: t("Select teacher"),
    Add_teacher: t("Add teacher"),
    Select_students: t("Select students"),
    in_progress: t("In progress"),
    done: t("Done"),
    pending: t("Pending"),
    delayed: t("Delayed"),
  };
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  
  const [isCenterFormation, setIsCenterFormation] = useState(false);
  
  useEffect(() => {
    const DepartementType = async () => {
      if (departmentId) {
        const { data, error } = await supabase
          .from("Department")
          .select("is_center_formation")
          .eq("uid", departmentId);
        if (error) {
          toast.error(error.message, {
            position: "bottom-right",
          });
          return;
        }
        const department = data[0];
        setIsCenterFormation(department?.is_center_formation!);
      }
    };
    DepartementType();
  }, [departmentId, supabase]);

  return (
    <>
      {!isCenterFormation && (
        <CreateTask
          tranlateObj={translateObject}
          dialogOpenSteper={props.dialogOpenSteper}
          setDialogOpenSteper={props.setDialogOpenSteper}
          showAddButton={props.showAddButton}
          selectedSlot={props.selectedSlot}
        />
      )}
      {isCenterFormation && (
        <CreateTask4Formation
          tranlateObj={translateObject}
          dialogOpenSteper={props.dialogOpenSteper}
          setDialogOpenSteper={props.setDialogOpenSteper}
          showAddButton={props.showAddButton}
          selectedSlot={props.selectedSlot}
        />
      )}
    </>
  );
}
