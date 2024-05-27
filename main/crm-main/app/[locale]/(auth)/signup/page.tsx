"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, PeopleOutlined } from "@mui/icons-material";
import {
  BoxWithLogbg,
  StyledBoxedContainer,
  StyledContainer,
  StyledFirstBox,
  StyledLink,
  StyledSecondBox,
} from "../styles/style";
import { handleSignUpSecond } from "../styles/HandleSignClientSide";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";


const SignUpPage = () => {

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [isPendingRequest, setIsPendingRequest] = React.useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(() => e.target.value);
  };
  const handleChangePassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(() => e.target.value);
  };
  
  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors('');
    setIsPendingRequest(true)
    handleSignUpSecond(event)
    .then((user) => {
      if (user?.error)
      {
        dispatch(setUser(null));
        setErrors(() => user?.error?.message as string);
      }
      else
      {
        setErrors(()=> 'success');
        setEmail("");
        setPassword("");
        dispatch(setUser(user?.data));
        router.push(`/${value}/department`);
        router.refresh();
      }
      setIsPendingRequest(false)
    }).catch((e) => {
      setErrors(e.message);
      setIsPendingRequest(false)
    });
  };

const value = useSelector((state:RootState) => state?.langSlice?.value);
const t = useTranslations("login");

  return (
    <StyledContainer component="main">
      <StyledBoxedContainer boxShadow={4}>
        <StyledFirstBox>
        {errors == 'success' ? (
          <Alert severity="success">
            {t('you-have-successfully-signed-up')}<br />
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
              {t('sign-up-to-get-started')}
            </Typography>
          </Box>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSignUp}>
            <TextField
              id="email"
              label={t('email-address')}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChangeEmail}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton id="rand" aria-label="rand">
                      <PeopleOutlined />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
              {t('sign-up')}
            </Button>
            {errors != '' ? (
              <Alert severity="error">
                <AlertTitle>{t('error')}</AlertTitle>
                {t('there-was-an-error-signing-up')}{errors}
              </Alert>
            ) : (
              <></>
            )}
            <StyledLink href={`/${value}/reset`} variant="h6">
              {t('forgot-password')}
            </StyledLink>
          </Box>
        </>
        )}
        </StyledFirstBox>
        <StyledSecondBox boxShadow={10}></StyledSecondBox>
      </StyledBoxedContainer>
    </StyledContainer>
  );
};

export default SignUpPage;
