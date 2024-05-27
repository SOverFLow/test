import getDepartementSettingsInfo from "@/app/api/settings/actions/get_departemen_settings_info";
import getTva from "@/app/api/settings/actions/get_tva";
import updateCompanyTask from "@/app/api/settings/actions/update_company_Task";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FormEventHandler, useEffect, useState, useTransition } from "react";
import CustomTextInput from "../../Items/CustomTextInput";
import { TabParagraph } from "../../Items/TabParagraph";
import TableHeader from "../../Items/TableHeader";
import TableRow from "../../Items/TableRow";
import { useZodTaskTabSchema } from "@/schemas/zod/zod.TaskTab";
import CurrencyList from "currency-list";
type FormData = {
  [x: string]: any;
  currency?: string;
  ["working hours"]?: number;
  ["minimal minutes per task"]?: number;
};
type SelectItem = {
  label: string;
  value: number;
};
export default function TasksTab() {
  const t = useTranslations("SettingsPage.CompanyTab");
  const { slug } = useParams();
  const departement_id = (slug as string) ?? "";

  const items = [
    {
      title: t("currency"),
      name: "currency",
      inputType: "select",
      Placeholder: "Select currency",
    },
    {
      title: "Tva",
      name: "tva",
      inputType: "select",
    },
    {
      title: t("working-hours"),
      name: "working hours",
      inputType: "text",
    },
    {
      title: t("minimal-minutes-per-task"),
      name: "minimal minutes per task",
      inputType: "text",
    },
  ];
  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending2, startTransition2] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({});
  const [tvaList, setTvaList] = useState<any>([]);

  const TaskTabSchema = useZodTaskTabSchema();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");
    try {
      const result = TaskTabSchema.safeParse(formData);
      if (result.success === false) {
        console.log("++", result.error.errors[0].message),
          setErrors(result.error.errors[0].message);
        return;
      }
      console.log("formData", formData);

      // here we change the user password
      startTransition(() => {
        updateCompanyTask(formData, departement_id).then((data) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            setSuccess(data.success);
          }
        });
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    console.log("CurrencyList:", CurrencyList.getAll("en_US"));
    async function getData() {
      startTransition2(() => {
        getDepartementSettingsInfo(departement_id).then((data: any) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            const res = data?.success;
            // console.log("res1", res);
            if (!res) return;

            setFormData({
              currency: res.currency,
              ["working hours"]: res.working_hours,
              ["minimal minutes per task"]: res.minimal_minutes_per_task,
              tva: res.tva,
            });
          }
        });
        getTva(departement_id).then((data) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            const res = data?.data;
            if (!res) return;
            console.log("res2", res);
            const selectItemsTmp: SelectItem[] = res.map((item: any) => {
              return {
                label: item.name + " (" + item.value + "%)",
                value: item.value,
              };
            });
            setTvaList(selectItemsTmp);
          }
        });
      });
    }
    getData();
  }, [departement_id]);

  return (
    <Grid justifyContent={"center"}>
      <Grid item xs={12}>
        <FormControl
          noValidate
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          <TabParagraph sx={{ mx: 1, mb: 2, width: "100%" }}>
            {t("tasks-settings")}
          </TabParagraph>

          {/* title */}
          <TableHeader
            items={[t("tasks-settings"), t("value")]}
            sizes={[4, 4]}
          />
          {/* content */}
          <Grid>
            {items.map((item: any, index) => (
              <TableRow
                hasDivider={true}
                key={item.name + index}
                sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
                title={item.title}
              >
                <CustomTextInput
                  selectItems={item.name === "tva" ? tvaList : []}
                  name={item.name}
                  placeholder={item.Placeholder}
                  type={item.inputType}
                  multiline={item.Lines}
                  value={formData[item.name]}
                  handleChange={(e) => {
                    if (typeof e === "string") {
                      setFormData({ ...formData, [item.name]: e });
                      return;
                    }
                    if (
                      item.name === "working hours" ||
                      item.name === "minimal minutes per task"
                    ) {
                      if (isNaN(parseFloat(e.target.value))) {
                        setErrors(t("please-enter-a-number"));
                        return;
                      }
                      setFormData({
                        ...formData,
                        [item.name]: parseFloat(e.target.value),
                      });
                    } else {
                      setFormData({
                        ...formData,
                        [item.name]: e.target.value,
                      });
                    }
                  }}
                />
              </TableRow>
            ))}
          </Grid>
          {/* for Error and Successs messages */}
          {success! && (
            <Alert
              sx={{
                width: "95%",
                my: 1,
              }}
              severity="success"
            >
              {success}
            </Alert>
          )}
          {errors! && (
            <Alert
              sx={{
                display: "flex",
                width: "95%",
                my: 1,
              }}
              severity="error"
            >
              {errors}
            </Alert>
          )}
          {/* save Changes */}
          <Box sx={{ mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, width: "fit-content" }}
              disabled={isPending}
            >
              <Typography variant="body2" color={"white"}>
                {t("save-changes")}
              </Typography>
            </Button>
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
}
