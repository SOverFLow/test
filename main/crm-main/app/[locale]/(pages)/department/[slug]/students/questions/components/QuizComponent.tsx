"use client";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { toast } from "react-toastify";

const QuizComponent = () => {
  const [questions, setQuestions] = useState<any>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number[];
  }>({});
  const userId = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.id
  );
  const userRole = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.role
  );
  const { slug } = useParams();

  // console.log("<====>  user role <====>", userRole);
  // console.log("<====>  user <====>", userId);

  useEffect(() => {
    const supabase = createClient();
    const fetchQuestions = async () => {
      if (userRole != "student" && userRole != "super_admin") {
        router.back();
      }
      const { data, error } = await supabase
        .from("DepartmentSettings")
        .select("self_evaluation")
        .eq("department_id", slug as string);

      if (error) {
        console.error("Error fetching questions:", error);
        return;
      }

      setQuestions(data[0]?.self_evaluation);
    };
    startTransition(async () => {
      userRole && (await fetchQuestions());
    });
  }, [userRole]);

  const submitAnswers = async (event: React.FormEvent) => {
    const supabase = createClient();
    event.preventDefault();
    const formattedAnswers = formatAnswersForSubmission();

    console.log("<====>  selectedQuestions before <====>", questions);

    console.log("<====>  selectedAnswers after <====>", formattedAnswers);

    if (userRole != "student") {
      toast.error("You are not allowed to submit answers", {
        position: "top-right",
      });
      return;
    }
    const { data, error } = await supabase
      .from("Student")
      .update({ qcm_answers: formattedAnswers })
      .eq("uid", userId as string);

    if (error) {
      console.error("Error submitting answers:", error);
      return;
    }
    toast.success("Answers submitted successfully", {
      position: "top-right",
    });
  };

  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    checked: boolean
  ) => {
    setSelectedAnswers((prev) => {
      const answersForQuestion = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...answersForQuestion, answerId] };
      } else {
        return {
          ...prev,
          [questionId]: answersForQuestion.filter((id) => id !== answerId),
        };
      }
    });
  };

  const formatAnswersForSubmission = () => {
    return questions.map((question: any) => ({
      id: question.id,
      questionText: question.questionText,
      answers: question.answers.map((answer: any) => ({
        answerText: answer.answerText,
        id: answer.id,
        checked: selectedAnswers[question.id]?.includes(answer.id) ?? false,
      })),
    }));
  };

  return (
    <>
      {isPending && <NiceLoading />}
      {!isPending && (
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            QCM Quiz - Sélection
          </Typography>
          <form>
            {questions?.map((question: any) => (
              <Card key={question.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {question.questionText}
                  </Typography>
                  <FormGroup>
                    {question.answers.map((answer: any) => (
                      <FormControlLabel
                        key={answer.id}
                        control={
                          <Checkbox
                            checked={
                              selectedAnswers[question.id]?.includes(
                                answer.id
                              ) || false
                            }
                            onChange={(e) =>
                              handleAnswerChange(
                                question.id,
                                answer.id,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={answer.answerText}
                        sx={{ marginLeft: 0 }}
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              onClick={submitAnswers}
              sx={{ width: "100%", textTransform: "none", color: "white" }}
            >
              Submit
            </Button>
          </form>
        </Box>
      )}
    </>
  );
};

export default QuizComponent;
