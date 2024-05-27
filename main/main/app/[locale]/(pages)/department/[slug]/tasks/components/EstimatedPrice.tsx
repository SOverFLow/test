import { getPricing_hours } from "@/app/api/settings/actions/getPricing_hours";
import { RootState } from "@/store";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
interface EstimatedPriceProps {
  additional_cost?: number;
  products_out_stock: any[];
  products_in_stock: any[];
  currency?: string;
  task?: any;
  worker_salary?: any;
  onEstimateChange: (task_cost: number, services_cost: number) => void;
}

export function calcTTC(price: number, tva: number): number {
  return price * (tva / 100 + 1);
}

const EstimatedPrice: React.FC<EstimatedPriceProps> = ({
  additional_cost,
  currency,
  worker_salary,
  products_out_stock,
  products_in_stock,
  task,
  onEstimateChange,
}) => {
  const t = useTranslations("AddTaskForm");
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [isPending2, startTransition2] = useTransition();
  const [hour_multiplicator, setHour_multiplicator] = useState<any>();
  const [date, setDate] = useState<any>();
  const [products_cost, setProducts_SellPrice] = useState<number>(0);
  const [services_cost, setServices_cost] = useState<number>(0);
  const [estimate, setEstimate] = useState<number>(0);
  const [products_costTtc, setProducts_costTtc] = useState<number>(0);

  useEffect(() => {
    let sell_price = 0;
    let cost_ttc = 0;
    if (products_out_stock) {
      products_out_stock.forEach((product) => {
        sell_price +=
          calcTTC(
            parseFloat(product?.sell_price),
            parseFloat(product?.sell_tva?.value)
          ) * product?.quantity;

        cost_ttc +=
          calcTTC(
            parseFloat(product?.buy_price),
            parseFloat(product?.buy_tva?.value)
          ) * product?.quantity;
      });
    }
    if (products_in_stock) {
      products_in_stock.forEach((product) => {
        sell_price +=
          calcTTC(
            parseFloat(product?.sell_price),
            parseFloat(product?.sell_tva?.value)
          ) * product?.quantity;

        cost_ttc +=
          calcTTC(
            parseFloat(product?.buy_price),
            parseFloat(product?.buy_tva?.value)
          ) * product?.quantity;
      });
    }
    setProducts_SellPrice(sell_price);
    setProducts_costTtc(cost_ttc);
  }, [products_out_stock, products_in_stock]);

  useEffect(() => {}, [products_in_stock]);

  useEffect(() => {
    if (task?.services?.length === 0) {
      setServices_cost(0);
    }
    if (task?.services) {
      const calculateServicesCost = (task: any) => {
        const services = task?.services;
        let cost = 0;
        services?.forEach((service: any) => {
          cost += service?.selection?.selling_price_ttc * service?.quantity;
        });
        setServices_cost(cost);
      };
      calculateServicesCost(task);
    }
  }, [task]);

  useEffect(() => {
    const getHour_multiplicator = async () => {
      startTransition2(() => {
        getPricing_hours(departmentId).then((data) => {
          if (data?.error) {
            toast(
              "An error occurred while fetching data, please try again later",
              {
                position: "bottom-right",
              }
            );
          } else {
            const res = data?.success;
            setHour_multiplicator(res?.pricing_hours);
          }
        });
      });
    };
    if (departmentId) getHour_multiplicator();
  }, [departmentId]);

  useEffect(() => {
    onEstimateChange(estimate, services_cost);
  }, [estimate, services_cost]);
  +products_cost;

  const getHourlyRateMultiplier = (date: any, hour: any) => {
    if (!date) return 1;
    const dayOfWeek = new Date(date).getDay();
    const taskdate = new Date(date);
    const dateString = taskdate?.toISOString()?.split("T")[0];

    // Check if it's a day off
    if (hour_multiplicator?.daysOff.dates.includes(dateString)) {
      return parseFloat(hour_multiplicator?.daysOff.priceMultiplication);
    }

    // Check if it's Saturday or Sunday
    if (dayOfWeek === 6) {
      return parseFloat(hour_multiplicator?.saturdayPriceMultiplication);
    } else if (dayOfWeek === 0) {
      return parseFloat(hour_multiplicator?.sundayPriceMultiplication);
    }

    // Check within time ranges
    let multiplier = 1;
    hour_multiplicator?.timeRanges.forEach((range: any) => {
      const startRangeHour = parseInt(range.startTime.split(":")[0]);
      const endRangeHour = parseInt(range.endTime.split(":")[0]);
      if (
        (hour >= startRangeHour && hour < endRangeHour) ||
        (endRangeHour < startRangeHour &&
          (hour >= startRangeHour || hour < endRangeHour))
      ) {
        multiplier = parseFloat(range.priceMultiplication);
      }
    });
    return multiplier;
  };

  const getDailyMultiplier = (date: any) => {
    const dayOfWeek = new Date(date).getDay();
    const taskdate = new Date(date);
    const dateString = taskdate?.toISOString().split("T")[0];

    // Check if it's a day off
    if (hour_multiplicator?.daysOff.dates.includes(dateString)) {
      return parseFloat(hour_multiplicator?.daysOff.priceMultiplication);
    }

    // Check if it's Saturday or Sunday
    if (dayOfWeek === 6) {
      return parseFloat(hour_multiplicator?.saturdayPriceMultiplication);
    } else if (dayOfWeek === 0) {
      return parseFloat(hour_multiplicator?.sundayPriceMultiplication);
    }
    return 1;
  };

  const calculateTotalCost = useCallback(
    (task: any, worker_salaries: any, pricing_hours: any) => {
      let totalCost = 0;
      if (task.start_date && task.workers) {
        const startDate = new Date(task.start_hour);
        const endDate = new Date(task.end_hour);
        const taskDate = date;

        if (!taskDate) return 0;

        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const totalHours = endHour - startHour;

        if (worker_salaries && worker_salaries) {
          worker_salaries?.forEach((worker_salary: any) => {
            let hourlyRate = worker_salary.salary_hour;
            let dailyRate = worker_salary.salary_day;
            let costForWorker = 0;
            const startHour = new Date(task.start_hour).getHours();
            const endHour = new Date(task.end_hour).getHours();

            if (task.task_type === "hours") {
              for (let i = startHour; i < endHour; i++) {
                let multiplier = getHourlyRateMultiplier(task.start_date, i);
                costForWorker += hourlyRate * multiplier;
              }
            } else if (task.task_type === "days" && task?.start_date) {
              const dailyMultiplier = getDailyMultiplier(task?.start_date);
              costForWorker += dailyRate * dailyMultiplier;
            }

            totalCost += costForWorker;
          });
        }
      } else {
        return 0;
      }

      return totalCost;
    },
    [getHourlyRateMultiplier, getDailyMultiplier, date]
  );

  useEffect(() => {
    setDate(task?.start_date);
    const cost = calculateTotalCost(
      task,
      task.workers,
      hour_multiplicator?.pricing_hours
    );
    if (task) {
      additional_cost && additional_cost > 0
        ? setEstimate(cost + additional_cost)
        : setEstimate(cost);
    }
  }, [task, hour_multiplicator, products_cost]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginTop: "1rem",
        padding: "1rem",
        border: "1px solid #E0E0E0",
        borderRadius: "5px",
        width: "100%",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        sx={{
          fontWeight: 550,
          fontSize: "1.2rem",
          color: "#444444",
          display: "flex",
          alignItems: "end",
        }}
      >
        {t("Estimated price")} :
      </Typography>

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          listStyleType: "inherit",
        }}
      >
        <ListItem sx={{ padding: "auto 0" }}>
          <Typography
            sx={{ color: "#333333", fontWeight: 500, fontSize: "1rem" }}
          >
            {t("Selling Price")} :{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 550,
                fontSize: "1rem",
                color: "#00ACC1",
              }}
            >
              {services_cost + " " + currency}
            </Typography>
          </Typography>
        </ListItem>

        <ListItem
          itemType="disc"
          sx={{ padding: "auto 0", listStyle: "inside" }}
        >
          <Typography
            sx={{ color: "#333333", fontWeight: 500, fontSize: "1rem" }}
          >
            {t("Workers cost")}
            {" : "}
            <Typography
              component="span"
              sx={{
                fontWeight: 550,
                fontSize: "1rem",
                color: "#00ACC1",
              }}
            >
              {estimate.toFixed(2) + " " + currency}
            </Typography>
          </Typography>
        </ListItem>

        <ListItem sx={{ padding: "auto 0" }}>
          <Typography
            sx={{ color: "#333333", fontWeight: 500, fontSize: "1rem" }}
          >
            {t("Consumables cost TTC")} :{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 550,
                fontSize: "1rem",
                color: "#00ACC1",
              }}
            >
              {products_cost.toFixed(2) + " " + currency}
            </Typography>
          </Typography>
        </ListItem>

        <ListItem sx={{ padding: "auto 0" }}>
          <Typography
            sx={{ color: "#333333", fontWeight: 500, fontSize: "1rem" }}
          >
            {t("Consumables sell price TTC")} :{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 550,
                fontSize: "1rem",
                color: "#00ACC1",
              }}
            >
              {products_costTtc.toFixed(2) + " " + currency}
            </Typography>
          </Typography>
        </ListItem>
      </List>

      <Typography sx={{ color: "#444444", fontWeight: 550, fontSize: "1rem" }}>
        {t("Net profit")}:{" "}
        <strong>
          {(services_cost - estimate).toFixed(2) + " " + currency}
        </strong>
      </Typography>
      <Typography sx={{ color: "#444444", fontWeight: 550, fontSize: "1rem" }}>
        {t("Total cost")}:{" "}
        <strong>{estimate.toFixed(2) + " " + currency}</strong>
      </Typography>
    </Box>
  );
};

export default EstimatedPrice;
