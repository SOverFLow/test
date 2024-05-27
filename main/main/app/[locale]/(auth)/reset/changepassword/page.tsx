"use client";
import React  from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  BoxWithLogbg,
  StyledBoxedContainer,
  StyledContainer,
  StyledFirstBox,
  StyledSecondBox,
} from "../../styles/style";

import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { handleResetPasswordSecond } from "../../styles/HandleSignClientSide";
import { createClient } from "@/utils/supabase/client";
import { setUser } from "@/store/userSlice";
import { useTranslations } from "next-intl";

const ResetPage = () => {

  const [showPassword, setShowPassword] = React.useState(false);
  const [isPendingRequest, setIsPendingRequest] = React.useState(false);
  const [isPending, setIsPending] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState("");


  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations("login");

  const value = useSelector((state:RootState) => state?.langSlice?.value);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleChangePassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(() => e.target.value);
  };

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPassword("");
      setErrors('');
      setIsPendingRequest(true)
      handleResetPasswordSecond(event)
      .then((user) => {
        if (user?.error)
        {
          dispatch(setUser(null));
          setErrors(() => user?.error?.message as string);
        }
        else
        {
          setErrors(()=> 'success');
          setPassword("");
          dispatch(setUser(user?.data));
          console.log('user',user?.data);
          router.push(`/${value}/department`);
          router.refresh();
        }
        setIsPendingRequest(false)
      }).catch((e) => {
        setErrors(e.message);
        setIsPendingRequest(false)
      });
  };


    React.useEffect(() => {
        const session = async () => {
            const supabase = createClient()
            const session = await supabase.auth.getUser();
            console.log('session',session.data?.user);
            if (!session.data?.user) {
                router.push(`/${value}/login`);
            }
            if (session.data?.user)
              setIsPending(false)
            };
        session();
    });



  return (
    <>
    {
        !isPending ? (
    <StyledContainer component="main">
      <StyledBoxedContainer boxShadow={4}>
        <StyledFirstBox>
        {errors == 'success' ? (
          <Alert severity="success">
            {t('you-have-successfully-changed-your-password')}<br />
            {t('redirecting-to-your-homepage')}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Box>
          </Alert>
      ) : (
          <>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Typography
              component="h1"
              variant="h5"
              color="text.primary"
              gutterBottom
            >
              {t('welcome-to')}
            </Typography>
            <BoxWithLogbg />
            <Typography variant="body2" color="text.secondary" align="center">
              {t('reset-your-password')}
            </Typography>
          </Box>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleResetPassword}>
            <TextField
              name="password"
              label={t('password')}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChangePassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth sx={{ mt: 2, mb: 2, py: 1 }} disabled={isPendingRequest}>
              {t('create-new-password')}
            </Button>
            {errors != '' ? (
              <Alert severity="error">
                <AlertTitle>{t('error')}</AlertTitle>
                {t('there-was-an-error-changing-the-password')}{errors}
              </Alert>
            ) : (
              <></>
            )}
          </Box>
          </>
        )}
        </StyledFirstBox>
        <StyledSecondBox boxShadow={10}></StyledSecondBox>
      </StyledBoxedContainer>
    </StyledContainer>
        ) : (
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh" // Full viewport height
        >
            <CircularProgress />
            <Box component="span" marginLeft={2}>
                {t('loading')}
            </Box>
        </Box>
        )
    }
    </>
  );
};

export default ResetPage;
