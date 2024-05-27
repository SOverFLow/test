"use client";
import updateProfile from "@/app/api/settings/actions/update_profile";
import { RootState } from "@/store";
import { profileSchema } from "@/utils/schemas/profile/profileSchema";
import { createClient } from "@/utils/supabase/client";
import uploadFile from "@/utils/supabase/uploadFile";
import convertImageToWebP from "@/utils/webPconverter";
import { AddAPhoto } from "@mui/icons-material";
import { Alert, CircularProgress, Divider, Stack, styled } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import CardProfileComponent from "./Items/CardProfileComponent";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

const Input = styled("input")({
  display: "none",
});

type UserData = {
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  avatar: string | null;
  status: string;
  uid: string;
  updated_at: string;
};

const Profile = () => {
  const supabase = createClient();
  const scrollableContainerRef = React.useRef<HTMLDivElement>(null);
  const [userData, setUserData] = React.useState<UserData>({
    created_at: "",
    email: "",
    first_name: "",
    id: 0,
    last_name: "",
    phone: "",
    avatar: "",
    status: "",
    uid: "",
    updated_at: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();
  const [errorUploading, setErrorUplaoding] = React.useState(false);
  const [zodErrors, setZodErrors] = React.useState<{
    first_name: string;
    last_name: string;
    phone: string;
    user_name: string;
  }>({
    first_name: "",
    last_name: "",
    phone: "",
    user_name: "",
  });
  const [userTable, setUserTable] = React.useState<string | undefined>("");
  const [errors, setErrors] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const user = useSelector((state: RootState) => state?.userSlice?.user);
  const userId = user?.user.id as string;
  React.useEffect(() => {
    async function fetchUserTable() {
      let { data: table, error: tableError } = await supabase.rpc(
        "get_user_table",
        {
          user_uid: userId,
        }
      );
      if (tableError) {
        console.error(tableError);
        return;
        // return { error: tableError.message };
      }
      setUserTable(table as string);
    }
    fetchUserTable();
  }, [userId, supabase]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      if (
        event.target.files &&
        event.target.files[0] &&
        event.target.files[0].type.startsWith("image") &&
        event.target.files[0].size < 10485760
      ) {
        const form = new FormData();
        const result = await convertImageToWebP(event.target.files[0]);
        form.append("file", result as File);
        form.append("bucket", "Photos");
        form.append("oldPath", userData.avatar as string);
        form.append("path", `public/profile/avatar-${v4()}.webp`);
        form.append("uid", `${userData.uid}`);
        form.append("tableName", userTable as string);
        if (event.target.files) {
          console.log("userTable", userTable);
          uploadFile(form)
            .then(({ data }) => {
              setUserData((prev) => ({
                ...prev,
                avatar: data?.publicUrl as string,
              }));
              setErrorUplaoding(false);
            })
            .catch((error) => {
              console.error("errortransition", error);
            });
        }
      } else {
        setErrorUplaoding(true);
      }
    });
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const user = await supabase.auth.getUser();
        const userRole = user.data.user?.role;
        if (!userRole) {
          return { error: "An error occurred while fetching banks data" };
        }
        const query = await getTablePermissionForSpecificRows(
          userRole,
          userTable as "SuperAdmin" | "UserWorker" | "Client" | "Student",
          [
            // " first_name, last_name, email, phone, avatar, uid"
            "first_name",
            "last_name",
            "email",
            "phone",
            "avatar",
            "uid",
          ]
        );

        const { data, error }: any = await supabase
          .from(userTable as "SuperAdmin" | "UserWorker" | "Client" | "Student")
          .select(query)
          .eq("uid", userId)
          .single();
        console.log("error", error);
        if (data) {
          setUserData({
            created_at: "",
            email: data.email,
            first_name: data.first_name,
            id: 0,
            last_name: data.last_name,
            phone: data.phone,
            avatar: data.avatar,
            status: "",
            uid: data.uid,
            updated_at: "",
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    if (user) {
      fetchUser();
    } else {
      setLoading(false); // And here, if there's no user
    }
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = 0;
    }
  }, [user, userTable, userId, supabase]);
  const userProfileData = React.useMemo(
    () =>
      loading
        ? []
        : [
            {
              title: "First Name",
              name: "first_name",
              value: userData.first_name || "",
            },
            {
              title: "Last Name",
              name: "last_name",
              value: userData.last_name || "",
            },
            {
              title: "Email",
              name: "email",
              value: (user?.user.email as string) || "",
            },
            {
              title: "Phone ",
              name: "phone",
              value: userData.phone || "",
            },
          ],
    [userData, loading, user?.user.email]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
    // myValue?: string
  ) => {
    setZodErrors({
      first_name: "",
      last_name: "",
      phone: "",
      user_name: "",
    });
    const { name, value } = event.target;

    // if (myValue) {
    //   setUserData((prevUserData) => ({
    //     ...prevUserData,
    //     phone: myValue,
    //   }));
    //   return;
    // }
    // console.log("event.target", event.target.value);
    // console.log("event.target.name", event.target.name);
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = profileSchema.safeParse(userData);
    if (result.success === false) {
      console.log("++", result.error.errors[0].message),
        setZodErrors(
          result.error.errors.reduce(
            (acc: any, issue: any) => {
              acc[issue.path[0]] = issue.message;
              return acc;
            },
            {} as Record<string, string>
          )
        );
      return;
    }
    // console.log("Form Submitted:", userData);

    // here we change the user password
    startTransition(() => {
      startTransition(() => {
        updateProfile(userData).then((data) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            setSuccess(data.success);
          }
        });
      });
    });
  };

  return (
    <>
      {isPending ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Alert severity="success">
            We are modifying your profile data
            <br />
            Please Wait
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          </Alert>
        </Box>
      ) : (
        <Box
          component={"form"}
          ref={scrollableContainerRef}
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            overflowY: "auto",
            maxHeight: { xs: "calc(100vh - 106px)", sm: "calc(100vh - 240px)" },
            justifyContent: "flex-start",
            alignItems: "flex-start",
            alignContent: "flex-start",
            gap: "10px",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              Profile
            </Typography>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={userData.avatar as string}
                  sx={{ width: 100, height: 100, mb: 2 }}
                  alt="Profile Picture"
                />
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: -4,
                      margin: "0",
                      backgroundColor: (theme) => theme.palette.primary.light,
                      padding: "0",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.primary.dark,
                        color: "white",
                        fontSize: "4rem",
                      },
                    }}
                  >
                    <AddAPhoto
                      sx={{
                        m: 1,
                      }}
                    />
                  </IconButton>
                </label>
              </Box>
            </Stack>
          </Box>
          {errorUploading && (
            <Alert severity="error">
              Please select a valid image file Or image size is more than 10Mb
            </Alert>
          )}

          <Divider />

          <CardProfileComponent
            userData={userProfileData}
            cardTitle="Personal Information"
            handleChange={handleChange}
            errors={zodErrors}
          />
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
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isPending}
          >
            <Typography variant="body2" color={"#fff"}>
              Save changes
            </Typography>
          </Button>
        </Box>
      )}
    </>
  );
};

export default Profile;
