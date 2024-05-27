import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const signOut = async () => {
  return await supabase.auth.signOut();
};

const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

const signUp = async (email:string,password:string) => {

  return await supabase.auth.signUp({
    email,
    password,
  });
};

const handleSubmitSecond = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (
    data.get("email") === null ||
    data.get("password") === null ||
    data.get("email") === "" ||
    data.get("password") === ""
  ) {
    console.log("Email or password is empty");
    return;
  }
  const dataToSend = {
    email: data.get("email") as string,
    password: data.get("password") as string,
  };
  return signIn(dataToSend.email, dataToSend.password);
};

const handleSignUpSecond = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (
    data.get("email") === null ||
    data.get("password") === null ||
    data.get("email") === "" ||
    data.get("password") === ""
  ) {
    console.log("Email or password is empty");
    return;
  }
  const dataToSend = {
    email: data.get("email") as string,
    password: data.get("password") as string,
  };
  return signUp(dataToSend.email, dataToSend.password);
};

const resetPasswordForEmail = async (email:string,locale:string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/${locale}/reset/changepassword`,
})
};

const resetUpdatePassword = async (password:string) => {
  return await supabase.auth.updateUser({
      password,
  });
}

const handleResetSecond = async (event: React.FormEvent<HTMLFormElement>,locale:string) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
  });

  if (
    data.get("email") === null ||
    data.get("email") === ""
  ) {
    console.log("Email is empty");
    return;
  }
  const dataToSend = {
    email: data.get("email") as string,
  };

  console.log('this is locale',locale);
  console.log('this is dataToSend',dataToSend);

  return resetPasswordForEmail(dataToSend.email, locale);
  
}

const handleResetPasswordSecond = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    password: data.get("password"),
  });

  if (
    data.get("password") === null ||
    data.get("password") === ""
  ) {
    console.log("Password is empty");
    return;
  }
  const dataToSend = {
    password: data.get("password") as string,
  };
  return resetUpdatePassword(dataToSend.password);
}

export { handleSubmitSecond, handleSignUpSecond, signOut,  signUp, handleResetSecond, handleResetPasswordSecond };
