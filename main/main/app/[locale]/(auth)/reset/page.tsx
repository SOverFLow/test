"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { PeopleOutlined } from "@mui/icons-material";
import {
  BoxWithLogbg,
  StyledBoxedContainer,
  StyledContainer,
  StyledFirstBox,
  StyledSecondBox,
} from "./../styles/style";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import { handleResetSecond } from "../styles/HandleSignClientSide";
import { useTranslations } from "next-intl";

const ResetPage = () => {

  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [isPendingRequest, setIsPendingRequest] = React.useState(false);
  
  const value = useSelector((state:RootState) => state?.langSlice?.value);
  const t = useTranslations("login");

  const handleChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(() => e.target.value);
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors('');
    setIsPendingRequest(true)
    handleResetSecond(event,value)
    .then((user) => {
      if (user?.error)
        setErrors(() => user?.error?.message as string);
      else
      {
        setErrors(()=> 'success');
        setEmail("");
      }
      setIsPendingRequest(false);
    }).catch((e) => {
      setErrors(e.message);
      setIsPendingRequest(false);
    });
  };

  return (
    <StyledContainer component="main">
      <StyledBoxedContainer boxShadow={4}>
        <StyledFirstBox>
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
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleReset}>
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
                      <PeopleOutlined />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth sx={{ mt: 2, mb: 2, py: 1 }} disabled={isPendingRequest}>
              {t('send-reset-link')}
            </Button>
            {isPendingRequest && 
              <Box
              display="flex"
              justifyContent="center"
              alignItems="center" 
            >
              <CircularProgress />
              <Box component="span" marginLeft={2}>
                  {t('loading')}
              </Box>
            </Box>
            }
            {errors == 'success' ? <Alert severity="success">
              <AlertTitle>{t('success')}</AlertTitle>
                {t('we-have-sent-you-a-link-to-reset-the-password')}<br />
                {t('please-check-you-email')}
              </Alert>
              : errors != '' ? 
              <Alert severity="error">
              <AlertTitle>{t('error')}</AlertTitle>
                {t('there-was-an-error-sending-the-link-please')}{errors}<br />
                {t('please-try-again-later')}
              </Alert>
              :
              <></>
            }
            <Link href={`/${value}/login`}>
              {t('sign-in')}
            </Link>
          </Box>
        </StyledFirstBox>
        <StyledSecondBox boxShadow={10}></StyledSecondBox>
      </StyledBoxedContainer>
    </StyledContainer>
  );
};

export default ResetPage;
