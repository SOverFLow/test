import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
const QuizComponent = dynamic(() => import("./components/QuizComponent"), {
  loading: () => <NiceLoading />,
  ssr: false,
});

export default function Questions() {
  return (
    <Box sx={{ mt: 5 }}>
      <QuizComponent />
      
    </Box>
  );
}
