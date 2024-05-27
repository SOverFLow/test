import { getHotEvaluation } from "@/app/api/settings/actions/getHotEvaluation";
import updateQcm from "@/app/api/settings/actions/update_qcm";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Question = {
  id: number;
  newAnswer: string;
  questionText: string;
  answers: Answer[];
};

type Answer = {
  answerText: string;
  id: number;
};

type Error = {
  questionId: number;
  errorText: string;
};

export default function HotEvaluation() {
  const { slug } = useParams();
  const departement_id = (slug as string) ?? "";

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      newAnswer: "",
      questionText: "",
      answers: [],
    },
  ]);
  const [fetchErrors, setFetchErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Error[]>([]);

  const handleAddAnswer = (questionId: number, newAnswer: string) => {
    const myNewAnswer: Answer = {
      answerText: newAnswer,
      id: Date.now(),
    };
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const updatedAnswers = [...q.answers, myNewAnswer];
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setSuccess("");
    setErrors([]);
    const newQuestion = {
      id: Date.now(),
      questionText: "",
      newAnswer: "",
      answers: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveAnswer = (questionIndex: number, answerId: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionIndex) {
        return { ...q, answers: q.answers.filter((a) => a.id !== answerId) };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    const errorsTmp: Error[] = [];

    questions.forEach((q) => {
      // skip the last question
      if (q.id === questions[questions.length - 1].id) return;

      // check if there is an empty question
      if (!q.questionText) {
        errorsTmp.push({ questionId: q.id, errorText: "Question is empty" });
      }
      // check if there is an empty answer
      q.answers.forEach((a) => {
        if (!a.answerText) {
          errorsTmp.push({
            questionId: q.id,
            errorText: "One of the answers is empty",
          });
        }
      });
      // check if there is at least 2 answers
      if (q.answers.length < 2) {
        errorsTmp.push({
          questionId: q.id,
          errorText: "You need at least 2 answers",
        });
      }
    });
    if (errorsTmp.length > 0) {
      setErrors(errorsTmp);
      return -1;
    }
  };

  const handleSubmit = () => {
    setSuccess("");
    if (validateQuestions() === -1) return;
    startTransition(() => {
      updateQcm(questions, departement_id, "hot_evaluation").then((data) => {
        if (data?.error) {
          console.log("error", data.error);
          // setErrors(data.error);
        } else {
          setFetchErrors("");
          setErrors([]);
          setSuccess("QCM has been updated!");
        }
      });
    });
    console.log(questions);
  };

  useEffect(() => {
    if (!departement_id) return;
    startTransition(() => {
      getHotEvaluation(departement_id).then((data: any) => {
        if (data?.success) {
          const qcmData = data.success.hot_evaluation ?? [];
          console.log("qcmData", qcmData);
          const questionsTmp: Question[] = qcmData.map((question: any) => {
            return {
              id: question.id,
              questionText: question.questionText,
              newAnswer: "",
              answers: question.answers,
            };
          });
          questionsTmp.push({
            id: Date.now(),
            newAnswer: "",
            questionText: "",
            answers: [],
          });
          setQuestions(questionsTmp);
        } else {
          console.log("error", data?.error);
        }
      });
    });
  }, [departement_id]);

  return (
    <Grid
      spacing={2}
      padding={2}
      sx={{
        px: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",

        padding: 0,
      }}
    >
      {isPending && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      {questions.map((question, index) => (
        <>
          <Paper
            key={question.id}
            sx={{
              padding: 2,
              backgroundColor:
                index === questions.length - 1 ? "white" : cyan[50],
              my: 2,
              border:
                errors.find((e) => e.questionId === question.id) &&
                index !== questions.length - 1
                  ? "1px solid red"
                  : "1px solid transparent",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",

                alignItems: "center",
              }}
            >
              <Typography variant="h5">Enter your Question</Typography>
              {index !== questions.length - 1 && (
                <Button
                  sx={{
                    color: "white",
                  }}
                  disabled={isPending}
                  onClick={() => {
                    const updatedQuestions = questions.filter(
                      (q) => q.id !== question.id
                    );
                    setQuestions(updatedQuestions);
                  }}
                >
                  <DeleteIcon />
                  {"Delete"}
                </Button>
              )}
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
              }}
              direction="row"
            >
              <TextField
                value={question.questionText}
                onChange={(e) => {
                  setQuestions((prev) =>
                    prev.map((q) => {
                      if (q.id === question.id) {
                        return { ...q, questionText: e.target.value };
                      }
                      return q;
                    })
                  );
                }}
                placeholder="Enter new question"
                variant="outlined"
                sx={{
                  width: "70%",

                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      index === questions.length - 1 ? "" : "white",
                  },
                }}
              />
            </Grid>

            {/* list all possible answers */}
            {question.answers.map((answer) => (
              <Grid key={answer.id} container alignItems="center" spacing={2}>
                <Grid item>
                  <Checkbox checked />
                </Grid>
                <Grid item>
                  <TextField
                    variant="standard"
                    // sx={{
                    //   "& .MuiOutlinedInput-root": {
                    //     backgroundColor:
                    //       index === questions.length - 1 ? "" : "white",
                    //   },
                    // }}
                    value={answer.answerText}
                    onChange={(e) => {
                      setQuestions((prev) =>
                        prev.map((q) => {
                          if (q.id === question.id) {
                            return {
                              ...q,
                              answers: q.answers.map((a) => {
                                if (a.id === answer.id) {
                                  return { ...a, answerText: e.target.value };
                                }
                                return a;
                              }),
                            };
                          }
                          return q;
                        })
                      );
                    }}
                    placeholder="Enter possible answer"
                  />
                </Grid>
                <Grid item>
                  <Button
                    sx={{
                      color: "white",
                    }}
                    disabled={isPending}
                    onClick={() => handleRemoveAnswer(question.id, answer.id)}
                  >
                    <DeleteIcon />
                    {"Delete"}
                  </Button>
                </Grid>
              </Grid>
            ))}

            {/* section for add new possible answer */}
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Checkbox disabled />
              </Grid>
              <Grid item>
                <TextField
                  value={question.newAnswer}
                  onChange={(e) => {
                    // setNewAnswer(e.target.value);
                    setQuestions((prev) =>
                      prev.map((q) => {
                        if (q.id === question.id) {
                          return { ...q, newAnswer: e.target.value };
                        }
                        return q;
                      })
                    );
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                    },
                  }}
                  variant="standard"
                  placeholder="Enter possible answer"
                />
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    color: "white",
                  }}
                  disabled={isPending}
                  onClick={() => {
                    handleAddAnswer(question.id, question.newAnswer);
                    setQuestions((prev) =>
                      prev.map((q) => {
                        if (q.id === question.id) {
                          return { ...q, newAnswer: "" };
                        }
                        return q;
                      })
                    );
                  }}
                >
                  <AddIcon />
                  {"Add answer"}
                </Button>
              </Grid>
            </Grid>

            {/* display error message */}
            {index !== questions.length - 1 &&
              errors
                .filter((e) => e.questionId === question.id)
                .map((e) => (
                  <Typography key={e.errorText} variant="caption" color="error">
                    {e.errorText}
                    <br />
                  </Typography>
                ))}
          </Paper>
          {/* button for add new question */}
          {questions[questions.length - 1].id === question.id && (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  alignSelf: "flex-start",
                  ml: 2,
                  color: "white",
                }}
                disabled={isPending}
                onClick={handleAddQuestion}
              >
                <AddIcon />
                Add New Question
              </Button>
            </Grid>
          )}
        </>
      ))}
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
      {fetchErrors! && (
        <Alert
          sx={{
            display: "flex",
            width: "95%",
            my: 1,
          }}
          severity="error"
        >
          {fetchErrors}
        </Alert>
      )}
      <Button
        variant="contained"
        sx={{
          my: 2,
          px: 4,
          width: "fit-content",
          color: "white",
        }}
        disabled={isPending}
        onClick={handleSubmit}
      >
        save
      </Button>
    </Grid>
  );
}
